import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Welcome from "./Welcome";

let component;
if (location.pathname === "/welcome") {
    //location.pathname lives in your url
    component = <Welcome />;
} else {
    // component = <p>My Logo</p>;
    component = <App />;
}

ReactDOM.render(component, document.querySelector("main"));
