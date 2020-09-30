import React from "react";
import axios from "axios";
import { useStatefulFields } from "./useStatefulFields";
import { useAuthSubmit } from "./useAuthSubmit";

export default function Registration() {
    const [value, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/register", value);
    return (
        <form>
            {error && <div>Ooops, something went wrong!</div>}
            <input
                onChange={handleChange}
                type="text"
                name="first"
                placeholder="first"
            />
            <input
                onChange={handleChange}
                type="text"
                name="last"
                placeholder="last"
            />
            <input
                onChange={handleChange}
                type="text"
                name="email"
                placeholder="email"
            />
            <input
                onChange={handleChange}
                type="text"
                name="password"
                placeholder="password"
            />
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
}
