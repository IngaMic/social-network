import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function ProfilePic({
    userId,
    imageUrl,
    first,
    last,
    clickHandler,
}) {
    return (
        <div id="small-profile-img" onClick={clickHandler}>
            <img
                src={
                    imageUrl ||
                    "https://image.flaticon.com/icons/svg/1338/1338020.svg"
                }
                width="100"
                height="150"
                alt={`$${first} ${last}`}
            />
        </div>
    );
}
