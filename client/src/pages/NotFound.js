import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="not-found-page--container">
            <h1 className="not-found-page--heading">Sorry but page was not found.</h1>
            <Link to={"/"} className="not-found-page--back-text">Back to home page</Link>
        </div>
    )
}