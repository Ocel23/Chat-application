import React, { useEffect } from "react";
import { apiGet, apiPut } from "../utils/api";
import { defer, Await, useLoaderData, useNavigate} from "react-router-dom";
import requireAuth from "../utils/requireAuth";

export async function loader() {
    const loginUser = await requireAuth();
    const data = apiGet("http://localhost:5000/api/conversations");
    return defer({convesations : data});
}

export default function Dashboard() {
    
    const convesations = useLoaderData();
    const navigate = useNavigate();
    //dodělat useState
 
    useEffect(() => {
        window.addEventListener("beforeunload", () => {
            async function setOnline() {
                try {
                    const userData = await apiGet("http://localhost:5000/user/login");
                    const statusOfUser = apiPut(`http://localhost:5000/users/online/${userData._id}`, {isOnline: true})
                } catch(err) {
                    throw err;
                }
            }
            setOnline();
        })

        return () => {
            window.removeEventListener("beforeunload", () => {
                async function setOffline() {
                    try {
                        const userData = await apiGet("http://localhost:5000/user/login");
                        const statusOfUser = apiPut(`http://localhost:5000/users/online/${userData._id}`, {isOnline: false})
                    } catch(err) {
                        throw err;
                    }
                }
                setOffline();
            })
        }
    }, [])
    
    function render(conversations) {
        const elements = conversations.map(item => 
            <div style={{border: "1px solid red"}} onClick={() => joinRoom(item.id_of_room)} key={item._id}>
                    <p>{item.id_of_room}</p>
                    <p>{item.dateAdded}</p>
            </div>
        )
        return (
            <div>
                {conversations.length === 0 ? "Žádné konverzace nebyly nalezeny." : elements}
            </div>
        )
    }

    function joinRoom(id) {
        navigate(`/chat?room=${id}`);
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <React.Suspense fallback={<h2>Loading...</h2>}>
                    <Await resolve={convesations.convesations}>
                        {render}
                    </Await>
            </React.Suspense>
        </div>
    )
}