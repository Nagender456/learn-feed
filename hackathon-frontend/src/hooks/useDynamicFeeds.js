import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFeeds, renewFeeds } from '../features/feeds/feedsSlice';
import useAxiosPrivate from './useAxiosPrivate';
import { toast } from 'react-toastify';

const useDynamicFeeds = (pageNum, creator, query) => {
	const [isLoading, setIsloading] = useState(true);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [zeroFeeds, setZeroFeeds] = useState(false);
	
	const axios = useAxiosPrivate();
	const dispatch = useDispatch();
	
	useEffect(() => {
		const controller = new AbortController();
		const fetchFeeds = async (pageNum, creator, query) => {
			setIsloading(true);
			setZeroFeeds(false);
			dispatch(renewFeeds({creator, query}))
			try {
				const response = await axios.get(`/feeds`, {
					signal: controller.signal,
					params: {pageNum, creator, query}
				});
				const newFeeds = response?.data || []
				if (newFeeds.length) {
					dispatch(addFeeds(newFeeds))
					setHasNextPage(true);
				}
				else {
					if (pageNum === 1) setZeroFeeds(true);
					setHasNextPage(false);
				}
			} catch (err) {
				if (err.name === 'CanceledError') {
					return;
				}
				console.log(err)
			} finally {
				setIsloading(false);
			}
		}
		fetchFeeds(pageNum, creator, query);
		return () => controller.abort();
	}, [pageNum, creator, query])

	return [isLoading, hasNextPage, setHasNextPage, zeroFeeds];
}

export default useDynamicFeeds;