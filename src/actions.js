import Axios from "axios";
import BioEditor from "./reducers";
import {myActionCreator}  from "./actions"
//ACTION IS JUST AN OBJECT!!

export function myActionCreator(bio) {
//if we want anything async, we do it here:
const data = await Axios.post("/update-bio", {bio})

    return {
        //going to tell a reducer which if statement to use
        type: "CHANGE_BIO",
        // 
        bio: bio,
    };
}
export function myActionCreator(bio) {
    return {
        //going to tell a reducer which if statement to use
        type: "CHANGE_IMAGE_URL",
        //
        imageUrl: imageUrl,
    };
}
