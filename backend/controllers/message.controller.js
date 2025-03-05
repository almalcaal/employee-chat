import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// @desc            Get / display users in current user's sidebar
// @route           GET /api/messages/users
// @access          Private
export const getUsersForSidebar = async (req, res) => {
  try {
    // just a reminder, we have access to req.user._id through our protectRoute
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in getUsersForSidebar controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc            Get messages between current user and other user
// @route           /api/messages/:id
// @access          Private
export const getMessages = async (req, res) => {
  try {
    const { id: userCurrentUserChattingWithId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userCurrentUserChattingWithId },
        { senderId: userCurrentUserChattingWithId, receiverId: currentUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessages controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc
// @route
// @access
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
