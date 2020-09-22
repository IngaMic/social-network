import React from "react";
const cookieSession = require('cookie-session');
import axios from "axios";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            password: "",
            userId: null,
            error: false,
        };
    }
    handleChange(e) {
        console.log("HandleChange is reacting, e.target.value", e.target);
        const target = e.target;
        const { name, value } = target;
        this.setState({
            [name]: value,
            //last: e.target.value,// Read Documentation ////////////////////////////////////////////////////////
        }//, () => {
            // console.log("this.state", this.state);}

        ); //setState is async! that is why console.log given as second arg

    }// 1. finish writing the handleChange button with one setState
    // 2. second eventHandler will be click on a button and redirect
    handleSubmit(e) {
        e.preventDefault();
        console.log("this.state  :", this.state);
        const { first, last, email, password } = this.state;
        const user = {
            first: first,
            last: last,
            email: email,
            password: password,
        }
        axios.post("/welcome", user).then(resp => {
            console.log(" resp : ", resp);
            if (resp.data.error) {
                this.setState({ error: true });
            } else {
                console.log("userId from response in Registration.js", resp.data.userId);
                location.replace("/");
            }
        });
    }
    // just Showing how to set ERROR to true
    // this.setState ({error: true}) //we need to figure out where to pur it
    render() {
        return (
            <div>
                <h3>Register here:</h3>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    {this.state.error && <h4 className="err">Something Went Wrong!</h4>}
                    <label>Your First Name:  </label>
                    <input onChange={(e) => this.handleChange(e)} name="first" value={this.state.first} placeholder="First Name" />
                    <label>Your Last Name:  </label>
                    <input onChange={(e) => this.handleChange(e)} name="last" value={this.state.last} placeholder="Last Name" />
                    <label>Email:  </label>
                    <input onChange={(e) => this.handleChange(e)} name="email" value={this.state.email} placeholder="Email" />
                    <label>Password:  </label>
                    <input onChange={(e) => this.handleChange(e)} name="password" value={this.state.password} placeholder="Password" />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}




//this code will redirect the user to the / route :
//location.replace("/")
//and use it only after : hash password, insert into our users table...
