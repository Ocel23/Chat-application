import React from "react";
import { Await } from "react-router-dom";
import dateFormater from "../utils/dateFormater";

export default function Statictics({statistics}) {

    //render
    function render(statistics) {
        const elements = statistics.map(statistic => 
            <div className="dashboard-statistics-data--container">
                <p className="dashboard-statistics--data">Online conversations: <span id="dashboard-statistics--data">{statistic.onlineConversations}</span></p>
                <p className="dashboard-statistics--data">Today conversations: <span id="dashboard-statistics--data">{statistic.todayConversations}</span></p>
                <p className="dashboard-statistics--data">Count of created conversations: <span id="dashboard-statistics--data">{statistic.countOfCreatedConversations}</span></p>
                <p className="dashboard-statistics--data">Date of last created conversations: </p>
                <p className="dashboard-statistics--data">{dateFormater(statistic.dateOfLastCreatedConversation)}</p>
            </div>
        )
        return (
            <>
                {statistics.length === 0 ? "No statistics could be found." : elements}
            </>
        )
    }

    //output
    return (
        <div className="dashboard-statistics--container">
            <h1 className="dashboard-statistics--heading">Statictics</h1>
            <React.Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={statistics}>
                        {render}
                    </Await>
            </React.Suspense>
        </div>
    )
}