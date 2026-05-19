import { z } from "zod"

export const addCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Candidate name is required"),
    party: z.string().min(1, "Party name is required"),
    election_id: z.string().min(1, "Election ID is required")
  })
})

export const candidateIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Candidate ID is required")
  })
})

export const getCandidatesSchema = z.object({
  params: z.object({
    electionId: z.string().min(1, "Election ID is required")
  })
})
