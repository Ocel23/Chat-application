import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import io from "socket.io-client";



export default function ChatPage() {

    const [searchParams, setSearchParams] = useSearchParams();
    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    function sendMessage() {
        console.log("message was send")
        socket.emit("message", {
            message: messageInput,
            time: Date.now(),
        });
    }

    useEffect(() => {
        const room = searchParams.get("room")
        const newSocket = io("http://localhost:5000/chat", {
            query: {
                roomID: room
            }
        });
        setSocket(newSocket);
        return () => {
            newSocket.close()
        }
    }, [])

    useEffect(() => {
        if (socket == null) return;
        socket.on("message-response", data => {
            console.log("message was response")
                setMessages(current => [...current, {
                    message: data.message,
                    time: data.time
                }])
            })
           
        return () => {
            socket.off("message-response")
        }   
    }, [socket])

    return (
        <div>
            <h1>Chat Page</h1>
            {messages.map(data => 
                <div>
                    <p>{data.message}</p>
                    <p>{data.time}</p>
                </div>
            )}
            <form>
                <input type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput}></input>
                <button type="button" onClick={() => sendMessage()}>Poslat zprávu</button>
            </form>
        </div>
    )
}