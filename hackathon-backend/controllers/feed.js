import FeedPost from '../models/feedPost.js';

export const toggleLike = async (req, res) => {
	if (!req.userInfo) {
		return res.sendStatus(403); //invalid token
	}
	const foundFeed = await FeedPost.findOne({_id: req.body?.id}, {likes:1, likedBy:1});
	if (!foundFeed) {
		return res.sendStatus(404);
	}
	const index = foundFeed.likedBy.indexOf(req.userInfo.id);
	let isLiked;
	if (index > -1) {
		isLiked = false;
		foundFeed.likedBy.splice(index, 1);
	} else {
		isLiked = true;
		foundFeed.likedBy.push(req.userInfo.id);
	}
	foundFeed.likes = foundFeed.likedBy.length;
	await foundFeed.save();
	res.status(201).json({
		likes: foundFeed.likes,
		isLiked
	});
}

export const getFeed = async (req, res) => {
	const id = req.params?.id;
	if (!id) {
		res.status(400).json({message: 'Feed URL is wrong!'})
	}
	try {
		let foundFeed = await FeedPost.findOne({_id: id}).exec();
		if (!foundFeed) {
			return res.status(400).json({message: `Feed doesn't Exist!`})
		}
		const isLiked = req.userInfo ? foundFeed.likedBy?.indexOf(req.userInfo.id) === -1 ? false: true : false;
		foundFeed = foundFeed.toObject();
		foundFeed.isLiked = isLiked;
		foundFeed.likedBy = undefined;
		res.status(200).json(foundFeed);
	} catch(err) {
		res.status(400).json({message: `Feed couldn't be found!`})
	}
}