
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.min.css';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { 
  createBrowserRouter, 
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import App from './App';
import reportWebVitals from './reportWebVitals';

import HomeScreen from './screens/HomeScreens';
import GameScreen from './screens/GameScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index={true} path="/" element={<HomeScreen/>}></Route>
    <Route path="/game" element={<GameScreen />} />
    <Route path="/login" element={<LoginScreen />} />
<Route path="/register" element={<RegisterScreen />} />
<Route path="/leaderboard" element={<LeaderboardScreen />} />
    </Route>
)
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

reportWebVitals();
