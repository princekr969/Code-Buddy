import mongoose from 'mongoose';
import { Room, Message } from '../models/Room.model.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const messages = await Message.find({ room: roomId })
      .sort({ time: -1 }) 
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('user', 'name email');
      console.log(`Fetched ${messages.length} messages for room ${roomId}`);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

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