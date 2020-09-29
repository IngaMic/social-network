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
            error: false,
        };
    }
    componentDidMount() {
        this.setState({
            userId: this.props.userId,
            clickHandler: this.props.clickHandler,
        });
    }
    render() {
        return (
            <div>
                {this.props.logUserId && (
                    <ProfilePic
                        userId={this.props.userId}
                        first={this.props.first}
                        last={this.props.last}
                        imageUrl={this.props.imageUrl}
                        clickHandler={this.props.clickHandler}
                    />
                )}
                {this.props.userId && (
                    <div>
                        <img
                            id="big-profile-img"
                            src={
                                this.props.imageUrl ||
                                "https://image.flaticon.com/icons/svg/1338/1338020.svg"
                            }
                            alt=""
                            width="200"
                            height="250"
                        ></img>
                        <h4 id="name-surname">
                            {this.props.first} _ {this.props.last}
                        </h4>
                        <p id="bio">{this.props.bio || "No bio added"}</p>
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
                            setBio={this.props.setBio}
                            closeBioEditor={this.props.closeBioEditor}
                        />
                    )}
                </div>
            </div>
        );
    }
}
