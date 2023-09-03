import React from "react";
import { config } from "../config";

export default  function MessageTemplate({showTemplate, handleInput, handleShowTemplate, handleFocus}) {

    const messages = config.chatPage.templateMessages;

    function handleMessage(message) {
        handleInput(message);
        handleShowTemplate(false);
        handleFocus();
    }

    return (
        <>
            <div className={!showTemplate ? "messages-templates-container--hide" : "messages-templates-container--show"}>
                {messages.map((message, index) =>
                    <p className="messages-templates--message" onClick={() => handleMessage(message)} key={index}>{message}</p> 
                )}
            </div>  
        </>
        
    )
}