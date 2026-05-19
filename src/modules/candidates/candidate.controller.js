import * as candidateService from "./candidate.service.js"

export const addCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.addCandidate(
      req.body,
      req.file
    )

    res.status(201).json({
      message: "Candidate added",
      candidateId: candidate.id,
      photo_url: candidate.photo_url
    })

  } catch (error) {
    next(error)
  }
}

export const getCandidates=async(req, res, next)=>{
    try {
        const candidates = await candidateService.getCandidatesByElection(req.params.electionId)
        res.json(candidates)
    } catch (error) {
        next(error)
    }
}

export const deleteCandidate=async (req, res, next) => {
    try {
        await candidateService.deleteCandidate(req.params.id)

        res.json({message: "Candidate deleted"})
    } catch (error) {
        next(error)
    }
}