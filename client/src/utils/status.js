import { apiGet, apiPut } from "./api";

export async function setOnline() {
    try {
        const userData = await apiGet("http://localhost:5000/user/login");
        const statusOfUser = await apiPut(`http://localhost:5000/users/online/${userData._id}`, {isOnline: true})
    } catch(err) {
        throw err;
    }
}

export async function setOffline() {
    try {
        const userData = await apiGet("http://localhost:5000/user/login");
        const statusOfUser = await apiPut(`http://localhost:5000/users/online/${userData._id}`, {isOnline: false})
    } catch(err) {
        throw err;
    }
}