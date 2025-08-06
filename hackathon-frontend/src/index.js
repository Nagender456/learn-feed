import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthProvider';
import App from './App';
import './index.css';

import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Provider store={store}>
					<App />	
				</Provider>
			</AuthProvider>
		</BrowserRouter>
	// </React.StrictMode>
);