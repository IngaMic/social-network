import { render } from '@testing-library/react';
import React from 'react';
import axios from "axios";

// declare this component using the class sintax
export default class Name extends React.Component { // C starting Component must be a CAPITAL LETTER
    constructor(props) {
        super(props); //this is going to create "this"
        this.state = { //we can only have state in "class" component
            cohort: "cumin",
            name: "Ivana",
        };
        //this.handleClick = this.handleClick.bind(this); // to have "this" in a nested eventHandler scope
    }

    componentDidMount() { //is basicaly the same like "mounted" in Vue
        //axios.get("/something").then(res=>{console.log(resp)}) //smth for the future

        //user setTimeout to simulate axios req
        setTimeout(() => {
            //wherener we update we HAVE to use this setState(); you can't do this.state.cohort = "value" - err!!
            this.setState({
                cohort: "CUMIN!!!!!!!!!||||| <3", //can be used to shange smth that's already in state
                lastname: "matijevic",           //also can be user to add smth to state
            });
        }, 2000);
    }// closes componentDidMount

    handleClick() {
        console.log("clicked on a p tag");
        // axios.post("/something").then(resp => {
        //     console.log(" resp : ", resp);
        // });
        //the ERROR of "Cannot read property "setState" of undefined"
        //"this" is changing it's meaning, so either : {() => this.handleClick()} in "render()"
        this.setState({
            cohort: "Clicked On Cumin!!",
        });

    }

    render() {
        console.log("this.props in render Name.js : ", this.props);
        return (
            <div>
                {/* we are reminding "this" what "this" is when having event handler: */}
                <p onClick={() => this.handleClick()}>Welcome to React, {this.state.cohort}</p>
                {/* another way  is to go to the constructor and add this.handleClick = this.handleClick.bind(this)*/}

                {/* So, we can treat && like "then" // conditional rendering:  */}
                {this.state.lastname && <p> Your lastname : {this.state.lastname}</p>}
                <h3>{this.props.cuteAnimal}</h3>

            </div>
        );
    }
} // export ending here
