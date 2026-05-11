import { Router } from "express"
import { register, login, verifyEmail } from "./auth.controller.js"
import validate from "../../middleware/validate.middleware.js"
import { registerSchema, loginSchema, verifyEmailSchema } from "./auth.schema.js"

const router=Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail)

export default router