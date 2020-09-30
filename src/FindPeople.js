//must be a function component
//new Route in BrowserRounter
// /users might be a good name for this route
//when it mounts make axios to get 3 newest users : query posted on notes
//whenever the search happens, hide the latest users and render search users

//////////////////////Pattern Matching in psql = code in part7 ILIKE for db.js

import React, { useState, useEffect } from "react";
import axios from "./axios";

const FindPeople = () => {
    const [userInput, setUserInput] = useState("");
    const [users, setUsers] = useState([]);
    useEffect(() => {
        //console.log("useEffect is running!");//runs when the component mounts
        (async () => {
            try {
                console.log("userInput", userInput);
                const resp = await axios.get("/api/users", {
                    params: { userInput: userInput },
                });
                console.log("resp.data :", resp.data.users);
                setUsers(resp.data.users);
            } catch (err) {
                console.log("err : ", err);
            }
        })();
    }, [userInput]); //if we pass an empty [] as a 2ns arg - use effect will run only when the component mounts and never again

    console.log("users : ", users);
    function handleChange(e) {
        //console.log("e.target.value : ", e.target.value);
        setUserInput(e.target.value);
    }
    // if (users.length == 0) {
    //     return <h2>No results</h2>;
    // } else {

    return (
        <div>
            <input
                onChange={handleChange}
                type="text"
                name="userInput"
                placeholder="type here"
            />
            <h1>Users:</h1>
            {users.map((user, i) => {
                return (
                    <div key={i}>
                        <img
                            id="search-img"
                            src={
                                user.imageurl ||
                                "https://image.flaticon.com/icons/svg/1338/1338020.svg"
                            }
                            alt="{user.first} {user.last}"
                            width="200"
                            height="250"
                        ></img>
                        <p>
                            {user.first}_{user.last}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default FindPeople;
