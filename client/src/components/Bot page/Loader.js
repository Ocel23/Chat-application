import React from "react";
import BotIcon from "../../images/icon.png"
export default function Loader({side, first}) {
    function classDecide() {
        if (first) {
            return "loader loader-left";
        } else if (side === "left" && !first) {
            return "loader loader-left mt-48";
        } else if (side === "right" && !first){
            return "loader loader-right mt-48";
        }
    }
    return (
        <>   
            <div className={classDecide()}>
                <img src={BotIcon} alt="bot icon" className={side === "left" ? "bot-icon--question loader-icon--left" : "bot-icon--question loader-icon--right"}></img>
                <div className="loading">
                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                    <div className="circle-3"></div>    
                </div>
            </div>
        </>
    )
}