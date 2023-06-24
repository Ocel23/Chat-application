import React, { useEffect, useState } from "react";
import { Await, defer, redirect, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { apiPost, apiDelete, apiGet , requestError, apiPut } from "../utils/api";
import io from "socket.io-client";

export async function loader({ request}) {
    const dataFromSession = sessionStorage.getItem("count");
    const parseData = parseInt(dataFromSession);

    const room = new URL(request.url).searchParams.get("room");

    const onlineUsers = await apiGet("http://localhost:5000/users/online").catch(() => {throw redirect("/email")});
    
    if (parseData === 0) {
        try {
                const user = await apiGet("http://localhost:5000/user/login")
                const countOfUsers = await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 2})
        } catch(err) {
        
                if (err instanceof requestError && err.response.status === 401) {
                    const conversationInfo = await apiGet(`http://localhost:5000/api/conversations/${room}`);
                    if (conversationInfo !== null) {
                        if (conversationInfo.users >= 1) {
                            return redirect("/");
                        }
                    } 
                    const createConversation = await apiPost("http://localhost:5000/api/conversations", {
                        id_of_room: room,
                        users: 0
                    })
                    const conversation = await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 1});
                
                } else {
                    throw err;
                }    
        }
    }
    
    sessionStorage.setItem("count", "1");
    const data = await apiGet(`http://localhost:5000/api/conversationMessages/${room}`);
    return defer({messages: data});
}

export default function ChatPage() {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const messagesData = useLoaderData();
    const [socket, setSocket] = useState();
   
    const [messageInput, setMessageInput] = useState("");

    function sendMessage() {
        socket.emit("message", {
            text: messageInput,
        });
        createMessage();
    }

    const room = searchParams.get("room")
    async function deleteRoom() {
        const deleteRoom = await apiDelete(`http://localhost:5000/api/conversations/${room}`).catch((err) => {throw err});
    }

    async function deleteAllMessages() {
        const deleteAllMessages = await apiDelete(`http://localhost:5000/api/conversationMessages/${room}`).catch((err) => {throw err})
    }

    useEffect(() => {
        const newSocket = io("http://localhost:5000/chat", {
            query: {
                roomID: room
            }
        });
        setSocket(newSocket);
        window.addEventListener("beforeunload", deleteRoom);
        window.addEventListener("beforeunload", deleteAllMessages)
        return () => {
            window.removeEventListener("beforeunload", deleteRoom);
            window.removeEventListener("beforeunload", deleteAllMessages)
            sessionStorage.removeItem("count");
            newSocket.close()
        }
    }, [])

    async function createMessage() {
        const createMessage = await apiPost("http://localhost:5000/api/conversationMessages", {
            text: messageInput,
            id_of_room: room
        }).catch((err) =>{throw err})
    }

    useEffect(() => {
        if (socket == null) return;
        socket.on("message-response", data => {
            navigate(`/chat?room=${room}`);
        })
           
        return () => {
            socket.off("message-response")
        }   
    }, [socket])


    function render(messagesData) {
        const elements = messagesData.map(data => 
            <div>
                <p>{data.text}</p>
                <p>{data.dateAdded}</p>
            </div>
        ) 
        return (
           <div>
                {elements ? elements : "nic"}
           </div>
        )
            
    }
    

    return (
        <div>
            <h1>Chat Page</h1>
            <React.Suspense fallback={<h2>Loading...</h2>}>
                <Await resolve={messagesData.messages}>
                    {render}
                </Await>
            </React.Suspense>
            <form>
                <input type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput}></input>
                <button type="button" onClick={() => sendMessage()}>Poslat zprávu</button>
            </form>
        </div>
    )
}

/*
{messages.map(data => 
                <div>
                    <p>{data.message}</p>
                    <p>{data.time}</p>
                </div>
            )}
*/