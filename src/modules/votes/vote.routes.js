import { Router } from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { castVoteSchema, requestOtpSchema } from "./vote.schema.js"
import { castVote, requestOTP } from "./vote.controller.js"

const router = Router()

router.post("/request-otp", authMiddleware, validate(requestOtpSchema), requestOTP)
router.post("/", authMiddleware, validate(castVoteSchema), castVote)

export default router