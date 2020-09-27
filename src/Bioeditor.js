import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            text: "",
            userId: null,
            bioEditIsVisible: false,
            error: false,
        };
    }
    componentDidMount() {
        this.setState({
            userId: this.props.userId,
            bio: this.props.bio,
        });
    }

    handleSubmit(e) {
        ///we need to store text in var to pass in axios
        axios
            .post("/uploadbio", text)
            .then((resp) => {
                console.log("response from server = bio uploaded", resp.data);
                // this.props.setBio(this.state.text);
                this.setState({ bioEditIsVisible: false });
            })
            .catch(function (err) {
                console.log(
                    "error in axios post /uploadbio in Bioeditor.js",
                    err
                );
            });
    }
    handleChange(e) {
        console.log("HandleChange is reacting, e.target.value", e.target.value);
        this.setState({ text: e.target.value }, () => {
            console.log("this.state", this.state);
        });
    }
    render() {
        return (
            <div id="bio-editor">
                <div>
                    {this.state.error && (
                        <h4 className="err">Something Went Wrong!</h4>
                    )}
                </div>

                <div>
                    {/* <p>This must be a bio</p> */}
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <textarea
                            onChange={(e) => this.handleChange(e)}
                            value={this.state.text}
                            name="text"
                            rows="15"
                            cols="30"
                        ></textarea>
                        <input type="submit" value="submit"></input>
                    </form>
                </div>
            </div>
        );
    }
}
