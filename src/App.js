import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
//import ProfilePic from "./ProfilePic";
import Uploader from "./Uploader";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            bio: "",
            imageUrl: "",
            file: "",
            logUserId: null,
            userId: null,
            uploaderIsVisible: false,
            bioEditIsVisible: false,
            error: false,
        };
    }
    componentDidMount() {
        axios.get("/user").then((resp) => {
            //console.log(" result from get /user in App.js : ", resp);
            this.setState({
                logUserId: resp.data.userId,
                userId: resp.data.userId,
                first: resp.data.first,
                last: resp.data.last,
                bio: resp.data.bio,
                imageUrl: resp.data.imageUrl,
            }),
                console.log("this.state in App after axios done:", this.state); //works fine
        });
    }
    setImage(imageUrl) {
        this.setState({ imageUrl: imageUrl });
        console.log("this.state after setState in setImage", this.state);
    }
    setBio(text) {
        this.setState({ bio: text });
    }
    closeUploader(e) {
        e.preventDefault();
        this.setState({ uploaderIsVisible: false });
    }
    showUploader(e) {
        e.preventDefault();
        this.setState({ uploaderIsVisible: true });
    }
    closeBioEditor() {
        this.setState({ bioEditIsVisible: false });
    }
    render() {
        if (!this.state.userId) {
            return null;
        }
        return (
            <div>
                <h3>My Logo</h3>
                {/* {this.state.userId && (
                    <Profile
                        userId={this.state.userId}
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        imageUrl={this.state.imageUrl}
                        clickHandler={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                        setBio={(text) => {
                            this.setState({ bio: text });
                        }}
                    />
                )} */}
                <div>
                    {this.state.error && (
                        <h4 className="err">Something Went Wrong!</h4>
                    )}
                </div>

                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    logUserId={this.state.logUserId}
                                    userId={this.state.userId}
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    onClick={this.showUploader}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    closeBioEditor={() =>
                                        this.setState({
                                            bioEditIsVisible: false,
                                        })
                                    }
                                    clickHandler={() =>
                                        this.setState({
                                            uploaderIsVisible: true,
                                        })
                                    }
                                />
                            )}
                        />
                        {/* <Route path="/user/:id" component={OtherProfile} /> */}
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    logUserId={this.state.logUserId}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
                <div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            imageUrl={this.state.imageUrl}
                            setImage={(imageUrl) => {
                                this.setImage(imageUrl);
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
