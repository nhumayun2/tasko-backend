import User from "../models/user.model.js";

// @desc  Get all users (excluding the current user and friends) for "Add New Friends" list
// @route GET /api/friends/users
// @access Private
const getAllUsersController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId).select(
      "friends friendRequests"
    );

    // Get all user IDs to exclude from the list (current user + friends + sent/received requests)
    const excludedUserIds = [
      userId,
      ...currentUser.friends,
      ...currentUser.friendRequests.map((req) => req.sender),
    ];

    const users = await User.find({
      _id: { $nin: excludedUserIds }, // Exclude the current user, their friends, and those they've received requests from
    }).select("-password"); // Exclude passwords from the results

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc  Send a friend request
// @route POST /api/friends/request/:recipientId
// @access Private
const sendFriendRequestController = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { recipientId } = req.params;

    // Check if the request is being sent to the same person
    if (senderId.toString() === recipientId.toString()) {
      res.status(400);
      throw new Error("You cannot send a friend request to yourself");
    }

    const recipient = await User.findById(recipientId);
    const sender = await User.findById(senderId);

    if (!recipient || !sender) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if a request already exists or if they are already friends
    if (
      recipient.friendRequests.some(
        (req) => req.sender.toString() === senderId.toString()
      ) ||
      recipient.friends.includes(senderId) ||
      sender.friendRequests.some(
        (req) => req.sender.toString() === recipientId.toString()
      )
    ) {
      res.status(400);
      throw new Error(
        "Friend request already sent or users are already friends"
      );
    }

    // Add the pending request to the recipient's friendRequests array
    recipient.friendRequests.push({ sender: senderId });
    await recipient.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    next(error);
  }
};

// @desc  Accept a friend request
// @route PUT /api/friends/accept/:requestId
// @access Private
const acceptFriendRequestController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Find the request and get the sender's ID
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req._id.toString() === requestId
    );
    if (requestIndex === -1) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    const senderId = currentUser.friendRequests[requestIndex].sender;

    // Add the sender to the current user's friends list
    currentUser.friends.push(senderId);

    // Remove the request from the friendRequests list
    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    // Add the current user to the sender's friends list
    const senderUser = await User.findById(senderId);
    senderUser.friends.push(userId);
    await senderUser.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    next(error);
  }
};

// @desc  Reject a friend request
// @route DELETE /api/friends/reject/:requestId
// @access Private
const rejectFriendRequestController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Find the request and remove it
    const requestIndex = currentUser.friendRequests.findIndex(
      (req) => req._id.toString() === requestId
    );
    if (requestIndex === -1) {
      res.status(404);
      throw new Error("Friend request not found");
    }

    currentUser.friendRequests.splice(requestIndex, 1);
    await currentUser.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    next(error);
  }
};

// @desc  Get friends list for the current user
// @route GET /api/friends/list
// @access Private
const getFriendsListController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userWithFriends = await User.findById(userId).populate(
      "friends",
      "username email"
    ); // Populate with friend details

    res.json(userWithFriends.friends);
  } catch (error) {
    next(error);
  }
};

// @desc  Get incoming friend requests for the current user
// @route GET /api/friends/requests
// @access Private
const getFriendRequestsController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userWithRequests = await User.findById(userId).populate(
      "friendRequests.sender",
      "username email"
    );

    res.json(userWithRequests.friendRequests);
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsersController,
  sendFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController, // Export the new controller
  getFriendsListController,
  getFriendRequestsController,
};
