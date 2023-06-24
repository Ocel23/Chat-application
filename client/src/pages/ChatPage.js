import React, { useEffect, useState } from "react";
import { Await, defer, redirect, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { apiPost, apiDelete, apiGet , requestError, apiPut } from "../utils/api";
import io from "socket.io-client";

export async function loader({ request}) {
    //get data from session storage
    const dataFromSession = sessionStorage.getItem("count");
    const parseData = parseInt(dataFromSession);

    const room = new URL(request.url).searchParams.get("room");

    //get online users for count, if nobody is online then redirect to email page
    await apiGet("http://localhost:5000/users/online").catch(() => {throw redirect("/email")});
    
    if (parseData === 0) {
        try {
                //get user info
                await apiGet("http://localhost:5000/user/login")
                //put count of user in conversations to 2 - join admin
                async function changeCount1() {
                    await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 2})   
                }
                changeCount1();
                
        } catch(err) {
                //if not authorized, normal user
                if (err instanceof requestError && err.response.status === 401) {
                    //get data of conversation by id
                    const conversationInfo = await apiGet(`http://localhost:5000/api/conversations/${room}`);
                    //statement for check if data
                    if (conversationInfo !== null) {
                        //statement for check count of users in conversation
                        if (conversationInfo.users >= 1) {
                            return redirect("/");
                        }
                    }
                    //function for create conversation
                    async function createConversation() {
                        await apiPost("http://localhost:5000/api/conversations", {
                            id_of_room: room,
                            users: 0
                        })    
                    }
                    createConversation();
                    async function changeCount2() {
                        await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 1});
                    }
                    changeCount2();
                } else {
                    throw err;
                }    
        }
    }
    //get se count in session storage
    sessionStorage.setItem("count", "1");
    //get messages from conversation by id
    const data = await apiGet(`http://localhost:5000/api/conversationMessages/${room}`);
    return defer({messages: data});
}

export default function ChatPage() {

    const room = searchParams.get("room")
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

    //function for delete room
    async function deleteRoom() {
        await apiDelete(`http://localhost:5000/api/conversations/${room}`).catch((err) => {throw err});
    }

    //function for delete all messages in conversation
    async function deleteAllMessages() {
        await apiDelete(`http://localhost:5000/api/conversationMessages/${room}`).catch((err) => {throw err})
    }

    useEffect(() => {
        //socket client connect
        const newSocket = io("http://localhost:5000/chat", {
            query: {
                roomID: room
            }
        });
        setSocket(newSocket);
        //delete room and messages on leave chat
        window.addEventListener("beforeunload", deleteRoom);
        window.addEventListener("beforeunload", deleteAllMessages)
        return () => {
            window.removeEventListener("beforeunload", deleteRoom);
            window.removeEventListener("beforeunload", deleteAllMessages)
            //remove count from session storage
            sessionStorage.removeItem("count");
            newSocket.close()
        }
    }, [])

    async function createMessage() {
        await apiPost("http://localhost:5000/api/conversationMessages", {
            text: messageInput,
            id_of_room: room
        }).catch((err) =>{throw err})
    }

    //events for sebd messages between socket client and server
    useEffect(() => {
        if (socket == null) return;
        socket.on("message-response", data => {
            navigate(`/chat?room=${room}`);
        })
        return () => {
            socket.off("message-response")
        }   
    }, [socket])

    //output
    function render(messagesData) {
        const elements = messagesData.map(data => 
            <div>
                <p>{data.text}</p>
                <p>{data.dateAdded}</p>
            </div>
        ) 
        return (
           <div>
                {elements ? elements : null}
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
