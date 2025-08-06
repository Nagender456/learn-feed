import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const navigate = useNavigate();
	const quotes = [
		`"Education is not the filling of a pail, but the lighting of a fire." - William Butler Yeats`,
		`"The more that you read, the more things you will know. The more that you learn, the more places you'll go." - Dr. Seuss`,
    	`"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela`,
		`"The beautiful thing about learning is that no one can take it away from you." - B.B. King`,
		`"Education is not preparation for life; education is life itself." - John Dewey`,
		`"The purpose of education is to replace an empty mind with an open one." - Malcolm Forbes`,
		`"Learning is a treasure that will follow its owner everywhere." - Chinese Proverb`,
		`"Education is not the answer to the question. Education is the means to the answer to all questions." - William Allin`,
		`"The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education." - Martin Luther King Jr.`,
		`"The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice." - Brian Herbert`,
	]
	return (
		<section className='page-container home-screen'>
			<h1 className='home-screen-heading'>LearnFeed</h1>
			<img className='home-screen-logo' src='/only-logo.png'></img>
			<p>{quotes[Math.floor(Math.random() * quotes.length)]}</p>
			<button className='home-screen-button' onClick={() => navigate('/feeds')}>Explore Feeds</button>
		</section>
	);
}

export default Home;