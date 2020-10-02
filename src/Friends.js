import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends } from './actions'; //and more :
// acceptFriendReq, endFriendship

export default function FriendsWannabes() {
    const dispatch = useDispatch();
    const users = useSelector(
        state => state.users
        //  && state.users.filter(
        //     user => user.accepted == null
        // )
    );

    useEffect(
        () => {
            dispatch(
                receiveFriends()
            );
        },
        []
    )

    if (!users) {
        return null;
    }

    return (
        <div>
            <h1>Friends</h1>
            { users && friends.map()}
            <h1>Wannabes</h1>
            { users && wannabes.map()}
        </div>
    )

}