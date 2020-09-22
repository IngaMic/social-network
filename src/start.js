import React from 'react';
import ReactDOM from 'react-dom';
//import HelloWorld from "./HelloWorld.js"; // because default, no curly brackets
import Welcome from "./Welcome";

let component;
if (location.pathname === "/welcome") { //location.pathname lives in your url  NOT WORKING
    component = <Welcome />
} else {
    component = <p>My Logo</p>
}

ReactDOM.render(
    component,
    document.querySelector('main')
);
