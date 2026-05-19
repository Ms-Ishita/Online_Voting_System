import * as resultService from "./result.service.js"

export const getResults = async (req, res, next) => {
  try {
    const results = await resultService.getResults(req.params.id)
    res.json(results)
  } catch (error) {
    next(error)
  }
}

export const getWinner = async (req, res, next) => {
  try {
    const winner = await resultService.getWinner(req.params.id)
    res.json({
      candidate_id: winner.candidate_id,
      name: winner.Candidate.name,
      party: winner.Candidate.party,
      votes: winner.dataValues.votes,
      photo: winner.Candidate.photo_url
    })

  } catch (error) {
    next(error)
  }
}