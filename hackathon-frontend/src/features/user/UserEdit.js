import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AvatarEditor from 'react-avatar-editor';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const USER_REGEX = /^[A-z][A-z0-9_]{3,13}$/;

const UserEdit = () => {
	const [resetAvatar, setResetAvatar] = useState(false);
	const [resetUsername, setResetUsername] = useState(false);
	const [avatarFile, setAvatarFile] = useState('');
	const avatarInputRef = useRef();
	const navigate = useNavigate();
	const {auth, setAuth} = useAuth();
	const axios = useAxiosPrivate();
	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file.type.substring(0, 5) !== 'image') {
			toast.error('Wrong file-type!');
			return
		}
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			setResetAvatar(true);
			setAvatarFile(reader.result);
		})
		reader.readAsDataURL(file);
	}
	return (
		<section className='page-container'>
			<h1 className='page-heading'>Edit Profile</h1>
				<div className='edit-profile-container'>
					{
					resetAvatar 
						? <AvatarEdit 
							avatar={avatarFile} 
							onDone={() => {
								setResetAvatar(false);
								setAvatarFile('');
							}}
							axios={axios}
							setAuth={setAuth}
						/>
					: resetUsername 
						? <UsernameEdit 
							username={auth.username}
							onDone={() => setResetUsername(false)} 
							axios={axios}
							setAuth={setAuth}
						/> 
					: <>
							<span className='buttons-container'>
								<button 
									className='button' 
									onClick={() => setResetUsername(true)}
								>Reset Username</button>
								<button 
									className='button' 
									onClick={() => avatarInputRef.current.click()}
								>Reset Avatar</button>
								<button className='button' onClick={() => navigate(`/profile/${auth.username}`, {replace: true})}>Done</button>
							</span>
							<input 
								className='image-input'
								type='file' 
								accept='.png,.jpg,.jpeg'
								ref={avatarInputRef} 
								onChange={handleFileInput}
							/>
						</>
					}
				</div>
			</section>
	);
}


const AvatarEdit = ({avatar, onDone, axios}) => {
	const [imageScale, setImageScale] = useState(10);
	const [imageRotation, setImageRotation] = useState(0);
	const avatarRef = useRef();
	const {setAuth} = useAuth();
	const handleAvatarChange = async (e) => {
		e.preventDefault();
		try {
			const avatarImage = avatarRef.current.getImageScaledToCanvas().toDataURL();
			const response = await axios.put(`user/update`, {avatar:avatarImage});
			setAuth(prev => {
				return {
					...prev,
					avatar: response.data.avatar
				}
			});
			toast.success('Avatar Updated!');
			onDone();
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong!';
			toast.error(errMessage);
		}
	}
	return (
		<form className='avatar-editor-container' onSubmit={handleAvatarChange}>
			<AvatarEditor 
				height={256}
				width={256}
				className='avatar-editor'
				ref={avatarRef}
				image={avatar}
				border={0}
				borderRadius={128}
				scale={imageScale/10}
				rotate={imageRotation}
				color={[0, 0, 0, .5]}
				backgroundColor={'black'}
			/>
			<div className='slider-container'>
				<div className='input-label'>Zoom</div>
				<input
					type='range'
					min={5}
					max={40}
					onChange={(e) => setImageScale(e.target.value)}
					// style={getBackgroundSize()}
					value={imageScale}
				/>
			</div>
			<div className='slider-container'>
				<div className='input-label'>Rotate</div>
				<input
					type='range'
					min={0}
					max={360}
					onChange={(e) => setImageRotation(e.target.value)}
					// style={getBackgroundSize()}
					value={imageRotation}
				/>
			</div>
			<button className='button done-button' type='submit'>Set Avatar</button>
			<button className='button cancel-button' onClick={onDone}>Cancel</button>
		</form>
	)
}

const UsernameEdit = ({username, onDone, axios, setAuth}) => {
	const [newUsername, setNewUsername] = useState(username);
	const [validNewUsername, setValidNewUsername] = useState(false);
	const usernameInput = useRef();
	useEffect(() => {
		usernameInput.current.focus();
	}, [])
	useEffect(() => {
		setValidNewUsername(
			newUsername !== username && USER_REGEX.test(newUsername)
			)
	}, [newUsername])
	const handleUsernameChange = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(`user/update`, {username:newUsername});
			setAuth(prev => {
				return {...prev, 
					username:response.data?.username,
					accessToken: response.data?.accessToken}
			})
			toast.success('Username Updated!');
			onDone();
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong!';
			toast.error(errMessage);
		}
	}
	return (
		<div className='username-editor-container'>
			<form className='username-editor' onSubmit={handleUsernameChange}>
				<div className='username-input-container'>
					<h2 className='sub-heading'>Username</h2>
					<input 
						type='text'
						value={newUsername}
						ref={usernameInput}
						onChange={(e) => setNewUsername(e.target.value)}
					/>
				</div>
				<button
					disabled={!validNewUsername}
					className='done-button'
					type='submit'
				>
					Reset Username
				</button>
				<button
					className='cancel-button'
					onClick={onDone}
				>
					Cancel
				</button>
			</form>
		</div>
	)
}

export default UserEdit;