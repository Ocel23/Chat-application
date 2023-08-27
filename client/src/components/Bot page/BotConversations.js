import React, { useState } from "react";
import BotQuestions from "./BotQuestions";
import BotAnswer from "./BotAnswer";
import BotMessageRepeat from "./BotRepeatQuestion";

export default function BotConversation({messages, addMessage, handleMessages, messagesLenght}) {
    
    //function for loading answers
    const [loadingAnswerState, setLoadingAnswerState] = useState(true);
    //function for loading repeat answer
    const [loadingRepeatQuestionState, setLoadingRepeatQuestionState] = useState(true);

    //function for loading answers
    function loadingAnswer() {
        setTimeout(() => {
            setLoadingAnswerState(false)
            loadingRepeatQuestion();
        }, 3000);
    }

    //function for loadingReapeatQuestion
    function loadingRepeatQuestion() {
        setTimeout(() => {
            setLoadingRepeatQuestionState(false);
        }, 3000);
    }

    return (
        <div className="bot-page-messages--container">
            <BotQuestions messages={messages} addMessage={addMessage} loadingAnswer={loadingAnswer} handleMessages={handleMessages} messagesLenght={messagesLenght}/>
            {messages.map(message => 
                <BotAnswer message={message} loadingAnswerState={loadingAnswerState}/> 
            )}
            <BotMessageRepeat addMessage={addMessage} loadingRepeatQuestionState={loadingRepeatQuestionState} loadingAnswerState={loadingAnswerState}/>
        </div>
    )
}