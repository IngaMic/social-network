import React from "react";
import axios from "./axios";
// import { Route } from "react-router-dom";

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
        };
    }
    //this.props.match.params.id
    componentDidMount() {
        if (this.props.match.params.id == this.props.logUserId) {
            this.props.history.push("/");
        }
        // console.log("this.props.logUserId :",this.props.logUserId);
        const id = this.props.match.params.id;
        console.log(" id from OtherProfile :", id);
        axios.get(`/user/${id}.json`).then((resp) => {
            console.log(" resp after axios in OtherProfile", resp);
            this.setState({
                userId: resp.data.userId,
                first: resp.data.first,
                last: resp.data.last,
                bio: resp.data.bio,
                imageUrl: resp.data.imageUrl,
            }),
                console.log(
                    "this.state in OtherProfile after axios done:",
                    this.state
                );
        });
    }
    render() {
        return (
            <div>
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
            </div>
            //write some code, that prevents the user to go see his own id /user/"id"
            // this.props.history.push('/');
        );
    }
}
