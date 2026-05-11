import Election from "./election.model.js"
import AppError from "../../utils/AppError.js"

// create election (admin)
export const createElection=async({title, description, start_time, end_time})=>{
    if(new Date(start_time) >= new Date(end_time)){
        throw new AppError("Start time must be before end time", 400)
    }

    const election = await Election.create({
        title,
        description,
        start_time,
        end_time,
        status: "upcoming"
    })

    return election
}

// get all elections
export const getAllElections=async()=>{
    return Election.findAll()
}

// get single election
export const getElectionById=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }
    return election
}

// start election (admin)
export const startElection=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }

    if(election.status !== "upcoming"){
        throw new AppError("Election cannot be started", 400)
    }
    
    election.status = "active"
    await election.save()

    return election
}

// end election (admin)
export const endElection=async(id)=>{
    const election = await Election.findByPk(id)
    if(!election){
        throw new AppError("Election not found", 404)
    }

    if(election.status !== "active"){
        throw new AppError("Election is not active", 400)
    }

    election.status = "ended"
    await election.save()

    return election
}