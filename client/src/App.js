import React from "react";

import { Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import "./App.css"

function App() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} exact />
        </Routes>
      </div>
    )
}

export default App;