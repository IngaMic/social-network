import axios from "./axios";
import { myActionCreator } from "./actions"
//ACTION IS JUST AN OBJECT!!

export async function receiveFriends() {
    const { data } = await axios.get('/friends.json');
    return {
        type: 'RECEIVE_FRIENDS',
        users: data.users
    };
}

////////////////////////////////////////////////
// add functions :  acceptFriendReq, endFriendship



// export function myActionCreator(bio) {
// //if we want anything async, we do it here:
// const data = await Axios.post("/update-bio", {bio})

//     return {
//         //going to tell a reducer which if statement to use
//         type: "CHANGE_BIO",
//         // 
//         bio: bio,
//     };
// }
// export function myActionCreator(bio) {
//     return {
//         //going to tell a reducer which if statement to use
//         type: "CHANGE_IMAGE_URL",
//         //
//         imageUrl: imageUrl,
//     };
// }
