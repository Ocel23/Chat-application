import React from "react";
import { Await } from "react-router-dom"
import dateFormater from "../utils/dateFormater";

export default function ChatMessages({messagesData, messages, isAdmin}) {

        //output
        
        function render(messagesData) {
        if (messagesData != null) {
            const elements = messagesData.map(message => 
                <div className={decideClassForMessage(message, "chat-message--left", "chat-message--right", "chat-message--left", "chat-message--right")}>
                    <p className={decideClassForMessage(message, "chat-logo--left", "chat-logo--right", "chat-logo--left", "chat-logo--right")}>{decideClassForMessage(message, "I", "A", "I", "U")}</p>
                    <p className={decideClassForMessage(message, "chat--text chat-text--left accent left", "chat--text chat-text--right accent right", "chat--text chat-text--left accent left", "chat--text chat-text--right accent right")}>{message.text}</p>
                    <p className={decideClassForMessage(message, "chat-date--left", "chat-date--right", "chat-date--left", "chat-date--right")}>{dateFormater(message.dateAdded)}</p>
                </div>
            ) 
            return (
                <>
                    {elements ? elements : <span>None message was found.</span>}
                </>
            )    
        }
        
                
        }
    
     //function for decide order message
     function decideClassForMessage(message, statement1, statement2, statement3, statement4) {
        if (isAdmin && message.senderIsAdmin) {
            return statement1;
        } else if (!isAdmin && message.senderIsAdmin) {
            return statement2;
        } else if (!isAdmin && !message.senderIsAdmin) {
            return statement3;
        } else if (isAdmin && !message.senderIsAdmin) {
            return statement4;
        }
    }

    return (
        <>
            <div className="chat--container">
                {messagesData != null &&
                <React.Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={messagesData.messages}>
                        {render}
                    </Await>
                </React.Suspense>
                } 
                {messages.map(message => 
                    <div className={decideClassForMessage(message, "chat-message--left", "chat-message--right", "chat-message--left", "chat-message--right")}>
                        <span className={decideClassForMessage(message, "chat-logo--left", "chat-logo--right", "chat-logo--left", "chat-logo--right")}>{decideClassForMessage(message, "I", "A", "I", "U")}</span>
                        <p className={decideClassForMessage(message, "chat--text chat-text--left primary left", "chat--text chat-text--right accent right", "chat--text chat-text--left primary left", "chat--text chat-text--right accent right")}>{message.text}</p>
                        <p className={decideClassForMessage(message, "chat-date--left", "chat-date--right", "chat-date--left", "chat-date--right")}>{message.dateAdded}</p>
                    </div>
                )} 
            </div>
        </>
    )
}