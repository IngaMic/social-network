import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Online() {

    const onlineUsers = useSelector((state) => state && state.onlineUsers);

    useEffect(() => {
        // console.log("Onlineusers hooks component mounted");
    }, [onlineUsers]); //array has to have onlineUsers in it
    if (!onlineUsers) {
        return null;
    } else {
        return (
            <div id="online-users">
                <h3 className="online-greet">Online:</h3>
                {!onlineUsers.length && <h5>No users online!</h5>}
                {!!onlineUsers.length &&
                    <div id="online-users-container" >
                        {onlineUsers.map((onlineUser, i) => (
                            <div className="online-user" key={i}>
                                <img className="online-users-img" src={onlineUser.imageurl ||
                                    "https://image.flaticon.com/icons/svg/1338/1338020.svg"} />
                                <p>{onlineUser.first}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>
        );
    }
}