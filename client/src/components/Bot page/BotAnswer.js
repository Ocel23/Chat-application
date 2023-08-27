import React from "react";
import BotIcon from "../../images/icon.png";
import Loader from "./Loader";

export default function BotAnswer({message, loadingAnswerState}) {
 
    return (
        <div>
            {loadingAnswerState && message.isActive ? <Loader side="right" first={false}/> : null}
            {message.isActive && !loadingAnswerState ?
                        <div className="bot-answers--container">
                            <p className="bot--answer accent">{message.answer}</p>
                            <img src={BotIcon} alt="bot icon" className="bot-icon--answer left"></img>    
            </div> : null}
        </div>
    )
}