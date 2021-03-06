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
            uploaderIsVisible: false,
        };
    }
    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/uploadimg", formData)
            .then((resp) => {
                console.log(
                    "response from formData after imageUrl uploaded",
                    resp.data
                );
                this.props.setImage(resp.data.imageUrl);
                this.props.closeUploader(e);
            })
            .catch(function (err) {
                console.log(
                    "error in axios post /uploadimg in Uploader.js",
                    err
                );
            });
    }
    handleChange(e) {
        this.setState({ file: e.target.files[0] }, () => {
            console.log("this.state", this.state);
        });
    }
    render() {
        return (
            <div id="uploader">
                <h1 className="x" onClick={this.props.closeUploader}>
                    x
                </h1>
                <img
                    className="uploader-img"
                    src={
                        this.props.imageUrl ||
                        "https://image.flaticon.com/icons/svg/1338/1338020.svg"
                    }
                    alt=""
                    width="300"
                    height="350"
                ></img>
                <form id="uploader-form" onSubmit={(e) => this.handleSubmit(e)}>
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
