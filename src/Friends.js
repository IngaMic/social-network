import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { receiveFriends, acceptFriendReq, endFriendship } from './actions';

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
        [friends, wannabes]
    )

    if (!users) {
        return null;
    } else {
        var friends = users.filter(function (user) {
            return user.accepted == true;
        });
        console.log("friends from users", friends)
        var wannabes = users.filter(function (user) {
            return user.accepted == false;

        });
        console.log("wannabes from users", wannabes);
    }
    friends = (
        <div id="friendslist">
            <h3>Your friends:</h3>
            {friends.map((friend, i) => (
                <div className="friend" key={i}>
                    <img className="friends-img" src={friend.imageurl ||
                        "https://image.flaticon.com/icons/svg/1338/1338020.svg"} />
                    <button onClick={() => { dispatch(endFriendship(friend.id)) }}>End Friendship</button>

                </div>
            ))}
        </div>
    )
    wannabes = (
        <div id="wannabeslist">
            <h3>They want to be your friends:</h3>
            {wannabes.map((wannabe, j) => (
                <div className="wannabe" key={j}>
                    <img className="friends-img" src={wannabe.imageurl ||
                        "https://image.flaticon.com/icons/svg/1338/1338020.svg"} />
                    <button onClick={() => { dispatch(acceptFriendReq(wannabe.id)) }}>Accept Friend</button>
                </div>
            ))}
        </div>
    )
    return (
        <div>
            <div id="friends">
                {!users.length && <h5>No Friends Yet!</h5>}
                {!!users.length && friends}
            </div>
            <div id="wannabes">
                {!users.length && <h5>List is empty</h5>}
                {!!users.length && wannabes}
            </div>

            {/* <h1>Friends:</h1>
            { users && friends.map()}
            <h1>Wannabes:</h1>
            { users && wannabes.map()} */}
        </div>
    )

}