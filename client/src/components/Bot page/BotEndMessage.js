import React from "react";
import BotIcon from "../../images/icon.png";
import Loader from "./Loader";
import { config } from "../../config";

export default function BotEndMessage({loading, isNoActive}) {
    
    return (
        <>
            {loading && isNoActive ? <Loader side="right" first={false} /> : null}
            {!loading && isNoActive ?
            <div className="bot-end-message--container">
                <p className="bot--answer primary">{config.botPage.endMessageText}</p>
                <img src={BotIcon} alt="bot icon" className="bot-icon--answer left"></img>    
            </div> : null}
        </>
    )
}