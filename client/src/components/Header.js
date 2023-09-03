import React from "react";
import downIcon from "../images/icon-down.svg";
import resizeIcon from "../images/resize-icon.svg";
import BotIcon from "../images/icon.png";
import { config } from "../config";

export default function Header({heading, handleBotAppState, handleChatAppState , logo ,description, handleResize}) {

    const hideApp = () => {
        if (handleBotAppState) {
           handleBotAppState(prevValue => !prevValue);
        } else if (handleChatAppState) {
           handleChatAppState(prevValue => !prevValue);
        }
    }

    function resize() {
        handleResize(prevValue => !prevValue);
    }

    return (
        <header className="navbar--container">
            <img src={downIcon} alt="hide page dow icon" className="navbar--button-down" onClick={hideApp}></img>
            <img src={resizeIcon} alt="resize button" className="navbar--button-resize" onClick={() => resize()}></img>
            <div className={logo ? "navbar--heading" : "navbar-heading--column"}>
                {logo && <img src={BotIcon} alt="bot icon" className="navbar-bot--icon"></img>}
                <h4 className="navbar--title">{heading}</h4>    
                {description && <p className="navbar--description">{config.chatPage.description}</p>}
            </div>
        </header>
    )
}