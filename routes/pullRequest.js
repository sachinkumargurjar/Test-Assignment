import express from "express";

import {
  getPullRequests,
  createPullRequest,
  updatePullRequest,
  deletePullRequest,
  approvePullRequest,
  rejectPullRequest,
} from "../controllers/pullRequest.js";

const router = express.Router();
import auth from "../middleware/auth.js";

router.get("/", getPullRequests);
// router.get("/:id", getPullRequest);
router.post("/", auth, createPullRequest);
router.put("/:id", auth, updatePullRequest);
router.delete("/:id", auth, deletePullRequest);

router.patch("/:id/approvePullRequest", auth, approvePullRequest);
router.patch("/:id/rejectPullRequest", auth, rejectPullRequest);
router.post("/:id/comments", auth, );
router.get("/:id/comments", auth, );


export default router;
