import React from "react";
import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";
import JoinCreateChat from "../components/JoinCreateChat";
const AppRoutes=()=>{
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/chat" element={<ChatPage/>} />
            <Route path="/join" element={<JoinCreateChat/>} />
            <Route path="/about" element={<h1>This is an about page</h1>} />
            <Route path="/*" element={<h1>404 page not found</h1>} />
        </Routes>
    );
};
export default AppRoutes;