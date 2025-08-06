import React, {useRef} from 'react';
import ThumbUp from '../../icons/ThumbUp';
import Share from '../../icons/Share';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateFeed } from '../feedsSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FeedCard = React.forwardRef(({ feed }, ref) => {
	const axios = useAxiosPrivate();
	const { auth } = useAuth();
	const likeButton = useRef();
	const dispatch = useDispatch();
	const handleLike = async () => {
		if (!auth?.isLogin) {
			toast.error('Login Required!');
			return
		}
		try {
			const response = await axios.put('feed/like', { id:feed._id.toString() });
			const updatedFields = response.data;
			dispatch(updateFeed({id:feed._id, fields:updatedFields})) 
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something Went Wrong';
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
			<Link
				to={`/feed/${feed._id}`}
				className='feed-image-restricted'
			>
				<img src={feed.image} alt='feedImage' />
			</Link>
			<p className='feed-title'>{feed.title}</p>
			<div className='feedback-container'>
				<div className='part'>
					<span className='button-container'>
						<span ref={likeButton} className={`like-button ${feed.isLiked ? 'like-button-clicked' : ''} clickable`} onClick={handleLike} >
							<ThumbUp/>
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
						<Share />
					</span>
				</div>
			</div>
		</div>
	</>
	return (
		<>
		{
			ref
			?
			<div ref={ref} className='feed-card-container'>
				{feedBody}
			</div>
			:
			<div className='feed-card-container'>
				{feedBody}
			</div>
		}
		</>
	);
});

export default FeedCard;