import * as voteService from "./vote.service.js"

export const castVote=async(req, res, next)=>{
    try {
        const userId = req.user.id
        const {candidate_id, election_id, otp} = req.body

        const vote = await voteService.castVote({
            userId,
            candidateId: candidate_id,
            electionId: election_id,
            otp
        })
        res.status(201).json({message: "Vote casted successfully", voteId: vote.id})
    } catch (error) {
        next(error)
    }
}

export const requestOTP = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { election_id } = req.body

        await voteService.generateAndSendOTP(userId, election_id)

        res.status(200).json({ message: "OTP sent to your registered email" })
    } catch (error) {
        next(error)
    }
}