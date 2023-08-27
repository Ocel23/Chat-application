 
    if (parseData === 0) {
        try {
                
                //put count of user in conversations to 2 - join admin
                async function changeCount1() {
                    await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 2})   
                }
                changeCount1();
                
        } catch(err) {
                //if not authorized, normal user
                if (err instanceof requestError && err.response.status === 401) {
                    //get data of conversation by id
                    const conversationInfo = await apiGet(`http://localhost:5000/api/conversations/${room}`);
                    //statement for check if data
                    if (conversationInfo !== null) {
                        //statement for check count of users in conversation
                        if (conversationInfo.users >= 1) {
                            return redirect("/");
                        }
                    }
                    //function for create conversation
                    async function createConversation() {
                        await apiPost("http://localhost:5000/api/conversations", {
                            id_of_room: room,
                            users: 0
                        })    
                    }
                    createConversation();
                    async function changeCount2() {
                        await apiPut(`http://localhost:5000/api/conversations/${room}`, {users: 1});
                    }
                    changeCount2();
                } else {
                    throw err;
                }    
        }
    }
    //get se count in session storage
    sessionStorage.setItem("count", "1");