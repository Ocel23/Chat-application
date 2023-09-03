import React, { useEffect, useState, useRef } from "react";
import { defer, redirect, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { apiPost, apiDelete, apiGet , requestError, apiPut } from "../utils/api";
import io from "socket.io-client";
import Header from "../components/Header"
import dateFormater from "../utils/dateFormater";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import MessageTemplate from "../components/MessagesTemplates";
import ChatMessages from "../components/ChatMessages";
import ChatForm from "../components/ChatForm";
import AppIcon from "../components/AppIcon";
import showServerError from "../utils/showServerError";
import { config } from "../config";

export async function loader({ request}) {

    //nodejs api address
    const API_URL = process.env.REACT_APP_NODEJS_ADDRESS;
    //get id of room from query
    const room = new URL(request.url).searchParams.get("room");
    //get online users for count, if nobody is online then redirect to email page
    await apiGet(`${API_URL}/users/online`).catch(() => {throw redirect("/email")});
    //get count of connected user to select room
    const countOfConnectUsers = await apiGet(`${API_URL}/api/conversations/${room}`);
    if (countOfConnectUsers == null) {
        //create conversation
        await apiPost(`${API_URL}/api/conversations`, {
            id_of_room: room,
            users: 1
        });
        const statistics = await apiGet(`${API_URL}/statistics`);   
        await apiPut(`${API_URL}/statistics`, {
            countOfCreatedConversations: statistics[0].countOfCreatedConversations + 1,
            dateOfLastCreatedConversation: Date.now(),
            todayConversations: statistics[0].todayConversations + 1,
            onlineConversations: statistics[0].onlineConversations + 1,
        });     
    }
    //handle admins counts in conversation
    if (countOfConnectUsers !== null && countOfConnectUsers === 2) {
        return redirect("/dashboard");
    }
    //change count by one
    if (countOfConnectUsers !== null) {
        apiPut(`${API_URL}/api/conversations/${room}`, {users: countOfConnectUsers.users + 1});  
    }
    //get messages from conversation by id
    const data = await apiGet(`${API_URL}/api/conversationMessages/${room}`);
    return defer({messages: data});
}

export default function ChatPage() {

    //state for check if user is admin
    const [isAdmin, setIsAdmin] = useState(false);
    //get id of room from query
    const [searchParams, setSearchParams] = useSearchParams()
    const room = searchParams.get("room");
    //nodejs api address
    const API_URL = process.env.REACT_APP_NODEJS_ADDRESS;
    //navigate hook
    const navigate = useNavigate();
    //messages data from loader
    const messagesData = useLoaderData();
    //messages state
    const [messages, setMessages] = useState([]);
    //socket instance
    const [socket, setSocket] = useState();
    //my swall library
    const MySwall = withReactContent(Swal);
    //state for show template
    const [showTemplate, setShowTemlate] = useState(false);
    //message state input
    const [messageInput, setMessageInput] = useState("");
    //chat app state
    const [chatAppState, setChatAppState] = useState(false);
    //hook for focus on input
    const inputRef = useRef(null);
    //resize state
    const [resize, setResize] = useState(false);

    //function for handle appState
    function handleChatAppState(value) {
        setChatAppState(value);
    }

    //function for log-in user
    async function logIn() {
        //get user info
        try {
            await apiGet(`${API_URL}/user/login`);
            window.addEventListener("beforeunload", changeUserCountOnLeave)
            return setIsAdmin(true);
        } catch(err) {
            if (err instanceof requestError && err.response.status === 401) {
                window.addEventListener("beforeunload", changeCountOfOnlineConversations)
                window.addEventListener("beforeunload", deleteRoom);
                window.addEventListener("beforeunload", deleteAllMessages); 
                return setIsAdmin(false);
            } else {
                return showServerError(await err.message);
            }
        }
    }


    //function for change count of online conversations
    async function changeCountOfOnlineConversations() {
        try {
            const statistics = await apiGet(`${API_URL}/statistics`);  
            await apiPut(`${API_URL}/statistics`, {
                onlineConversations: statistics[0].onlineConversations - 1,
            })
        } catch(err) {
            if (err instanceof requestError) {
                return showServerError(await err.response.text());
            } else {
                return showServerError(await err.message);
            }
        }
    }
    
    //function for delete room
    async function deleteRoom() {
        await apiDelete(`${API_URL}/api/conversations/${room}`).catch((err) => {throw err});
    }

    //function for delete all messages in conversation
    async function deleteAllMessages() {
        await apiDelete(`${API_URL}/api/conversationMessages/${room}`).catch((err) => {throw err})
    }

    //function change user count by -1
    async function changeUserCountOnLeave() {
        await apiPut(`${API_URL}/api/conversations/${room}`, {users: 1});  
    }

    //fucntion for remove conversation by admin
    const cancelConversation = () => {
        changeCountOfOnlineConversations();
        deleteRoom();
        deleteAllMessages();
        socket.emit("cancel-conversation", {
            text: "Conversation was closed by admin.",
        });
    }

    //function for show messages templates
    const showTemplates = () => {
        setShowTemlate(prevValue => !prevValue);
    }

    //function for handle input state
    function handleInput(value) {
        setMessageInput(value);
    }

    //fucntion for handle show template state
    function handleShowTemplate(value) {
        setShowTemlate(value);
    }

    useEffect(() => {
        //fucntion for check loggin
        logIn();
        //socket client connect
        const newSocket = io(`${API_URL}/chat`, {
            query: {
                roomID: room
            }
        })
        setSocket(newSocket);
        //delete room and messages on leave chat
        return () => {
            //remove event listeners
            if (!isAdmin) {
                window.removeEventListener("beforeunload", changeCountOfOnlineConversations)
                window.removeEventListener("beforeunload", deleteRoom);
                window.removeEventListener("beforeunload", deleteAllMessages) 
            } else if (isAdmin) {
                window.removeEventListener("beforeunload", changeUserCountOnLeave);
            }
            newSocket.close()  
        }
    }, [])


    //events for send messages between socket client and server
    useEffect(() => {
        if (socket == null) return;
        socket.on("message-response", data => {
            setMessages(previesArray => [...previesArray, {
                text: data.text,
                dateAdded: dateFormater(),
                senderIsAdmin: data.senderIsAdmin
            }])
        })
        socket.on("cancel-conversation", message => {
            async function checkAdmin() {
                try {
                    await apiGet(`${API_URL}/user/login`);
                    MySwall.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'The conversation was successfully deleted.',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    setTimeout(() => {
                        return window.close();
                    }, 3000);
                } catch(err) {
                    if (err instanceof requestError && err.response.status === 401) {
                        MySwall.fire({
                            position: 'center',
                            icon: "error",
                            title: 'The conversation was canceled by admin.',
                        })
                        return navigate("/");
                    } else {
                        return showServerError(await err.message);
                    }
                }
            }
            checkAdmin();
        })

        //socket erros
        socket.on("connect_failed", err => {
            showServerError("Connection failed.");
            throw err;
        })

        socket.on("error", err => {
            showServerError("It was an error on server side.");;
            throw err;
        })

        socket.on("reconnect_failed", err => {
            showServerError("Reconnection failed.");
            throw err;
        })

        return () => {
            socket.off("message-response");
        }   
    }, [socket])

    //fucntion for handle focus on enter
    function handleFocus() {
        inputRef.current.focus()
    }

    //handle resize
    function handleResize(value) {
        setResize(value);
    }

    //resize container
    let style;
    if(resize && window.innerWidth >= 1200) {
        style = {
            width: "750px",
            height: "90%"
        }
    }
    
    return (
        <>
            <AppIcon handleChatAppState={handleChatAppState}/>
            <div className={!chatAppState ? "chat-page-container--show" : "chat-page-container--hide"} style={style}>
                <Header heading={config.chatPage.title} handleChatAppState={handleChatAppState} logo={false} description={true} handleResize={handleResize}/>
                <MessageTemplate showTemplate={showTemplate} handleInput={handleInput} handleShowTemplate={handleShowTemplate} handleFocus={handleFocus}/>
                <ChatMessages messagesData={messagesData}  messages={messages} isAdmin={isAdmin}/>
                <ChatForm isAdmin={isAdmin} messageInput={messageInput} socket={socket} handleInput={handleInput} room={room} cancelConversation={cancelConversation} showTemplates={showTemplates} inputRef={inputRef}/>
            </div>    
        </>
        
        
    )
}
