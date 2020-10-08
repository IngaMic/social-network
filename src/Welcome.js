import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./Registration";
import Login from "./login";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to Combat!</h1>
            {/* <Registration /> */}
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
