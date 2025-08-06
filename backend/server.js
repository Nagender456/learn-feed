import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import cookieParser from 'cookie-parser';

import feedsRoute from './routes/feeds.js';
import feedRoute from './routes/feed.js';
import usersRoute from './routes/users.js';

const app = express();

app.use(cors(corsOptions)); 
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use('/feeds', feedsRoute);
app.use('/feed', feedRoute);
app.use('/user', usersRoute);

const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.nxwkoim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// const CONNECTION_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@main-project-cluster.pwxesdh.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;
mongoose.set('strictQuery', true);
mongoose.connect(
	CONNECTION_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)
.then(() => {
	app.listen(PORT, () => console.log(`Server running on Port ${PORT}`))
})
.catch((error) => {
	console.log(error);
	console.log(error.message);
})