import FeedPost from '../models/feedPost.js';
import User from '../models/user.js';

export const getFeeds = async (req, res) => {
	const postsPerPage = 5;
	const curPage = req.query.pageNum;
	const query = {
		'$and': []
	}
	if (req.query.creator) {
		query['$and'].push({creatorName: req.query.creator})
	}
	if (req.query.query) {
		query['$and'].push(
			{
				'$or': [
					{title: {$regex:req.query.query, $options:'i'}},
					{creatorName: {$regex:req.query.query, $options:'i'}}
				]
			}
		)
	}
	try {
		const posts = await FeedPost.find(query).sort({likes: -1}).skip((curPage-1) * postsPerPage).limit(postsPerPage);	
		for (let i=0; i<posts.length; i++) {
			const isLiked = req.userInfo ? posts[i].likedBy?.indexOf(req.userInfo.id) === -1 ? false: true : false;
			posts[i] = posts[i].toObject();
			posts[i].isLiked = isLiked;
			posts[i].likedBy = undefined;
		}
		res.status(200).json(posts);
	} catch(error) {
		res.status(500).json({ message: error.message });
	}
}

export const createFeed = async (req, res) => {
	if (!req.userInfo) {
		return res.sendStatus(403); //invalid token
	}
	const body = req.body;
	if (body.title.length > 500) {
		return res.status(400).json({message: 'Title is too long'})
	}
	body.creatorId = req.userInfo.id;
	body.creatorName = req.userInfo.username;
	const newFeedPost = new FeedPost(body);
	try {
		newFeedPost.save();
		res.sendStatus(201);
	} catch(error) {
		res.status(500).json({ message: error.message })
	}
}