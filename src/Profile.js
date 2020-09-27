import React from "react";
import axios from "./axios";
import ProfilePic from "./ProfilePic";
import Bioeditor from "./Bioeditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            bio: "",
            imageUrl: "",
            file: "",
            userId: null,
            clickHandler: null,
            bioEditIsVisible: false,
            error: false,
        };
    }
    componentDidMount() {
        this.setState({
            userId: this.props.userId,
            first: this.props.first,
            last: this.props.last,
            bio: this.props.bio,
            imageUrl: this.props.imageUrl,
            clickHandler: this.props.clickHandler,
        }),
            console.log(
                "These must be the props that we get from App to Profile",
                this.props
            );
    }
    render() {
        return (
            <div>
                {this.state.userId && (
                    <ProfilePic
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        clickHandler={this.state.clickHandler}
                    />
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
                        <p id="bio">{this.state.bio || "Your bio is empty"}</p>
                        {!this.state.BioEditIsVisible && (
                            <div id="edit-bio">
                                <button
                                    onClick={() =>
                                        this.setState({
                                            BioEditIsVisible: true,
                                        })
                                    }
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    {this.state.error && (
                        <h4 className="err">Something Went Wrong!</h4>
                    )}
                </div>
                <div>
                    {this.state.BioEditIsVisible && (
                        <Bioeditor
                            bio={this.state.bio}
                            userId={this.state.userId}
                            setBio={(text) => {
                                this.setState({ bio: text });
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }
}
