import React, { useState } from "react";
import {nanoid} from "nanoid";
import BotConversation from "../components/Bot page/BotConversations";
import Header from "../components/Header";
import AppIcon from "../components/AppIcon";
import { config } from "../config";

export default function BotPage() {

    //state for handle state of app show/hide
    const [botAppState, setBotAppState] = useState(false);
    //resize state
    const [resize, setResize] = useState(false);

    //function for handle appState
    function handleBotAppState(value) {
        setBotAppState(value);
    }

    //data from config
    const data = config.botPage.questionsWithAnswers;
    
    
    //messages with created properties
    const [messages, setMessages] = useState(createAnswers());

    //length of messages array
    const messagesLenght = messages.length - 1;

     //function for create messages
     function createAnswers() {
        const array = [];
        data.forEach(item => {
            const propersties = [];
            for (let property in item) {
                propersties.push({
                    id: nanoid(),
                    isActive: false,
                    question: property,
                    answer: item[property]
                });
            }
            array.push(propersties);
        })
        return array;
    }

     
    //function for create another message
    function addMessage() {
        setMessages([...messages, ...createAnswers()])
    }

     //function for handle Messages state
     function handleMessages(newArray, index) {
        const replaceArray = [...messages];
        replaceArray[index] = newArray;
        setMessages(replaceArray);
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

    //output
    return (
        <>
            <AppIcon handleBotAppState={handleBotAppState} />
            <div className={botAppState ? "bot-page-container--show" : "bot-page-container--hide"} style={style}>
                <Header heading={config.botPage.title} handleBotAppState={handleBotAppState} logo={true} description={false} handleResize={handleResize}/>
                <div className="bot-conversations--container">
                    {messages.map(messages => 
                        <BotConversation messages={messages} addMessage={addMessage} handleMessages={handleMessages} messagesLenght={messagesLenght}/>    
                    )}    
                </div>
                
            </div>    
        </>
        
    )
}