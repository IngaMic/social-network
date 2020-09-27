import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
//import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
//import { HashRouter, Route } from "react-router-dom";
import Profile from "./Profile";
// import OtherProfile from "./OtherProfile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            bio: "",
            imageUrl: "",
            file: "",
            userId: null,
            uploaderIsVisible: false,
            error: false,
        };
    }
    componentDidMount() {
        axios.get("/user").then((resp) => {
            //console.log(" result from get /user in App.js : ", resp);
            this.setState({
                userId: resp.data.userId,
                first: resp.data.first,
                last: resp.data.last,
                bio: resp.data.bio,
                imageUrl: resp.data.imageUrl,
            }),
                console.log("this.state in App after axios done:", this.state); //works fine
        });
    }
    setImage(url) {
        this.setState({ imageUrl: url });
        console.log("this.state after setImage", this.state);
    }
    setBio(text) {
        this.setState({ bio: text });
    }
    closeUploader(e) {
        e.preventDefault();
        this.setState({ uploaderIsVisible: false });
    }
    render() {
        return (
            <div>
                <h3>My Logo</h3>
                {this.state.userId && (
                    <Profile
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        clickHandler={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                        setBio={(text) => {
                            this.setState({ bio: text });
                        }}
                    />
                )}
                <div>
                    {this.state.error && (
                        <h4 className="err">Something Went Wrong!</h4>
                    )}
                </div>
                <div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={(imageUrl) => {
                                this.setState({ imageUrl: imageUrl });
                            }}
                            userId={this.state.userId}
                            closeUploader={() => {
                                this.setState({ uploaderIsVisible: false });
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }
}
