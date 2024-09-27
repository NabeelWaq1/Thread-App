import User from '../Model/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../Utils/helper/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Post from '../Model/post.model.js';

export const getUser = async (req, res) => {
    // API call to get user by username 
    const { query } = req.params;
    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findById(query).select('-password').select('-updatedAt');
        } else {


            user = await User.findOne({ username: query }).select('-password').select('-updatedAt')
        }

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json({ success: true, message: 'User Founded Successfully', user });
    } catch (error) {
        console.log('error in getUser', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    // API call to get suggested users
    try {
        const userId = req.user._id;

        const usersFollowedByYou = await User.findById(userId).select('following');

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
            $sample: {
                size: 10
            },
        },
        ])

        const filteredUsers = users.filter((user)=> !usersFollowedByYou.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);  
        
        suggestedUsers.forEach((user) => (user.password = null));

        return res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const signupUser = async (req, res) => {
    // API call to signup user
    try {
        const { name, email, password, username } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, username });
        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            return res.status(201).json({ success: true, message: 'User registered successfully', _id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email, profilePic: newUser.profilePic, bio: newUser.bio });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to register user' });
        }
    } catch (error) {
        console.log('error in signupUser', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const loginUser = async (req, res) => {
    // API call to login user
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect password' });
            }
            if(user.freezed){
                user.freezed = false;
                await user.save();
            }
            generateTokenAndSetCookie(user._id, res);
            return res.status(200).json({ success: true, message: 'User logged in successfully', _id: user._id, name: user.name, username: user.username, email: user.email, profilePic: user.profilePic, bio: user.bio });
        }


    } catch (error) {
        console.log('error in loginUser', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const logoutUser = (req, res) => {
    // API call to logout user
    try {
        res.cookie('jwt', '', { maxAge: 1 });
        return res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.log('error in logoutUser', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const followUnfollowUser = async (req, res) => {
    // API call to follow/unfollow user
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (id === userId.toString()) return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

        if (!userToModify || !currentUser) return res.status(404).json({ success: false, message: 'User not found' });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { following: id } });
            return res.status(200).json({ success: true, message: 'User unfollowed successfully' });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $push: { following: id } });
            return res.status(200).json({ success: true, message: 'User followed successfully' });
        }

    } catch (error) {
        console.log('error in followUnfollowUser', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateUser = async (req, res) => {
    const { name, username, email, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (req.params.id !== userId.toString()) return res.status(401).json({ success: false, message: 'You cannot update other user profile' });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic).catch((error) => {
                console.log(error);
            });
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profilePic = profilePic || user.profilePic;
        
        user = await user.save();

        await Post.updateMany(
            { 'replies.userId': userId },
            {
                $set: {
                    'replies.$[reply].username': user.username,
                    'replies.$[reply].userProfilePic': user.profilePic,
                },
            },
            { arrayFilters: [{ 'reply.userId': userId }] }
        );

        

        user.password = null;

        return res.status(200).json({ success: true, message: 'User updated successfully', user });

    } catch (error) {
        console.log('error in updateUser', error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const frrezeUser = async (req,res) => {
    // API call to freeze user
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');

        if(!user) return  res.status(404).json({ success: false, message: 'User not found' });

        user.freezed = true;
        await user.save();

        return res.status(200).json({ success: true, message: 'User has been frozen successfully', user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false,message:error.message})
    }
}