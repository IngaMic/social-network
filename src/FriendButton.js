import React, { useState, useEffect } from "react";
import axios from "./axios";

//first log your props from OtherProfile, to get an id
const FriendButton = ({ logUserId, otherId }) => {
    const [text, setText] = useState("");
    //need to make a post req to the server
    //the route depends on what the button says = heaps of if - else conditionals
    const clickHandler = async (e) => {
        console.log("otherId : ", otherId);
        try {
            e.preventDefault();
            if (text == "Send Friend Request") {
                const resp = await axios.post(
                    `/api/send-friend-request/${otherId}`,
                    {
                        otherId: otherId,
                    }
                );
                console.log("resp.data :", resp.data);
                setText(resp.data.text);
            } else if (text == "Accept Friend Request") {
                const resp = await axios.post(
                    `/api/accept-friend-request/${otherId}`,
                    {
                        otherId: otherId,
                    }
                );
                console.log("resp.data :", resp.data);
                setText(resp.data.text);
            } else if (text == "End Friendship") {
                const resp = await axios.post(
                    `/api/end-friendship/${otherId}`,
                    {
                        otherId: otherId,
                    }
                );
                console.log("resp.data in end Friendship :", resp.data);
                setText(resp.data.text);
            }
        } catch (err) {
            console.log("err : ", err);
        }
    };
    useEffect(() => {
        (async () => {
            try {
                const resp = await axios.get(
                    `/initial-friendship-status/${otherId}`
                );
                // console.log("resp.data :", resp.data);
                setText(resp.data.text);
            } catch (err) {
                console.log("err : ", err);
            }
        })();
    }, [text]);

    return (
        <div>
            <button className="frnd-btn" onClick={clickHandler}>{text}</button>
        </div>
    );
};

export default FriendButton;
