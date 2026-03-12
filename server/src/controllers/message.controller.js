import mongoose from 'mongoose';
import { Room, File, Message } from '../models/Room.model.js';
import User from '../models/User.model.js'; 

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const addMessageToRoom = async (req, res) => {
  try {
    const { roomId, userId, messageText } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid room ID or user ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create message
    const newMessage = new Message({
      user: userId,
      message: messageText,
      room: roomId,
    });
    await newMessage.save();

    // Add reference to room
    room.messages.push(newMessage._id);
    await room.save();

    // Populate user info for response
    await newMessage.populate('user', 'name email username');

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      messageObj: newMessage,
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Error adding message', error: error.message });
  }
};

// Get all messages of a room (with pagination optional)
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const messages = await Message.find({ room: roomId })
      .sort({ time: -1 }) // latest first
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('user', 'name email username');

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Delete a message (optional)
export const deleteMessage = async (req, res) => {
  try {
    const { roomId, messageId } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(messageId)) {
      return res.status(400).json({ message: 'Invalid room ID or message ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const messageIndex = room.messages.findIndex((id) => id.equals(messageId));
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found in room' });
    }

    room.messages.splice(messageIndex, 1);
    await room.save();

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};