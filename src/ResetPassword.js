import React from "react";
import axios from "./axios";
import { Link, HashRouter } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            currentDisplay: 1,
            email: "",
            code: "",
            password: "",
            error: false,
        };
    }
    handleChange(e) {
        console.log("HandleChange is reacting, e.target.value", e.target);
        const target = e.target;
        const { name, value } = target;
        this.setState(
            {
                [name]: value,
            }
            // console.log("this.state", this.state);}
        ); //setState is async!
    }
    handleSubmit1(e) {
        e.preventDefault();
        console.log("this.state  :", this.state);
        const { email } = this.state;
        const user = {
            email: email,
        };
        axios.post("/reset", user).then((resp) => {
            console.log(" resp : ", resp);
            if (resp.data.error) {
                this.setState({ error: true });
            } else {
                console.log("response in ResetPassword /reset");
                this.setState({ currentDisplay: 2 });
                this.setState({ error: false });
            }
        });
    }
    handleSubmit2(e) {
        e.preventDefault();
        console.log("this.state  :", this.state);
        const { email, code } = this.state;
        const user = {
            email: email,
            code: code,
        };
        axios.post("/resetcode", user).then((resp) => {
            console.log(" resp : ", resp);
            if (resp.data.error) {
                this.setState({ error: true });
            } else {
                console.log("response in ResetPassword /resetcode");
                this.setState({ currentDisplay: 3 });
                this.setState({ error: false });
            }
        });
    }
    handleSubmit3(e) {
        e.preventDefault();
        console.log("this.state  :", this.state);
        const { email, password } = this.state;
        const user = {
            email: email,
            password: password,
        };
        axios.post("/resetpassword", user).then((resp) => {
            console.log(" resp : ", resp);
            if (resp.data.error) {
                this.setState({ error: true });
            } else {
                console.log("response from ResetPassword /resetpassword", resp);
                this.setState({ currentDisplay: 4 });
                // location.replace("/login");
            }
        });
    }
    // this.setState ({error: true})
    render() {
        return (
            <div>
                <h3>Would you like to change your password?</h3>
                {this.state.error && (
                    <h4 className="err">Something Went Wrong!</h4>
                )}

                {this.state.currentDisplay == 1 && (
                    <div>
                        <form onSubmit={(e) => this.handleSubmit1(e)}>
                            <label>Email: </label>
                            <input
                                onChange={(e) => this.handleChange(e)}
                                name="email"
                                value={this.state.email}
                                placeholder="Email"
                            />
                            <button>Email me the code</button>
                        </form>
                    </div>
                )}

                {this.state.currentDisplay == 2 && (
                    <div>
                        <form onSubmit={(e) => this.handleSubmit2(e)}>
                            <div>
                                <label>Code: </label>
                                <input
                                    onChange={(e) => this.handleChange(e)}
                                    name="code"
                                    value={this.state.code}
                                    placeholder="Code"
                                />
                            </div>
                            <button>Submit</button>
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 3 && (
                    <div>
                        <form onSubmit={(e) => this.handleSubmit3(e)}>
                            <div>
                                <label>New Password: </label>
                                <input
                                    onChange={(e) => this.handleChange(e)}
                                    name="password"
                                    value={this.state.password}
                                    placeholder="New Password"
                                />
                            </div>
                            <button>Reset Your Password</button>
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 4 && (
                    <div>
                        <Link to="/login">
                            Click here to login with your new password!
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}
