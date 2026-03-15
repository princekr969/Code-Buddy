import mongoose from 'mongoose';
import { Room, File, Message } from '../models/Room.model.js';
import User from '../models/User.model.js'; 


const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createRoom = async (req, res) => {
  try {
    const { title } = req.body;
    const owner = req.user.id;
    console.log('Creating room with title:', title, 'and owner:', owner);

    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner user not found' });
    }

    const defaultFileName = 'index.cpp';
    const defaultContent = '#include <iostream>\nint main() { std::cout << "Hello, World!"; return 0; }';
    
    const room = new Room({
      owner,
      title,
      files: [],
      users: [owner], 
    });

    await room.save();
    
    const newFile = new File({
      name: defaultFileName,
      content: defaultContent,
      room: room._id,
      owner: owner
    });
    await newFile.save();

    room.files.push(newFile._id);
    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('owner', 'name email username')
      .populate('users', 'name email username')
      .populate('files');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room: populatedRoom,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

export const getRoomsById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rooms = await Room.find({ owner: user._id })
      .populate('owner', 'name email username avatar')
      .populate('users', 'name email username avatar');

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const room = await Room.findById(roomId)
      .populate('owner', 'name email username _id')
      .populate('users', 'name email username _id')
      .populate('files')
      .populate({
        path: 'messages',
        populate: { path: 'user', select: 'name email username _id' },
      });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

export const updateRoomTitle = async (req, res) => {
  try {
    const { roomId, title } = req.body;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.title = title;
    await room.save();

    res.status(200).json({ success: true, message: 'Room title updated', room });
  } catch (error) {
    console.error('Error updating room title:', error);
    res.status(500).json({ message: 'Error updating room title', error: error.message });
  }
};

export const addUserToRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid room ID or user ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    res.status(200).json({ success: true, message: 'User added to room', room });
  } catch (error) {
    console.error('Error adding user to room:', error);
    res.status(500).json({ message: 'Error adding user to room', error: error.message });
  }
};

export const removeUserFromRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid room ID or user ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.users = room.users.filter((id) => !id.equals(userId));
    await room.save();

    res.status(200).json({ success: true, message: 'User removed from room', room });
  } catch (error) {
    console.error('Error removing user from room:', error);
    res.status(500).json({ message: 'Error removing user from room', error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await File.deleteMany({ room: roomId });
    await Message.deleteMany({ room: roomId });
    await room.deleteOne();

    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};
