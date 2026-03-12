import mongoose from 'mongoose';
import { Room, File, Message } from '../models/Room.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const addFileToRoom = async (req, res) => {
  try {
    const { roomId, name, content } = req.body;

    if (!isValidObjectId(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if a file with the same name already exists in this room
    const existingFile = await File.findOne({ name, room: roomId });
    if (existingFile) {
      return res.status(400).json({ message: 'A file with that name already exists in the room' });
    }

    // Create the file
    const newFile = new File({
      name,
      content: content || '',
      room: roomId,
    });
    await newFile.save();

    // Add reference to room
    room.files.push(newFile._id);
    await room.save();

    res.status(201).json({
      success: true,
      message: 'File added successfully',
      file: newFile,
    });
  } catch (error) {
    console.error('Error adding file:', error);
    res.status(500).json({ message: 'Error adding file', error: error.message });
  }
};

export const updateFileName = async (req, res) => {
  try {
    const { roomId, fileId, newName } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(fileId)) {
      return res.status(400).json({ message: 'Invalid room ID or file ID' });
    }

    const file = await File.findOne({ _id: fileId, room: roomId });
    if (!file) {
      return res.status(404).json({ message: 'File not found in this room' });
    }

    const duplicate = await File.findOne({ name: newName, room: roomId, _id: { $ne: fileId } });
    if (duplicate) {
      return res.status(400).json({ message: 'Another file with that name already exists' });
    }

    file.name = newName;
    await file.save();

    res.status(200).json({
      success: true,
      message: 'File name updated successfully',
      file,
    });
  } catch (error) {
    console.error('Error updating file name:', error);
    res.status(500).json({ message: 'Error updating file name', error: error.message });
  }
};

export const updateFileCode = async (req, res) => {
  try {
    const { roomId, fileId, code } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(fileId)) {
      return res.status(400).json({ message: 'Invalid room ID or file ID' });
    }

    const file = await File.findOne({ _id: fileId, room: roomId });
    if (!file) {
      return res.status(404).json({ message: 'File not found in this room' });
    }

    file.content = code;
    await file.save();

    res.status(200).json({
      success: true,
      message: 'File code updated successfully',
      file,
    });
  } catch (error) {
    console.error('Error updating file code:', error);
    res.status(500).json({ message: 'Error updating file code', error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { roomId, fileId } = req.body;

    if (!isValidObjectId(roomId) || !isValidObjectId(fileId)) {
      return res.status(400).json({ message: 'Invalid room ID or file ID' });
    }

    // Remove from room's files array
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const fileIndex = room.files.findIndex((id) => id.equals(fileId));
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found in room' });
    }

    room.files.splice(fileIndex, 1);
    await room.save();

    // Delete the file document itself
    await File.findByIdAndDelete(fileId);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};
