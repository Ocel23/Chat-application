import React from "react";

export default  function MessageTemplate({showTemplate, handleInput, handleShowTemplate, handleFocus}) {

    const messages = ["How are you?", "What is your name?"];

    function handleMessage(message) {
        handleInput(message);
        handleShowTemplate(false);
        handleFocus();
    }

    return (
        <>
            <div className={!showTemplate ? "messages-templates-container--hide" : "messages-templates-container--show"}>
                {messages.map(message =>
                    <p className="messages-templates--message" onClick={() => handleMessage(message)}>{message}</p> 
                )}
            </div>  
        </>
        
    )
}