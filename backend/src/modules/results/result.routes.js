import { Router } from "express"
import validate from "../../middleware/validate.middleware.js"
import { electionIdSchema } from "../elections/election.schema.js"
import { getResults, getWinner } from "./result.controller.js"

const router = Router()

router.get("/:id", validate(electionIdSchema), getResults)
router.get("/:id/winner", validate(electionIdSchema), getWinner)

export default router