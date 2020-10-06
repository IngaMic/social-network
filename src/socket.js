import * as io from 'socket.io-client';
import { chatMessages } from './actions'; //, chatMessage 

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
                console.log("msgs that we get in socket.js from index.js", msgs)
            }
        );

        //     socket.on(
        //         'chatMessage',
        //         msg => store.dispatch(
        //             chatMessage(msg)
        //         )
        //     );

        socket.on("addChatMessage", msg => {
            console.log(`my message is : ${msg
                }`)
        })
    }
};