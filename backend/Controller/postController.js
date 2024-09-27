import mongoose from 'mongoose';
import Post from '../Model/post.model.js';
import User from '../Model/user.model.js';
import {v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
    // API call to create post
    try {
        const { postedBy, text } = req.body;
        let { image } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ success: false, msg: 'postedBy and text fields are required' });
        }

        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, msg: 'Not authorized to create post' });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ success: false, msg: `Text is too long. Max length is ${maxLength} characters.` });
        }

        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            postedBy,
            text,
            image,
        });

        await newPost.save();
        res.json({ success: true, msg: 'Post created successfully', post: newPost });

    } catch (error) {
        console.log('error creating post: ', error.message);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}

export const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


export const deletePost = async (req, res) => {
    // API call to delete post
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ success: false, msg: 'Post not found' });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, msg: 'Not authorized to delete post' });
        }

        if(post.image){
            const imgId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).json({ success: true, msg: 'Post deleted successfully' });
    } catch (error) {
        console.log('error deleting post: ', error.message);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}

export const likeUnlikePost = async (req, res) => {

    // API call to like or unlike post
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const { id: postId } = req.params;
        if (ObjectId.isValid(postId)) {
            const userId = req.user._id;

            const post = await Post.findById(postId);

            if (post) {
                const isLike = post.likes.includes(userId);

                if (isLike) {
                    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
                    return res.status(200).json({ success: true, msg: 'Post unliked successfully' });
                } else {
                    post.likes.push(userId);
                    await post.save();
                    return res.status(200).json({ success: true, msg: 'Post liked successfully' });
                }
            }
            else {

                return res.status(404).json({ success: false, msg: 'Post ID not found' });
            }

        } else {
            return res.status(404).json({ success: false, msg: 'Post ID not Correct' });
        }

    } catch (error) {
        console.log('error liking or unliking post: ', error.message);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}

export const replyToPost = async (req, res) => {
    // API call to reply to post
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const { id: postId } = req.params;
        if (ObjectId.isValid(postId)) {
        const userId = req.user._id;
        const { text } = req.body;
        
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ success: false, msg: 'Reply text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, msg: 'Post ID not found' });
        }


        const reply = { text, userId, userProfilePic, username };

        post.replies.push(reply);
        await post.save();
        

        return res.status(200).json({ success: true, msg: 'Reply added successfully', reply });
    }else{
        return res.status(404).json({ success: false, msg: 'Post ID not Correct' });
    }

    } catch (error) {
        console.log('error in replying to post: ', error.message);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}

export const getFeedPosts = async (req, res) => {
    // API call to get feed posts
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const following = user.following;

        const feeds = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, posts: feeds });
        
    } catch (error) {
        console.log('error in getting feed posts: ', error.message);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}

export const getUserPosts = async (req, res) => {
    // API call to get user posts
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        
        return res.status(200).json({ success: true, posts });
            
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
}