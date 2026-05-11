import { z } from "zod"

export const castVoteSchema = z.object({
  body: z.object({
    candidate_id: z.number().int().positive("Candidate ID must be a positive integer").or(z.string().regex(/^\d+$/, "Candidate ID must be a positive integer")),
    election_id: z.number().int().positive("Election ID must be a positive integer").or(z.string().regex(/^\d+$/, "Election ID must be a positive integer")),
    otp: z.string().length(6, "OTP must be exactly 6 characters")
  })
})

export const requestOtpSchema = z.object({
  body: z.object({
    election_id: z.number().int().positive("Election ID must be a positive integer").or(z.string().regex(/^\d+$/, "Election ID must be a positive integer"))
  })
})
