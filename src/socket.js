import * as io from 'socket.io-client';
import { chatMessages, chatMessage, onlineUsers, userLeft } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on(
            'chatMessages',
            msgs => {
                store.dispatch(
                    chatMessages(msgs)
                )
                //console.log("msgs that we get in socket.js from index.js", msgs)
            }
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessage(msg)
            )
        );

        socket.on(
            'onlineusers',
            usersOnline => store.dispatch(
                onlineUsers(usersOnline)
            )
        );
        socket.on(
            'userleft',
            usersOnline => store.dispatch(
                userLeft(usersOnline)
            )
        );


        // socket.on("addChatMessage", msg => {
        //     console.log(`my message is : ${msg
        //         }`)
        // })
    }
};