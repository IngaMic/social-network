import React from 'react';
import Name from "./Name.js";
//  function component:
// also called "presentational" component / or "dumb" component
//default is optional here:
export default function HelloWorld() {
    const name = "Ivana";
    const cuteAnimal = "Moose";
    // JSX:
    return (
        <div>
            <h1 className="title">Hello, World {name}!</h1>
            <p>lorem ipsum</p>
            <Name cuteAnimal={cuteAnimal} />
        </div>
    );
}
