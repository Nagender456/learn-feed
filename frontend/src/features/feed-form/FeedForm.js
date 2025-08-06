import React, { useState, useRef } from 'react';
import UploadIcon from '../icons/UploadIcon'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';

const FeedForm = () => {	
	const imageInputRef = useRef();

	const [feedPost, setFeedPost] = useState({ title: '', image: '' });
	const [fileSelected, setFileSelected] = useState(false);

	const axios = useAxiosPrivate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('feeds', feedPost);			;
			toast.success('Feed created Successfully!')
			setFileSelected(false);
			setFeedPost({ title: '', image: '' });
			// navigate('/');
		} catch (err) {
			const errMessage = err.response?.data?.message || 'Something went Wrong';
			toast.error(errMessage)
		}
	}
	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file.type.substring(0, 5) !== 'image') {
			return toast.error('Wrong file-type!');
		}
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			setFileSelected(true);
			setFeedPost( {...feedPost, image: reader.result} );
		})
		reader.readAsDataURL(file);
	}
	
	return (
		<section className='page-container'>
			{ fileSelected ? <>
				<form className='form-container' onSubmit={handleSubmit}>
					<div className='form-image-container clickable' title='Replace Image'>
						<img 
							onClick={
								() => {
									imageInputRef.current.click();
								}
							} 
							src={feedPost.image} 
							alt='feed' 
						/>
						{/* <div className='form-replace-button' onClick={() => setFileSelected(false)}>
							<ReplaceIcon />
						</div> */}
					</div>
						<div className='input-field'>
							<label htmlFor='feed-title'>Description:</label>
							<textarea 
								id='feed-title' 
								cols='40' 
								rows='2'
								onChange={e => setFeedPost({...feedPost, title: e.target.value})}
								placeholder='Max Length: 500'
								maxLength='500'
							></textarea>
						</div>
					<div className='input-field'>
						<div></div>
						<button type='submit'>Submit</button>
					</div>
					<input 
						className='image-input'
						type='file' 
						ref={imageInputRef}
						accept='image/*' 
						onChange={handleFileInput}
						id='image-input'
					/>
				</form>
				</> : <>
					<span className='feed-form-container'>
						<h1 className='page-heading'>Submit a Feed</h1>
						<br />
						<span className='image-input-container'>
							<label
								className='clickable'
								htmlFor='image-input'>
								<UploadIcon />
							</label>
						</span>
						<div></div>
						<input 
							className='image-input'
							type='file' 
							ref={imageInputRef}
							accept='image/*' 
							onChange={handleFileInput}
							id='image-input'
						/>
					</span>
				</>}
		</section>
	);
};

export default FeedForm;