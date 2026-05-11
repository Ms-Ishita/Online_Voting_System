import Vote from "./vote.model.js"
import Election from "../elections/election.model.js"
import Candidate from "../candidates/candidate.model.js"
import User from "../users/user.model.js"
import AppError from "../../utils/AppError.js"
import crypto from "crypto"
import { sendEmail } from "../../utils/mailer.js"

export const generateAndSendOTP = async (userId, electionId) => {
    const election = await Election.findByPk(electionId)
    if (!election) throw new AppError("Election not found", 404)
    
    const now = new Date()
    const isWithinTime = now >= election.start_time && now <= election.end_time
    if (election.status !== "active" || !isWithinTime) {
        throw new AppError("Voting is not allowed for this election right now", 400)
    }

    const user = await User.findByPk(userId)
    if (!user) throw new AppError("User not found", 404)

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    
    // Set expiry to 10 minutes from now
    user.otp = otp
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    const message = `Your OTP to cast a vote for ${election.title} is: ${otp}. It will expire in 10 minutes.`

    try {
        await sendEmail(user.email, "Your Voting OTP", message)
    } catch (error) {
        console.error("Failed to send OTP email to", user.email)
        throw new AppError("Failed to send OTP email. Please try again later.", 500)
    }
    
    return true
}

// cast vote
export const castVote=async({userId, candidateId, electionId, otp})=>{

    const election = await Election.findByPk(electionId)
    if(!election){
        throw new AppError("Election not found", 404)
    }
    const now = new Date()
    const isWithinTime = now >= election.start_time && now <= election.end_time
    if (election.status !== "active" || !isWithinTime){
        throw new AppError("Voting is not allowed", 400)
    }

    const candidate = await Candidate.findByPk(candidateId)
    if(!candidate){
        throw new AppError("Candidate not found", 404)
    }

    if (Number(candidate.election_id) !== Number(electionId)) {
        throw new AppError("Candidate does not belong to this election", 400)
    }

    const user = await User.findByPk(userId)
    if (!user) throw new AppError("User not found", 404)

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
        throw new AppError("Invalid OTP", 400)
    }

    if (new Date() > user.otpExpiresAt) {
        throw new AppError("OTP has expired. Please request a new one.", 400)
    }

    try {
        const vote = await Vote.create({
            voter_id: userId,
            candidate_id: candidateId,
            election_id: electionId
        })

        // Clear OTP after successful vote
        user.otp = null
        user.otpExpiresAt = null
        await user.save()

        return vote
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError"){
            throw new AppError("User has already voted", 400)
        }
        throw error
    }
    
}