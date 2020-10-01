function reducer(state = {}, action) {
    if ((action.type = "CHANGE_BIO")) {
        state = {
            ...state,
            otherUser: {
                ...state.otherUser,
                bio: action.bio,
            },
        };
    }
    if ((action.type = "CHANGE_IMAGE_URL")) {
        //state change will happen here
    }

    return state;
}

//////////////////////////////////NOTES/////////BioEditor
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { myActionCreator } from "./actions";

export default function BioEditor() {
    //this is how we "read" from the state.
    const bio = userSelector((state) => state.user.bio);

    //inside the useDispatch we need to give an action (actions.js)
    return (
        <div onClick={() => useDispatch(myActionCreator(bio))}>
            I am the BioEditor: {bio}
        </div>
    );
}
