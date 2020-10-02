import axios from "./axios";
//ACTION IS JUST AN OBJECT!!

export async function receiveFriends() {
    const { data } = await axios.get('/api/friends');
    console.log("data.users from actions.js", data)
    return {
        type: 'RECEIVE_FRIENDS',
        users: data.users
    };
}
export async function acceptFriendReq(otherId) {
    console.log("other id before updaring to friends in actions.js", otherId) //works
    const { data } = await axios.post(`/api/accept-friend-request/${otherId}`);
    console.log("data from actions.js addFriendReq", data)
    return {
        type: 'ADD_FRIEND',
        id: otherId,
    };
}
export async function endFriendship(otherId) {
    console.log("other id before endingFriendship in actions.js", otherId) //works
    const { data } = await axios.post(`/api/end-friendship/${otherId}`);
    console.log("data from actions.js removeFriend", data)
    return {
        type: 'REMOVE_FRIEND',
        id: otherId,
    };
}


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
