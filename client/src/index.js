import React from 'react';
import ReactDOM from 'react-dom/client';
import BotPage from './pages/BotPage';
import EmailForm, {action as SendEmailAction} from './components/EmailForm';
import LoginPage, {action as LoginAction} from './pages/LoginPage';
import Layout from './components/Layout';
import ChatPage, {loader as ChatPageLoader} from './pages/ChatPage';
import Dashboard, {loader as DashBoardLoader} from './pages/DashBoard';
import {
    RouterProvider,
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";
import "./style.css";
import NotFound from './pages/NotFound';
import Error from './components/Error';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>
        <Route index element={<BotPage />}></Route>
        <Route path='chat' element={<ChatPage />} loader={ChatPageLoader} errorElement={<Error />}></Route>
        <Route path='dashboard' element={<Dashboard />} loader={DashBoardLoader} errorElement={<Error />}></Route>
        <Route path='login' element={<LoginPage />} action={LoginAction}></Route>
        <Route path='email' element={<EmailForm />} action={SendEmailAction}></Route>
        <Route path='*' element={<NotFound />}></Route>
    </Route>
))

function App() {
    return (
        <RouterProvider router={router} />
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

