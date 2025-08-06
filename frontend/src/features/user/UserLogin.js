import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import {toast} from 'react-toastify';

const USER_REGEX = /^[A-z][A-z0-9_]{3,13}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserLogin = () => {
	const navigate = useNavigate();
	const { auth, setAuth } = useAuth();
	const location = useLocation();
    const from = location.state?.from?.pathname || '/';

	const [username, setUsername] = useLocalStorage('username', '');
	const [password, setPassword] = useState('');
	const [persistChecked, setPersistChecked] = useLocalStorage('persist', false);

	const errRef = useRef();
	const userRef = useRef();
	useEffect(() => {
		if (auth.isLogin) {
			return navigate(`/profile/${auth.username}`, { replace: true });
		}
		userRef.current.focus();
	}, []);
	// useEffect(() => {
	// 	setErrMsg('');
	// }, [username, password]);
	const handleLogin = async (e) => {
		e.preventDefault();
		if (!USER_REGEX.test(username) && !EMAIL_REGEX.test(username)) {
			return toast.error('Username not Valid!');
		}
		if (!PWD_REGEX.test(password)) {
			return toast.error('Password not Valid!');
		}
		try {
			const response = await axios.post('/user/login', {username, password});
			const accessToken = response?.data?.accessToken;
			const responseUsername = response?.data?.username;
			const avatar = response?.data?.avatar;
			if (accessToken) {
				setAuth(prev => {
					return {
						...prev,
						avatar,
						username:responseUsername,
						isLogin: true,
						accessToken
					}
				});
				toast.success('Logged in Successfully');
			}
			else {
				toast.error('Could not Login in!');
			}
			navigate(from, {replace: true});
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong!';
			toast.error(errMessage);
		}
	}
	return (
		<section className='page-container'>
			<h1 className='page-heading'>Login</h1>
			<form className='form-container' onSubmit={handleLogin}>
				<div className='field-container'>
					<div className='input-field'>
						<label htmlFor='username'>
							Username:
						</label>
						<input
							type='text'
							id='username'
							ref={userRef}
							autoComplete='off'
							onChange={(e) => setUsername(e.target.value)}
							value={username}
							required
						/>
					</div>
				</div>

				<div className='field-container'>
					<div className='input-field'>
						<label htmlFor='password'>
							Password:
						</label>
						<input
							type='password'
							id='password'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
					</div>
				</div>

				<div className='input-field'>
					<div className='checkbox-container'>
						<input 
							type='checkbox'
							className='clickable' 
							id='persist'
							onChange={() => setPersistChecked(!persistChecked)}
							checked={persistChecked}
						/>
						<label className='clickable' htmlFor='persist'>Remember me on this device</label>
					</div>
					<button disabled={!password || !username}>Log In</button>
				</div>
			</form>
			<pre className='user-form-extra'>
				{`Don't have an Account? `}
				<span>
					<Link to='/register'>Register</Link>
				</span>
			</pre>
		</section>
	);
}

export default UserLogin;