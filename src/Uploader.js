import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        console.log("props :", props);
        this.state = {
            file: "",
            userId: props.userId,
            error: false,
        };
    }
    handleSubmit(e) {
        var formData = new FormData();
        formData.append("file", this.state.file);
        console.log("FormData", formData);
        console.log("this.state.imageUrl   :", this.state.file.name);
        axios
            .post("/uploadimg", formData)
            .then((resp) => {
                console.log(
                    "response from formData after imageUrl uploaded",
                    resp.data
                );
                this.props.setImage(resp.data.imageUrl);
            })
            .catch(function (err) {
                console.log(
                    "error in axios post /uploadimg in Uploader.js",
                    err
                );
            });
    }
    handleChange(e) {
        console.log("HandleChange is reacting, e.target.value", e.target.value);
        console.log(
            "HandleChange is reacting, e.target.files[0]",
            e.target.files[0]
        );
        this.setState({ file: e.target.files[0] }, () => {
            console.log("this.state", this.state);
        });
    }
    render() {
        return (
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}