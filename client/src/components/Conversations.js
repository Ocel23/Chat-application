import React, { useState, useEffect } from "react";
import { Await } from "react-router-dom";
import dateFormater from "../utils/dateFormater";

export default function Conversations({conversations}) {

    //function for join room by id
     function joinRoom(id) {
        window.open(`/chat?room=${id}`, "_blank");
    }

    const [count, setCount] = useState([]);

    function countConversations() {
        const array = [];
        for (let i = 1; i < conversations.length + 1; i++) {
            array.push(i);
        }
        return setCount(array);
    }

    useEffect(() => {
        countConversations();
    }, [])

    //render
    function render(conversations) {
        const elements = conversations.map((conversation, index) => 
            <div className="dashboard-conversation--container" onClick={() => joinRoom(conversation.id_of_room)} key={conversation._id}>
                    <p className="dashboard-conversation--count"><span className="dashboard-conversation--text">Conversation</span>&nbsp;{count[index]}</p>
                    <p className="dashboard-conversation--date">{dateFormater(conversation.dateAdde)}</p>
                    <p className="dashboard-conversation--online">Online: <span className="dashboard-conversation-online--text">{conversation.users}</span></p>
            </div>
        )
        return (
            <>
                {conversations.length === 0 ? <p className="dashboard--no-conversation">No conversation was found.</p> : elements}
            </>
        )
    }

    //output
    return (
        <div className="dashboard-conversations--container">
            <React.Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={conversations}>
                        {render}
                    </Await>
            </React.Suspense>
        </div>
    )
}