import React from "react";
import axios from "./axios";
import { Route } from "react-router-dom";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        //match.params
        this.state = {
            first: "",
            last: "",
            bio: "",
            imageUrl: "",
            userId: null,
            error: false,
        };
    }
    //this.props.match.params.id
    componentDidMount() {
        const id = this.props.match.params.id;
        if (this.props.match.params.id == this.props.logUserId) {
            this.props.history.push("/");
        }
        // console.log("this.props.logUserId :",this.props.logUserId);
        console.log(" id from OtherProfile :", id);
        axios
            .get(`/user/${id}.json`)
            .then(({ data }) => {
                console.log(" resp after axios in OtherProfile", data);
                //console.log("this.props.logUserId :", this.props.logUserId);
                this.setState(data);
            })
            .catch((err) => {
                console.log("err in get user/id", err);
                this.setState({ error: true });
            });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <h4 className="err">Something Went Wrong!</h4>
                )}
                {this.state.userId && (
                    <div>
                        <img
                            id="big-profile-img"
                            src={
                                this.state.imageUrl ||
                                "https://image.flaticon.com/icons/svg/1338/1338020.svg"
                            }
                            alt=""
                            width="200"
                            height="250"
                        ></img>
                        <h4 id="name-surname">
                            {this.state.first} _ {this.state.last}
                        </h4>
                        <p id="bio">{this.state.bio || "No bio added"}</p>
                    </div>
                )}

                {this.state.userId && (
                    <FriendButton
                        logUserId={this.props.logUserId}
                        otherId={this.state.userId}
                        // clickHandler={this.state.clickHandler}
                    />
                )}
            </div>
            //write some code, that prevents the user to go see his own id /user/"id"
            // this.props.history.push('/');
        );
    }
}
