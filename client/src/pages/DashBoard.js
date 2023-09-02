import React, { useEffect } from "react";
import { apiGet, apiPut, requestError } from "../utils/api";
import { defer, useLoaderData} from "react-router-dom";
import Navbar from "../components/Navbar";
import Statictics from "../components/Statictics";
import Conversations from "../components/Conversations";
import requireAuth from "../utils/requireAuth";
import Footer from "../components/Footer";
import showServerError from "../utils/showServerError";

export async function loader() {
    try {
        //require auth
        await requireAuth();
    } catch(err) {
        throw err;
    }
    //get all statistics data
    const statistics1 = await apiGet("http://localhost:5000/statistics");
    
    //fucntion for handle today conversation value
    async function handleDeleteTodayConversations() {
        const today = new Date();
        const conversationDate = new Date(statistics1[0].dateOfLastCreatedConversation);
        if (conversationDate.getDate() !== today.getDate()) {
            await apiPut("http://localhost:5000/statistics", {
                todayConversations: 0,
            }); 
        }
    }
    handleDeleteTodayConversations();
    //get all conversations
    const conversations1 =  await apiGet("http://localhost:5000/api/conversations");  
    return defer({conversations : conversations1, statistics: statistics1});
}




export default function Dashboard() {

    //date from loader
    const data = useLoaderData();
    const conversations = data.conversations;
    const statistics = data.statistics;

    //status functions
    async function setOffline() {
        try {
            const userData2 = await apiGet("http://localhost:5000/user/login");
            await apiPut(`http://localhost:5000/users/online/${userData2._id}`, {isOnline: false});
        } catch(err) {
            if (err instanceof requestError) {
                return showServerError(await err.response.text())
            } else {
                return showServerError(err.message);
            }
        }
    }

    async function setOnline() {
        try {
            const userData1 = await apiGet("http://localhost:5000/user/login");
            await apiPut(`http://localhost:5000/users/online/${userData1._id}`, {isOnline: true})
        } catch(err) {
            if (err instanceof requestError) {
                return showServerError(await err.response.text())
            } else {
                return showServerError(err.message);
            }
        }
    }
    
    useEffect(() => {
        window.addEventListener("beforeunload", setOffline);
        setOnline();
        return () => {
            window.removeEventListener("beforeunload", setOffline);    
        }
    }, [])

    return (
        <div className="dashboard--container">
            <Navbar setOffline={setOffline}/>
            <div className="dashboard-container--content">
                <Statictics statistics={statistics}/>
                <Conversations conversations={conversations}/>    
            </div>
            <Footer />
        </div>
    )
}