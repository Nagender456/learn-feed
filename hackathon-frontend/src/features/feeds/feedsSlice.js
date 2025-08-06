import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import * as api from '../../api/index';

const initialState = {
	params: {},
	feeds: [],
};

// export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
// 	try {
// 		const { data } = await api.fetchFeeds();
// 		return data;
// 	} catch(err) {
// 		return [];
// 	}
// })

export const feedsSlice = createSlice({
	name: 'feeds',
	initialState,
	reducers: {
		addFeeds: (state, action) => {
			const newFeeds = action.payload;
			newFeeds.forEach(newFeed => {
				for (let i=0; i<state.feeds.length; i++) {
					if (state.feeds[i]._id === newFeed._id) return;
				}
				state.feeds.push(newFeed);
			})
		},
		updateFeed: (state, action) => {
			const index = state.feeds.findIndex(feed => feed._id === action.payload.id);
			if (index === -1) return;
			state.feeds[index] = {...state.feeds[index], ...action.payload.fields}
		},
		renewFeeds: (state, action) => {
			const curParams = action.payload;
			console.log(curParams)
			if (JSON.stringify(state.params) === JSON.stringify(curParams)) return
			console.log("Clearing Posts!")
			state.feeds = []
			state.params = curParams
		}
	}
});

export const selectAllFeeds = (state) => state.feeds.feeds;

export const selectNextPage = (state) => state.feeds.nextPage;

export const { addFeeds, updateFeed, renewFeeds } = feedsSlice.actions;

export default feedsSlice.reducer;