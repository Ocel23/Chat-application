import React from 'react';
import ReactDOM from 'react-dom/client';
import BotPage from './pages/BotPage';
import "./style.css";
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<BotPage />}></Route>
))

function App() {
    return (
        <RouterProvider router={router} />
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

