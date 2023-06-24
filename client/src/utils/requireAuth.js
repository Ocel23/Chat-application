import { apiGet, requestError } from "./api";
import { redirect } from "react-router-dom";

export default async function requireAuth() {
    try {
        const userData = await apiGet("http://localhost:5000/user/login");
    } catch(err) {
        if (err instanceof requestError && err.response.status === 401) {
            throw redirect("/");
        } else {
            throw err;
        }
    }
}