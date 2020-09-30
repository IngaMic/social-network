import React, { useState, useEffect } from "react";
import axios from "axios";

//first log your props from OtherProfile, to get an id

export default function FriendButton({
    logUserId,
    otherId,
    // message = "",
    // clickHandler, //in props or local?
}) {
    //need to make a post req to the server
    //the route depends on what the button says = heaps of if - else conditionals

    console.log(
        "props that we get from OtherProfile in FriendButton ",
        logUserId,
        otherId
    );

    // <div>
    //     <button onClick={clickHandler}>{this.state.message}</button>
    // </div>
}
