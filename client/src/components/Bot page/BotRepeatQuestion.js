import React, { useState } from "react";
import BotIcon from "../../images/icon.png";
import BotEndMessage from "./BotEndMessage";
import Loader from "./Loader";
import { config } from "../../config";

export default function BotMessageRepeat({addMessage, loadingRepeatQuestionState, loadingAnswerState}) {

    //active state for yes option
    const [isYesActive, setIsYesActive] = useState(false);
    //active state for no option
    const [isNoActive, setIsNoActive] = useState(false);
    //loading state
    const [loading, setLoading] = useState(false);

    //function for handle yes option
    const handleYesOption = () => {
        if (isYesActive || isNoActive) return;
        addMessage();
        setIsYesActive(true);
    }

    //function for handle no option
    const handleNoOption = () => {
        if (isYesActive || isNoActive) return;
        setIsNoActive(true);
        loadingEndMessage();
    }
        
    //function for loading end message
    function loadingEndMessage() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }
    return (
        <>
            {loadingRepeatQuestionState && !loadingAnswerState ? <Loader side="left" first={false} /> : null}
            {!loadingRepeatQuestionState && !loadingAnswerState ?
            <div className="bot-another-option--container">
                <img src={BotIcon} alt="bot icon" className="bot-icon--question option-icon"></img>    
                <p className="bot--question accent option">{config.botPage.repeatQuestionText}</p>
                <div className={isYesActive ? "options m-48" : "options"}>
                        <button type="button" onClick={handleYesOption} className={isYesActive ? "bot-option--answer option-yes active-option" : "bot-option--answer option-yes"}>{config.botPage.repeatQuestionYesText}</button>
                        <button type="button" onClick={handleNoOption} className={isNoActive ? "bot-option--answer option-no active-option" : "bot-option--answer option-no"}>{config.botPage.repeatQuestionNoText}</button>    
                </div>  
            </div>
            : null}
            <BotEndMessage loading={loading} isNoActive={isNoActive}/>
        </>
    )
}