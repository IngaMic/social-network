
export default function (state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    console.log("Action :", action)
    if (action.type == 'ADD_FRIEND') {
        console.log("A WORD")
        state = {
            ...state,
            users: state.users.map((user) => {
                console.log("action.id", action.id);
                console.log("user.id", user.id);
                if (action.id == user.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        }
    }
    if (action.type == 'REMOVE_FRIEND') {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (action.id == user.id) {
                    return {
                        ...user,
                        accepted: null,
                    };
                } else {
                    return user;
                }
            }),
        }
    }
    return state;
}

// function reducer(state = {}, action) {
//     if ((action.type = "CHANGE_BIO")) {
//         state = {
//             ...state,
//             otherUser: {
//                 ...state.otherUser,
//                 bio: action.bio,
//             },
//         };
//     }
//     if ((action.type = "CHANGE_IMAGE_URL")) {
//         //state change will happen here
//     }

//     return state;
// }

// //////////////////////////////////NOTES/////////BioEditor
// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { myActionCreator } from "./actions";

// export default function BioEditor() {
//     //this is how we "read" from the state.
//     const bio = userSelector((state) => state.user.bio);

//     //inside the useDispatch we need to give an action (actions.js)
//     return (
//         <div onClick={() => useDispatch(myActionCreator(bio))}>
//             I am the BioEditor: {bio}
//         </div>
//     );
// }
