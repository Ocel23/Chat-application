import React from "react";
import { useRouteError } from "react-router-dom"

export default function Error(){

    const error = useRouteError();

    return (
        <div className="request-error--container">
            <h3 className="request-error--message">{error.message}</h3>
            <h5 className="request-error-contact">Please contact our support if you hope that is the error on our side.</h5>
        </div>
    )
}