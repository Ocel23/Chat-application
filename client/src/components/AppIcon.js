import React, { useCallback } from "react";
import Icon from "../images/app-icon.svg";

export default function AppIcon({handleBotAppState, handleChatAppState}) {

    //function for handle click show/hide
    const handleClick = useCallback(() => {
        if (handleBotAppState) {
            handleBotAppState(prevValue => !prevValue);
        } else if (handleChatAppState) {
            handleChatAppState(prevValue => !prevValue);
        }
    })

    return (
        <div className="app--icon" onClick={handleClick}>
            <img src={Icon} alt="app icon" className="app-icon--image"></img>
        </div>
    )
}
