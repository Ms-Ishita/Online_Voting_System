import { Router } from "express"
import authMiddleware from "../../middleware/auth.middleware.js"
import roleMiddleware from "../../middleware/role.middleware.js"
import validate from "../../middleware/validate.middleware.js"
import { createElectionSchema, electionIdSchema } from "./election.schema.js"
import { createElection, endElection, getAllElections, getElectionById, startElection } from "./election.controller.js"

const router = Router()

// admin
router.post("/", authMiddleware, roleMiddleware("admin"), validate(createElectionSchema), createElection)
router.put("/start/:id", authMiddleware, roleMiddleware("admin"), validate(electionIdSchema), startElection)
router.put("/end/:id", authMiddleware, roleMiddleware("admin"), validate(electionIdSchema), endElection)

// public
router.get("/", getAllElections)
router.get("/:id", validate(electionIdSchema), getElectionById)

export default router