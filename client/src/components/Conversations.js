import React from "react";
import { Await } from "react-router-dom";
import dateFormater from "../utils/dateFormater";

export default function Conversations({conversations}) {

    //function for join room by id
     function joinRoom(id) {
        window.open(`/chat?room=${id}`, "_blank");
    }


    //render
    function render(conversations) {
        const elements = conversations.map(conversation => 
            <div className="dashboard-conversation--container" onClick={() => joinRoom(conversation.id_of_room)} key={conversation._id}>
                    <p className="dashboard-conversation--count">{conversations.length}</p>
                    <p className="dashboard-conversation--date">{dateFormater(conversation.dateAdde)}</p>
                    <p className="dashboard-conversation--online">{conversation.users}</p>
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