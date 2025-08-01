import express from "express";
import {
  getAllUsersController,
  sendFriendRequestController,
  acceptFriendRequestController,
  getFriendsListController,
  getFriendRequestsController,
} from "../controllers/friends.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/users").get(protect, getAllUsersController);
router
  .route("/request/:recipientId")
  .post(protect, sendFriendRequestController);
router.route("/accept/:requestId").put(protect, acceptFriendRequestController);
router.route("/list").get(protect, getFriendsListController);
router.route("/requests").get(protect, getFriendRequestsController);

export default router;
