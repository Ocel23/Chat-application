import React, { useState } from "react";
import SendIcon from "../images/chat-send-icon.svg";
import TrashCan from "../images/trash-can.svg";
import { apiPost, apiGet, requestError } from "../utils/api";
import showServerError from "../utils/showServerError";
import { useNavigate } from "react-router-dom";
import { config } from "../config";

export default function ChatForm({isAdmin, messageInput, socket, handleInput , room, cancelConversation, showTemplates, inputRef}) {
    //hook for navigate user to another page
    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const sendMessage = () => {
        //check input message
        if (messageInput === "") {
            return;
        } 
        socket.emit("message", {
            text: messageInput,
            senderIsAdmin: isAdmin ? true : false
        });
        handleInput("");
        createMessage();
    }

    //function for create message
    async function createMessage() {
        try {

            const API_URL = process.env.REACT_APP_NODEJS_ADDRESS;
            //nodejs api address
            const conversation = await apiGet(`${API_URL}/api/conversations/${room}`);

            await apiPost(`${API_URL}/api/conversationMessages`, {
                text: messageInput,
                room: conversation._id,
                dateAdded: Date.now,
                senderIsAdmin: isAdmin ? true : false
            });    
        } catch(err) {
            if (err instanceof requestError) {
                navigate("/");
                return showServerError(await err.response.text());
            } else {
                navigate("/");
                return showServerError(await err.message);
            }
        }
    }

    //handle change input
    function handleChange(e) {
        setMessage(e.target.value);
        handleInput(e.target.value);
    }

    //handle enter key
    function handleEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInput(message);
            sendMessage();
        }
    }

    return (
        <>
            <form className={isAdmin ? "chat-form--container chat-form-container--admin" : "chat-form--container"}>
                <div style={{display: "flex"}}>
                    <input type="text" onChange={(e) => handleChange(e)} onKeyDown={handleEnter} value={messageInput} className="chat-form--input" placeholder={config.chatPage.inputPlacelholder} autoFocus ref={inputRef}></input>
                    <button type="button" onClick={sendMessage} className="chat-form--button"><img src={SendIcon} className="chat-form--img"></img></button>    
                </div>
                {isAdmin && 
                <div className="chat-form-admin-tools--container">
                    <button type="button" onClick={cancelConversation} className="chat-form-admin-tool--delete">Delete conversation&nbsp;&nbsp;<img src={TrashCan} className="chat-form-admin--delete-icon"></img></button>
                    <p onClick={showTemplates} style={{cursor: "pointer"}}>Messages templates</p> 
                </div>}
            </form>    
        </>
    )
}