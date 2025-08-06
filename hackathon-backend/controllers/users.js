import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const USER_REGEX = /^[A-z][A-z0-9_]{3,13}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const invalidUsernames = ['register', 'refresh', 'login', 'logout'];

export const userProfile = async (req, res) => {
	const username = req.params?.username;
	if (!username) {
		return res.status(400).json({message: 'Username not right'});
	}
	let foundUser = await User.findOne({username: username}, {_id: 1, username: 1, avatar: 1, followedBy: 1, followers: 1, followed: 1}).exec();
	if (!foundUser) {
		return res.status(404).json({message:'User Not Found!'});
	}
	const isFollowed = req.userInfo ? foundUser.followedBy?.indexOf(req.userInfo.id) === -1 ? false: true : false;
	foundUser = foundUser.toObject();
	foundUser.isFollowed = isFollowed
	foundUser.following = foundUser.followed.length;
	foundUser.followedBy = undefined;
	foundUser.followed = undefined;
	res.status(200).json(foundUser);
}

export const userFollow = async (req, res) => {
	if (!req.userInfo) {
		return res.sendStatus(403);
	} 
	if (req.userInfo.id === req.body.id) {
		return res.status(400).json({message: `You can't follow yourself!`})
	}
	const foundUser = await User.findOne({_id: req.body.id}).exec();
	if (!foundUser) {
		return res.status(404).json({message:`User doesn't exist!`});
	}
	const curUser = await User.findOne({_id: req.userInfo.id}).exec();
	if (!curUser) {
		return res.status(404).json({message:`You don't exist`});
	}
	let index, isFollowed;
	index = foundUser.followedBy.indexOf(req.userInfo.id);
	if (index > -1) {
		isFollowed = false;
		foundUser.followedBy.splice(index, 1);
		foundUser.followers--;
		index = curUser.followed.indexOf(req.body.id);
		if (index > -1) {
			curUser.followed.splice(index, 1);
		}
	} else {
		isFollowed = true;
		foundUser.followedBy.push(req.userInfo.id);
		foundUser.followers++;
		index = curUser.followed.indexOf(req.body.id);
		if (index <= -1) {
			curUser.followed.push(req.userInfo.id);
		}
	}
	await foundUser.save();
	await curUser.save();
	res.status(201).json({
		followers: foundUser.followers,
		isFollowed
	});
}

export const userLogin = async (req, res) => {
	const { username, password } = req.body;
	try {
		let foundUser = await User.findOne({username: username}, {_id:1, username:1, password:1, avatar: 1}).exec();
		if (!foundUser) {
			foundUser = await User.findOne({email: username}, {_id:1, username:1, password:1, avatar: 1}).exec();
		}
		if (!foundUser) {
			return res.status(401).json({ message: `Username/Email doesn't exist!` });
		}
		const passwordMatch = await bcrypt.compare(password, foundUser.password);
		if (passwordMatch) {
			const accessToken = jwt.sign(
				{ 	
					'id': foundUser._id.toString(),
					'username': foundUser.username 
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '10m' }
			);
			const refreshToken = jwt.sign(
				{ 'id': foundUser._id },
				process.env.REFRESH_TOKEN_SECRET,
				{ expiresIn: '10h' }
				);
				foundUser.refreshToken = refreshToken;
				await foundUser.save(); //24 * 60 * 60 * 1000
				res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000, secure: true, sameSite: 'None' });
				res.json({username: foundUser.username, accessToken, avatar: foundUser.avatar});
		}
		else {
			res.status(400).json({ message: 'Password is wrong!' })
		}

	} catch(error) {
		res.status(404).json({ message: error.message });
	}
}

export const userRegister = async (req, res) => {
	const { username, password, email } = req.body;

	if (!USER_REGEX.test(username) || invalidUsernames.indexOf(username) != -1) {
		return res.status(400).json({ message: 'Username not valid!' });
	}
	if (!PWD_REGEX.test(password)) {
		return res.status(400).json({ message: 'Password not valid!' });
	}
	if (!EMAIL_REGEX.test(email)) {
		return res.status(400).json({ message: 'Email not valid!' });
	}
	const usernameTaken = await User.findOne({ username }, { username }).exec();
	if (usernameTaken) {
		return res.status(409).json({ message: 'Username already exist!' });
	}
	const emailTaken = await User.findOne({ email }, { email }).exec();
	if (emailTaken) {
		return res.status(409).json({ message: 'Email already in use' });
	}
	try {
		const hashedPwd = await bcrypt.hash(password, 10);

		const newUser = new User({ username: username, password: hashedPwd, email: email });
		newUser.save();

		res.sendStatus(200);
	} catch(error) {
		res.status(404).json({ message: error.message });
	}
}

export const userLogout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		return res.sendStatus(204);
	}
	const refreshToken = cookies.jwt;
	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
		return res.sendStatus(204);
	}
	foundUser.refreshToken = '';
	await foundUser.save();
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.sendStatus(204);
}

export const userRefreshToken = async (req, res) => {
	const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }, {_id:1, username:1, avatar:1}).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
			const userId = foundUser._id.toString();
			if (err || userId !== decoded.id) return res.sendStatus(403);
			const accessToken = jwt.sign(
				{ 
					'id': userId,
					'username': foundUser.username
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '10m' }
			);
            res.json({ username:foundUser.username, avatar:foundUser.avatar, accessToken });
        }
    );
}

export const userUpdate = async (req, res) => {
	if (!req.userInfo) {
		return res.sendStatus(403); //invalid token
	}
	const foundUser = await User.findOne({_id: req.userInfo.id}, {username: 1}).exec();
	if (!foundUser) {
		return res.status(401).json({ message: `User doesn't exist!` });
	}
	const newAvatar = req.body?.avatar;
	const newUsername = req.body?.username;
	const updated = {}
	if (newAvatar) {
		foundUser.avatar = newAvatar;
		updated.avatar = newAvatar;
	}
	if (newUsername) {
		if (newUsername === foundUser.username) {
			return res.status(400).json({message: `New Username can't be same!`})
		}
		if (!USER_REGEX.test(newUsername)) {
			return res.status(400).json({message: `Username not valid!`})
		}
		foundUser.username = newUsername;
		const newAccessToken = jwt.sign(
			{ 	
				'id': foundUser._id.toString(),
				'username': newUsername 
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '10m' }
		);
		updated.username = newUsername;
		updated.accessToken = newAccessToken;
	}
	try {
		foundUser.save();
		res.status(201).json({message: 'Profile Updated!', ...updated});
	} catch (err) {
		res.status(500).json({message: err.message});
	}
}