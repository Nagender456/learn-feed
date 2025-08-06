import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from 'react-toastify';

const UserProfile = () => {
	const { username } = useParams();
	const [userProfile, setUserProfile] = useState({});
	const [isLoading, setIsloading] = useState(true);
	const [isError, setIsError] = useState(false);
	const {auth} = useAuth();
	const axios = useAxiosPrivate();
	useEffect(() => {
		setIsloading(true);
		setIsError(false);
		const controller = new AbortController();
		const fetchProfile = async () => {
			try {
				const response = await axios.get(`/user/profile/${username}`, {
					signal: controller.signal
				});
				setUserProfile(response.data);
				setIsloading(false);
			} catch (err) {
				if (err.name === 'CanceledError') {
					return;
				}
				const errMessage = err.response?.data?.message || 'Something went Wrong!';
				toast.error(errMessage);
				// message ? setErrMsg(message) : setErrMsg('Something went Wrong!');
				setIsError(true);
				setIsloading(false);
			}
		}
		fetchProfile();
		return () => controller.abort();
	}, [username])
	return (
		<div className='page-container'>
			{isLoading 
				? <h1 className='page-heading'>Loading...</h1>
				: isError 
					? <h1 className='page-heading'>User not found!</h1> 
					: <Profile profile={userProfile} setProfile={setUserProfile} curUser={auth.username} axios={axios}/>
			}
		</div>
	);
}

const Profile = ({ profile, setProfile, curUser, axios }) => {
	const navigate = useNavigate();
	const handleFollow = async () => {
		try {
			const response = await axios.put('/user/follow', {
				id: profile._id
			})
			if (response.data) {
				setProfile({
					...profile,
					...response.data
				})
			}
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong!';
			toast.error(errMessage);
		}
	}
	return (
		<>
			<h1 className='page-heading'>{profile.username.toUpperCase()}</h1>
			<div className='profile-container'>
				<div 
					className='profile-avatar clickable' 
					onClick={() => {
						const image = new Image();
						image.src = profile.avatar;
						const newWindow = window.open('');
						newWindow.document.write(image.outerHTML);
					}}
				>
					<img 
						src={profile.avatar ? profile.avatar : '/default-avatar.jpg'} 
						alt='User Avatar'
					/>
				</div>
				<div className='profile-stats-container'>
					<div className='profile-stats'>
						<h2>{profile.followers || 0}</h2>
						<span>Followers</span>
					</div>
					<hr />
					<div className='profile-stats'>
						<h2>{profile.following || 0}</h2>
						<span>Following</span>
					</div>
				</div>
				{curUser === profile.username
					? <button className='button edit-profile-button' onClick={() => navigate('/edit')}>Edit Profile</button>
					: <button className={`button ${profile.isFollowed?'unfollow-button':'follow-button'}`} onClick={handleFollow}>{profile.isFollowed?'Unfollow':'Follow'}</button>
				}
				<button className='button posts-button' onClick={() => navigate(`/feeds/${profile.username}`)}>View Posts</button>
			</div>
		</>
	)
}

export default UserProfile;