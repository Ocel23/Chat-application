import React from "react";
export default function Question({message, handleClick}) {
   
    return (
        <>
            <button type="button" onClick={() => handleClick(message.id)} className={message.isActive ? "bot--question active m-16" : "bot--question accent m-16"}>{message.question}</button>  
        </>
    )
}