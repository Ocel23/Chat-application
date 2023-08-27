import React from "react";
export default function Question({message, handleClick}) {
   
    return (
        <div>
            <button type="button" onClick={() => handleClick(message.id)} className={message.isActive ? "bot--question active p-16" : "bot--question accent p-16"}>{message.question}</button>  
        </div>
    )
}