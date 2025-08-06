import React from 'react';
// import Form from './features/feed-submit-form/Form';
import Feeds from './features/feeds/Feeds';
import Feed from './features/feeds/feed-view/Feed';
import FeedForm from './features/feed-form/FeedForm';
import NavBar from './features/nav-bar/NavBar';
import UserProfile from './features/user/UserProfile';
import UserLogin from './features/user/UserLogin';
import UserRegister from './features/user/UserRegister';
import UserEdit from './features/user/UserEdit';
import RequireAuth from './features/user/RequireAuth';
import PersistLogin from './features/PersistLogin';
import Home from './features/Home';
import { Routes, Route } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	return (
		<>
			<ToastContainer
				position='top-center'
				autoClose={1000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover
				theme='light'
				transition={Flip}
			/>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth />}>
						<Route path='/feeds/create' element={<FeedForm />} />
						<Route path='/edit' element={<UserEdit />} />
					</Route>
					<Route path='/home' element={<Home />} />
					<Route path='/feeds/:creator?' element={<Feeds />} />
					<Route path='/feed/:id' element={<Feed />} />
					<Route path='/login' element={<UserLogin />} />
					<Route path='/register' element={<UserRegister />} />
					<Route path='/profile/:username' element={<UserProfile />} />
				</Route>
			</Routes>
		</>
	)
}

export default App;