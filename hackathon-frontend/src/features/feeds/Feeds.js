import React, { useCallback, useEffect, useRef, useState } from 'react';
import { selectAllFeeds } from './feedsSlice';
import { useSelector } from 'react-redux';
import FeedCard from './feed-card/FeedCard';
import useDynamicFeeds from '../../hooks/useDynamicFeeds';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SearchBar from './SearchBar';

const Feeds = () => {
	const feeds = useSelector(selectAllFeeds);
	const { creator } = useParams();
	const [pageNum, setPageNum] = useState(1);
	const [query, setQuery] = useState('');
	const {auth} = useAuth();
	const [isLoading, hasNextPage, setHasNextPage, zeroFeeds] = useDynamicFeeds(pageNum, creator, query);
	
	const intObserver = useRef();
	const lastFeedRef = useCallback(post => {
		if (isLoading) return
		if (intObserver.current) intObserver.current.disconnect();
		intObserver.current = new IntersectionObserver(posts => {
			if (posts[0].isIntersecting && hasNextPage) {
				setPageNum(prev => prev+1);
			}
		})

		if (post) intObserver.current.observe(post);
	}, [isLoading, hasNextPage])
	useEffect(() => {
		setPageNum(1);
		setHasNextPage(true);
	}, [creator, query])
	return (
		<>
			<div className='page-container'>
				{auth?.isLogin ? <SearchBar setQuery={setQuery} /> : ''}
				{ zeroFeeds 
					? <h1 className='page-heading'>No Feeds Found</h1>
					: <div className='feeds-container'>
						{
							feeds?.map((feed, index) => {
								return (
									index+1 === feeds.length 
									? <FeedCard key={feed._id} ref={lastFeedRef} feed={feed} />
									: <FeedCard key={feed._id} feed={feed} />
								)
							})
						}
						{isLoading ? <h2>Loading...</h2>:''}
					</div>
				}
			</div>
		</>
	);
};

export default Feeds;