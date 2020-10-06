import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);
    console.log(" Chat.js - here is a list of my last chatMessages :", chatMessages);

    useEffect(() => {
        // console.log("Chat hooks component mounted");
        // console.log("elemRef is :", elemRef);
        // console.log("scrollTop", elemRef.current.scrollTop);
        // console.log("clientHeight", elemRef.current.clientHeight);
        // console.log("scrollHeight", elemRef.current.scrollHeight);

        //scrollTop must be equal scrollHeight - clientHeight
        if (chatMessages) { elemRef.current.scrollTop = elemRef.current.scrollHeight - elemRef.current.clientHeight; }

    }, []); //array has to have newMsg in it
    const keyCheck = e => {
        // console.log(" value : ", e.target.value);
        // console.log("key pressed  :", e.key);

        if (e.key === "Enter") {
            e.preventDefault();
            console.log("our msg after key is pressed:", e.target.value);
            socket.emit("message", e.target.value);
            e.target.value = "";
        }
    }
    if (!chatMessages) {
        return null;
    } else {
        return (
            <div>
                <p className="chat-title"> Welcome to Chat!</p>
                <div id="messages">
                    {!chatMessages.length && <h5>No Messages Yet!</h5>}
                    {!!chatMessages.length &&
                        <div id="messages-container">
                            {chatMessages.map((message, i) => (
                                <div className="message" key={i}>
                                    <img className="messagers-img" src={message.imageurl ||
                                        "https://image.flaticon.com/icons/svg/1338/1338020.svg"} />
                                    <p>{message.first} _ {message.last}</p>
                                    <p>{message.message}</p>

                                </div>
                            ))}
                        </div>
                    }
                </div>

                <textarea placeholder="Add Your Message Here!" onKeyDown={keyCheck}></textarea>
            </div>
        );
    }
}