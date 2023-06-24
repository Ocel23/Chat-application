import React, { useEffect } from "react";
import { apiGet } from "../utils/api";
import { defer, Await, useLoaderData, useNavigate, useLocation} from "react-router-dom";
import requireAuth from "../utils/requireAuth";
import { setOffline, setOnline } from "../utils/status";

export async function loader() {
    try {
        const loginUser = await requireAuth();
        const online = await setOnline();
    } catch(err) {
        throw err;
    }
    const data =  await apiGet("http://localhost:5000/api/conversations");    
    return defer({convesations : data});
}

export default function Dashboard() {
    const location = useLocation();
    const convesations = useLoaderData();
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("beforeunload", setOffline)
        return () => window.removeEventListener("beforeunload", setOffline);
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