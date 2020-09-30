import React from "react";
//const cookieSession = require("cookie-session");
import axios from "./axios";
import { Link, HashRouter } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            userId: null,
            error: false,
        };
    }
    handleChange(e) {
        //console.log("HandleChange is reacting, e.target.value", e.target);
        const target = e.target;
        const { name, value } = target;
        this.setState(
            {
                [name]: value,
            } //, () => {
            // console.log("this.state", this.state);}
        ); //setState is async!
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log("this.state  :", this.state);
        const { email, password } = this.state;
        const user = {
            email: email,
            password: password,
        };
        axios.post("/login", user).then((resp) => {
            console.log(" resp : ", resp);
            if (resp.data.error) {
                this.setState({ error: true });
            } else {
                // console.log(
                //     "userId from response in Registration.js",
                //     resp.data.userId
                // );
                location.replace("/");
            }
        });
    }
    // just Showing how to set ERROR to true
    // this.setState ({error: true})
    render() {
        return (
            <div>
                <h3>Login into your account:</h3>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    {this.state.error && (
                        <h4 className="err">Something Went Wrong!</h4>
                    )}
                    <div>
                        <label>Email: </label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="email"
                            value={this.state.email}
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input
                            onChange={(e) => this.handleChange(e)}
                            name="password"
                            value={this.state.password}
                            placeholder="Password"
                        />
                    </div>
                    <button>Login</button>
                </form>

                <Link to="/reset">Click here to reset your password!</Link>
            </div>
        );
    }
}

// import { useStatefulFields } from "./useStatefulFields";
// import { useAuthSubmit } from "./useAuthSubmit";

// export default function Login() {
//     const [value, handleChange] = useStatefulFields();
//     const [error, handleSubmit] = useAuthSubmit("/login", value);
//     return (
//         <form>
//             {error && <div>Ooops, something went wrong!</div>}
//             <input
//                 onChange={handleChange}
//                 type="text"
//                 name="email"
//                 placeholder="email"
//             />
//             <input
//                 onChange={handleChange}
//                 type="text"
//                 name="password"
//                 placeholder="password"
//             />
//             <button onClick={handleSubmit}>Submit</button>
//         </form>
//     );
// }
