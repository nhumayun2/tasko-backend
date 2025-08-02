import express from "express";
import {
  getAllUsersController,
  sendFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController, // Import the new controller
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
router
  .route("/reject/:requestId")
  .delete(protect, rejectFriendRequestController); // New route to reject a request
router.route("/list").get(protect, getFriendsListController);
router.route("/requests").get(protect, getFriendRequestsController);

export default router;
