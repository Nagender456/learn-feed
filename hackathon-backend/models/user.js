import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
	avatar: {
		type: String,
		maxLength: 1000000
	},
	username: {
		type: String,
		lowercase: true,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	refreshToken: String,
	followedBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	followed: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	followers: {
		type: Number,
		default: 0
	},
	liked: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FeedPost'
	}],
	joined: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('User', UserSchema);

export default User;