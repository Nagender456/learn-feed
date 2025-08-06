import mongoose, { mongo } from 'mongoose';

const feedPostSchema = mongoose.Schema({
	title: String,
	image: {
		type: String,
		required: true
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	creatorName: {
		type: String,
		required: true
	},
	// tags: [String],
	likes: {
		type: Number,
		default: 0
	},
	likedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	date: {
		type: Date,
		default: Date.now
	}
});

const FeedPost = mongoose.model('FeedPost', feedPostSchema);

export default FeedPost;