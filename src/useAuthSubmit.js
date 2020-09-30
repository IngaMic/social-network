import React, { useState } from "react";
import axios from "./axios";

export function useAuthSubmit(url, value) {
    const [error, setError] = useState(false);
    const handleSubmit = () => {
        axios.post(url, value).then((resp) => {
            if (resp.data.success) {
                location.replace("/");
            } else {
                setError(true);
            }
        });
    };
    return [error, handleSubmit];
}
