import React, { useState, useEffect, useRef } from 'react';
import axios from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import TickIcon from '../icons/Tick';
import CrossIcon from '../icons/Cross';
import InfoIcon from '../icons/Info';
import {toast} from 'react-toastify'

const USER_REGEX = /^[A-z][A-z0-9_]{3,13}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const COLOR_INFO_ICON = 'rgba(0, 0, 0, 1)';

const UserRegister = () => {
	const {auth} = useAuth();
	const navigate = useNavigate();

	const userRef = useRef();

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    useEffect(() => {
		if (auth?.isLogin) navigate('/profile', {replace: true});
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === matchPassword);
    }, [password, matchPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const t1 = USER_REGEX.test(username);
        const t2 = PWD_REGEX.test(password);
		const t3 = EMAIL_REGEX.test(email);
        if (!t1 || !t2 || !t3) {
            toast.error('Invalid Details. Try Again!');
            return;
        }

        try {
            await axios.post('/user/register', { username, password, email });
			toast.success('User Registered Successfully!');
			navigate('/login', {replace:true});
        } catch (err) {
            if (!err.response) {
				toast.error('No Server Response!');
            } else {
				const errMessage = err.response?.data?.message || 'Registration Failed!';
				toast.error(errMessage);
            }
        }
    }

    return (
        <>
			<section className='page-container'>
				<h1 className='page-heading'>Register</h1>
				<form className='form-container' onSubmit={handleSubmit}>
					<div className='field-container'>
						<div className='input-field'>
							<label htmlFor='username'>
								Username:
								{ validUsername ? <TickIcon color={'#02c39a'}/> : '' }
								{ validUsername || !username ? '' : <CrossIcon color={'#e56b6f'}/> }
							</label>
							<input
								type='text'
								id='username'
								ref={userRef}
								autoComplete='off'
								onChange={(e) => setUsername(e.target.value)}
								value={username}
								required
								aria-invalid={validUsername ? 'false' : 'true'}
								aria-describedby='usernameNote'
								onFocus={() => setUsernameFocus(true)}
								onBlur={() => setUsernameFocus(false)}
							/>
						</div>

						<p id='usernameNote' className={usernameFocus && username && !validUsername ? 'instructions' : 'off-screen'}>
							<InfoIcon color={COLOR_INFO_ICON} /> <br />
							4 to 14 characters.<br />
							Must begin with a letter.<br />
							Letters, numbers, underscores allowed.
						</p>
					</div>

					<div className='field-container'>
						<div className='input-field'>
							<label htmlFor='email'>
								Email:
								{ validEmail ? <TickIcon color={'#02c39a'}/> : '' }
								{ validEmail || !email ? '' : <CrossIcon color={'#e56b6f'}/> }
							</label>
							<input
								type='text'
								id='email'
								autoComplete='off'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
								aria-invalid={validEmail ? 'false' : 'true'}
								aria-describedby='emailNote'
								onFocus={() => setEmailFocus(true)}
								onBlur={() => setEmailFocus(false)}
							/>
						</div>

						<p id='emailNote' className={emailFocus ? 'instructions' : 'off-screen'}>
							<InfoIcon color={COLOR_INFO_ICON} /> <br />
							Email for Account recovery.<br />
						</p>
					</div>

					<div className='field-container'>
						<div className='input-field'>
							<label htmlFor='password'>
								Password:
								{ validPassword ? <TickIcon color={'#02c39a'} /> : '' }
								{ validPassword || !password ? '': <CrossIcon color={'#e56b6f'} /> }
							</label>
							<input
								type='password'
								id='password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								required
								aria-invalid={validPassword ? 'false' : 'true'}
								aria-describedby='passwordNote'
								onFocus={() => setPasswordFocus(true)}
								onBlur={() => setPasswordFocus(false)}
							/>
						</div>
						<p id='passwordNote' className={passwordFocus && !validPassword && password? 'instructions' : 'off-screen'}>
							<InfoIcon color={COLOR_INFO_ICON}/> <br />
							8 to 24 characters.<br />
							Must include uppercase and lowercase letters, a number and a special character.<br />
							Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
						</p>
					</div>

					<div className='field-container'>
						<div className='input-field'>
							<label htmlFor='confirm_password'>
								Confirm Password:
								{ validMatch && matchPassword ? <TickIcon color={'#02c39a'} /> : '' }
								{ validMatch || !matchPassword ? '': <CrossIcon color={'#e56b6f'} /> }
							</label>
							<input
								type='password'
								id='confirm_password'
								onChange={(e) => setMatchPassword(e.target.value)}
								value={matchPassword}
								required
								aria-invalid={validMatch ? 'false' : 'true'}
								aria-describedby='confirmNote'
								onFocus={() => setMatchFocus(true)}
								onBlur={() => setMatchFocus(false)}
							/>
						</div>
						<p id='confirmNote' className={matchFocus && !validMatch ? 'instructions' : 'off-screen'}>
							<InfoIcon color={COLOR_INFO_ICON} /> <br />
							Must match the first password input field.
						</p>
					</div>

					<div className='input-field'>
						<div></div>
						<button disabled={!validUsername || !validPassword || !validMatch ? true : false}>Register</button>
					</div>
				</form>
				<pre className='user-form-extra'>
					{`Don't have an Account? `}
					<span>
						<Link to='/login'>Log In</Link>
					</span>
				</pre>
			</section>
        </>
    )
}

export default UserRegister;