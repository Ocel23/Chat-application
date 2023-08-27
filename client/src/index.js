import React from 'react';
import ReactDOM from 'react-dom/client';
import EmailForm, {action as SendEmailAction} from './components/EmailForm';
import LoginPage, {action as LoginAction} from './pages/LoginPage';
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
import BotPage from './pages/BotPage';


const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/'>
        <Route index element={<BotPage/>}></Route>
        <Route path='chat' element={<ChatPage />} loader={ChatPageLoader} errorElement={<Error />}></Route>
        <Route path='dashboard' element={<Dashboard />} loader={DashBoardLoader} errorElement={<Error />}></Route>
        <Route path='login' element={<LoginPage />} action={LoginAction} errorElement={<Error />}></Route>
        <Route path='email' element={<EmailForm />} action={SendEmailAction} errorElement={<Error />}></Route>
        <Route path='*' element={<NotFound />}></Route>
    </Route>
))

function Main() {
    
    return (
        <RouterProvider router={router} />
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

