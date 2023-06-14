import React from "react";
import { Form } from "react-router-dom";
export default function LoginPage() {
    return (
        <div>
            <Form method="post">
                <label>Zadej email:</label>
                <input type="email"></input>
                <label>Zadej heslo:</label>
                <input type="password"></input>
                <button>Přihlásit</button>
            </Form>
        </div>
    )
}