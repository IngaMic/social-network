import axios from "./axios";
import React, { useState, useEffect } from "react";
import { HashRouter, Route, Link, Switch } from 'react-router-dom';
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./App";
import Welcome from "./Welcome";
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

////////////ERROR ABOUT reducer:
const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let component;
if (location.pathname === "/welcome") {
    //location.pathname lives in your url
    component = <Welcome />;
} else {
    // component = <p>My Logo</p>;
    // component = <App />; /////PREVIOUS

    /////////////////Changed HERE://///////////////
    //stop passing "<App/>" to "ReactDom" and pass it to the <Provider>
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );

}

ReactDOM.render(component, document.querySelector("main"));

////////////CLASS NOTES//////////
// function Greetee() {
//     const [greetee, setGreetee] = useState("ivana");

//     const handleChange = (e) => {
//         //console.log("e.target.value : ", e.target.value);
//         setGreetee(e.target.value);
//     };

//     return (
//         <div>
//             <h1>Hello, {greetee}</h1>
//             <input onChange={handleChange} type="text" name="greetee" />
//         </div>
//     );
// }

//////////////////////notes for "find people"
// function IncrementalSearch() {
//     const [userInput, setUserInput] = useState("");
//     const [contries, setCountries] = useState([]);
//     useEffect(() => {
//         //console.log("useEffect is running!");//runs when the component mounts
//         (async () => {
//             try {
//                 const { data } = await axios.get(
//                     "/https://spicedworld.herokuapp.com/?q=" + userInput
//                 );
//                 //console.log("data :", data);
//                 setCountries(data);
//             } catch (err) {
//                 console.log("err : ", err);
//             }
//         })();
//     }, [userInput]); //if we pass an empty [] as a 2ns arg - use effect will run only when the component mounts and never again

//     //console.log("countries : ", countries);
//     function handleChange(e) {
//         //console.log("e.target.value : ", e.target.value);
//         setUserInput(e.target.value);
//     }

//     return (
//         <div>
//             <input
//                 onChange={handleChange}
//                 type="text"
//                 name="userInput"
//                 placeholder="type here"
//             />
//             <h1>Incremental</h1>
//             {setCountries.map((country, i) => {
//                 //country = each item in an array
//                 //a 2nd arg after country is an index of array
//                 // console.log("cuntry : ", country);
//                 return <p key={i}>{country}</p>; //country.name //country.capital and so on
//             })}
//         </div>
//     );
// }
