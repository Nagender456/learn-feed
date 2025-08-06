import React, {useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import {toast} from 'react-toastify';

const NavBar = () => {
	const [dropDownActive, setDropDownActive] = useState(false);
	const {auth, setAuth} = useAuth();
	const navigate = useNavigate();
	const dropDownRef = useRef();
	const hideUserDropDown = () => {
		dropDownRef.current.classList.add('user-drop-down-exit');
		setTimeout(() => {
			setDropDownActive(false);
		}, 200);
	}
	const showUserDropDown = () => {
		setDropDownActive(true);
		setTimeout(() => window.addEventListener('click', hideUserDropDown, {once: true}), 100);
	}
	const handleLogout = async (e) => {
		try {
			await axios.get('/user/logout');
			toast.success('Logged out!')
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong!';
			toast.error(errMessage);
		} finally {
			setAuth(prev => {
				return {
					...prev,
					isLogin: false,
					avatar: undefined,
					username: undefined,
					accessToken: undefined
				}
			})
			navigate('/login', { replace: true })
		}
	}
	return (
		<>
			<div className='nav-bar'>
				<div>
					<Link to='/feeds'>
						<img className='nav-bar-logo' src='/logo.png' alt='MMM' />
					</Link>
					{/* <AnchorButton text='Submit' linkto='/feeds/create' /> */}
				</div>
				<div>
					{ auth.isLogin 
					? <span 
							className='clickable nav-bar-profile' 
							onClick={() => {
								!dropDownActive && showUserDropDown();
							}}
						>
							<img src={auth.avatar ? auth.avatar : `/default-avatar.jpg`} alt='dp' />
						</span> 
					: <>
						<span
							className='nav-bar-login-button'
						>
							<Link to='/login'>Log In</Link>
						</span>
						<span
							className='nav-bar-register-button'
						>
							<Link to='/register'>Register</Link>
						</span>
					</>
					}
				</div>
			</div>
			{
				dropDownActive 
					?	
					<span ref={dropDownRef} className='user-drop-down'>
						<span className='user-avatar clickable' onClick={() => {
							navigate(`/profile/${auth.username}`);
						}}>
							<img src={auth.avatar ? auth.avatar : `/default-avatar.jpg`} alt='dp' />
							<pre>{` ${auth?.username}`}</pre>
						</span>
						<hr />
						<span className='clickable' onClick={() => navigate('/edit')}>Edit Profile</span>
						<span className='clickable' onClick={() => navigate('/feeds/create')}>Create Feed</span>
						{ auth.isLogin ? <span className='clickable' onClick={() => navigate(`/feeds/${auth.username}`)}>My Feeds</span> : ''}
						<span className='clickable' onClick={() => {
							handleLogout();
						}}>Logout</span>
					</span>
					: 
					''
			}
		</>
	);
}

export default NavBar;