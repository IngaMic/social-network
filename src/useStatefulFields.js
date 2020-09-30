import React, { useState } from "react";
//the only rule = the hook must start with use
export function useStatefulFields() {
    const [value, setValue] = useState({});
    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
        //console.log("value from useStatefulFields :", value);
    };
    return [value, handleChange];
}
