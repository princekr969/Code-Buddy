import mongoose from 'mongoose';
import User from '../models/User.model.js';


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching user",
      error: err.message
    });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};


export const getRecentRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
  .select('recentRooms')
  .populate({
    path: 'recentRooms.room',
    select: 'title owner createdAt _id',
    populate: {
      path: 'owner',
      select: 'name avatar',   
    },
  });
 
    if (!user) return res.status(404).json({ message: 'User not found' });
 
    const validRooms = user.recentRooms.filter((entry) => entry.room != null);
    res.json({success:true, recentRooms: validRooms });
  } catch (error) {
    console.error('Error fetching recent rooms:', error);
    res.status(500).json({ success:false, message: 'Failed to fetch recent rooms' });
  }
}