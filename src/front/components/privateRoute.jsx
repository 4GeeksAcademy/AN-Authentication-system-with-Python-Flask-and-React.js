// src/front/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateRoute = ({ element }) => {
    const { store } = useGlobalReducer(); 

 
    if (!store.user) {
        return <Navigate to="/login" />;
    }
    return element;
};

