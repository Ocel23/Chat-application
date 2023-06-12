import React from 'react';
import ReactDOM from 'react-dom/client';
import BotPage from './pages/BotPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";
import "./style.css";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>
        <Route index element={<BotPage />}></Route>
        <Route path='login' element={<LoginPage />}></Route>
    </Route>
))

function App() {
    return (
        <RouterProvider router={router} />
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

