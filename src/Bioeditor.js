import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.bio,
            userId: null,
            error: false,
            // bioEditIsVisible: false,
        };
        console.log("this.props", this.props);
    }

    handleSubmit(e) {
        ///we need to store text in var to pass in axios
        e.preventDefault();
        axios
            .post("/uploadbio", { bio: this.state.text })
            .then((resp) => {
                // console.log("response from server = bio uploaded", resp.data);
                this.props.setBio(this.state.text);
                console.log("this.props in BioEditor", this.props);
                // this.setState({
                //     bioEditIsVisible: false,
                // });
                this.props.closeBioEditor();
            })
            .catch(function (err) {
                console.log(
                    "error in axios post /uploadbio in Bioeditor.js",
                    err
                );
            });
    }
    handleChange(e) {
        //console.log("HandleChange is reacting, e.target.value", e.target.value);
        this.setState({ text: e.target.value }, () => {
            //console.log("this.state after handleChange Bioeditor", this.state);
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
                            // value={this.state.text}
                            name="text"
                            rows="15"
                            cols="30"
                        ></textarea>
                        {/* <input type="submit" value="submit"></input> */}
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}
