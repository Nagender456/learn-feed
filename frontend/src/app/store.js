import { configureStore } from '@reduxjs/toolkit';
import feedsReducer from '../features/feeds/feedsSlice';

export const store = configureStore({
	reducer: {
		feeds: feedsReducer,
	}
});