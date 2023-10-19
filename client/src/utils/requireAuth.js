import { apiGet, requestError } from "./api";
import { redirect } from "react-router-dom";
import showServerError from "./showServerError";
import withReactContent from 'sweetalert2-react-content'
import Swal from "sweetalert2";

export default async function requireAuth() {
    try {
        //nodejs api address
        const API_URL = process.env.REACT_APP_NODEJS_ADDRESS;
        //get user data
        await apiGet(`${API_URL}/user/login`);
        
    } catch(err) {
        //if not login than redirect do /
        if (err instanceof requestError && err.response.status === 401) {
            const MySwall = withReactContent(Swal);
            MySwall.fire({
                icon: "warning",
                title: "Hey!",
                text: "You are not authorized to do this",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            })
            throw redirect("/");
        } else {
            return showServerError(await err.message);
        }
    }
}