import React, { useState } from 'react';
import SearchIcon from '../icons/Search';

const SearchBar = ({setQuery}) => {
	const [queryInput, setQueryInput] = useState('');
	const handleSearch = (e) => {
		e.preventDefault();
		setQuery(queryInput);
	}
	return (
		<form className='feeds-search-bar-container' onSubmit={handleSearch}>
			<input 
				type='text' 
				value={queryInput} 
				onChange={(e) => setQueryInput(e.target.value)}
				placeholder='Search Feeds'
				spellCheck='false'
			/>
			<button 
				className='search-button'
				type='submit'
			>
				<SearchIcon />
			</button>
		</form>
	);
}

export default SearchBar;