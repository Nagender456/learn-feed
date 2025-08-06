import React, {useEffect, useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';
import ThumbUpIcon from '../../icons/ThumbUp';
import ShareIcon from '../../icons/Share';
import { useDispatch } from 'react-redux';
import { updateFeed } from '../feedsSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Feed = () => {
	const { id } = useParams();
	const [feed, setFeed] = useState({})
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const axios = useAxiosPrivate();
	useEffect(() => {
		const controller = new AbortController();
		const getFeed = async () => {
			try {
				const response = await axios.get(`feed/${id}`, {
					signal: controller.signal
				});
				const foundFeed = response?.data;
				if (!foundFeed) {
					navigate('/', {replace: true});
				}
				setFeed(foundFeed);
				setIsLoading(false);
			} catch (err) {
				if (err.name === 'CanceledError') {
					return;
				}
				if (!err.response) {
					toast.error(`Server didn't response`);
					return navigate('/', {replace: true})
				}
				const errMessage = err.response?.data?.message || 'Something went Wrong!';
				toast.error(errMessage);
				navigate('/', {replace: true});
			}
		}
		getFeed();
		return () => controller.abort();
	}, [])
	return (
		<div className='page-container'>
			<div className='feeds-container'>
				{isLoading 
					? 
					<h2>Loading...</h2>
					:
					<FeedView feed={feed} setFeed={setFeed} />
				}
			</div>
		</div>
	);
}

const FeedView = ({ feed, setFeed }) => {
	const axios = useAxiosPrivate();
	const { auth } = useAuth();
	const likeButton = useRef();
	const dispatch = useDispatch();
	const handleLike = async () => {
		if (!auth?.isLogin) {
			// to do
			toast.error('Login Required!');
			return
		}
		try {
			const response = await axios.put('feed/like', { id:feed._id.toString() });
			const updatedFields = response.data;
			dispatch(updateFeed({id:feed._id.toString(), fields:updatedFields}));
			setFeed({...feed, ...updatedFields});
		} catch (err) {
			const errMessage = err.response?.data?.message || "Something went Wrong!"
			toast.error(errMessage);
		}
	}
	const feedBody = 
	<>
		<div className='feed-card'>
			<span className='feed-creator-container'>
				<Link 
					className='creator-name clickable'
					to={`/profile/${feed.creatorName}`}
				>{`@${feed.creatorName}`}</Link>
			</span>
			<span
				className='feed-image-full'
			>
				<img src={feed.image} alt='feedImage' />
			</span>
			<div className='feed-title'>{feed.title}</div>
			<div className='feedback-container'>
				<div className='part'>
					<span className='button-container'>
						<span ref={likeButton} className={`like-button ${feed.isLiked ? 'like-button-clicked' : ''} clickable`} onClick={handleLike} >
							<ThumbUpIcon/>
						</span>
						<pre>{`  ${feed.likes} Likes`}</pre>
					</span>
				</div>
				<div className='part'>
					<span 
						className='button-container share-button clickable'
						onClick={() => {
							navigator.clipboard.writeText(`${window.location.protocol}/${window.location.host}/feed/${feed._id}`);
							toast.success('Link copied to Clipboard!')
						}}
					>
						<ShareIcon />
					</span>
				</div>
			</div>
		</div>
	</>
	return (
		<div className='feed-card-container'>
			{feedBody}
		</div>
	);
}

export default Feed;