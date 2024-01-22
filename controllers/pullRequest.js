import express from "express";
import mongoose from "mongoose";

import PullRequest from "../models/pullRequest.js";
import Reviews from "../models/reviews.js";
import Approvals from "../models/approvals.js";

const router = express.Router();

export const getPullRequests = async (req, res) => {
  try {
    const pullRequests = await Approvals.find({
      approverId: req.userId,
    }).populate("pullRequestId");
    res.status(200).json(pullRequests);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPullRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const pullRequest = await PullRequest.findById(id);

    res.status(200).json(pullRequest);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Reviews.find({
      pullRequestId: id,
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPullRequest = async (req, res) => {
  const pullRequest = req.body;

  const newPullRequest = new PullRequest({
    ...pullRequest,
    requesterId: req.userId,
    createdAt: new Date().toISOString(),
  });
  // const newApproval = new Approval({pullRequestId: newPullRequest.id, approverId: })

  const approvals = [];

  pullRequest.approvers.forEach((el) =>
    approvals.push(
      Approvals.create({
        approverId: el, 
        pullRequestId: newPullRequest.id,
        status: "Pending",
        createdAt: new Date().toISOString(),
      })
    )
  );

  await Promise.all(approvals);

  try {
    await newPullRequest.save();

    res.status(201).json(newPullRequest);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  const review = req.body;
  const { id } = req.params;
  const newReviews = new Reviews({
    ...review,
    pullRequestId: id,
    reviewerId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newReviews.save();

    res.status(201).json(newReviews);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePullRequest = async (req, res) => {
  const { id } = req.params;
  const { title, description, approvers, updatedAt } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No pullRequest with id: ${id}`);

  const updatedPullRequest = {
    title,
    description,
    approvers,
    updatedAt: new Date().toISOString(),
    _id: id,
  };

  await PullRequest.findByIdAndUpdate(id, updatedPullRequest, { new: true });

  res.json(updatedPullRequest);
};

export const deletePullRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No pullRequest with id: ${id}`);

  await PullRequest.findByIdAndRemove(id);

  res.json({ message: "PullRequest deleted successfully." });
};

export const approvePullRequest = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No pullRequest with id: ${id}`);

  const pullRequest = await PullRequest.findById(id);

  const index = pullRequest.approvers.findIndex(
    (id) => id === String(req.userId)
  );

  if (index === -1) {
    pullRequest.approvers.push(req.userId);
  } else {
    pullRequest.approvers = pullRequest.approvers.filter(
      (id) => id !== String(req.userId)
    );
  }
  const updatedPullRequest = await PullRequest.findByIdAndUpdate(
    id,
    pullRequest,
    { new: true }
  );
  res.status(200).json(updatedPullRequest);
};

export const getApprovals = async (req, res) => {
  const { id } = req.params;

  try {
    const approvals = await Approvals.find({
      approverId: req.userId,
    });

    res.status(200).json(approvals);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const rejectPullRequest = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No pullRequest with id: ${id}`);

  const pullRequest = await PullRequest.findById(id);

  const index = pullRequest.approvers.findIndex(
    (id) => id === String(req.userId)
  );

  if (index !== -1) {
    pullRequest.approvers = pullRequest.approvers.filter(
      (id) => id !== String(req.userId)
    );
  }
  pullRequest.status = "Rejected";
  const updatedPullRequest = await PullRequest.findByIdAndUpdate(
    id,
    pullRequest,
    { new: true }
  );
  res.status(200).json(updatedPullRequest);
};

export default router;
