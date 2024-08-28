import { Routes, Route } from "react-router-dom"
import Register from "./pages/register";
import Chat from "./pages/chat";
import LogIn from "./pages/Login";
import Profile from "./pages/register";
import Home from "./pages/Home";

const Switch = () => {
    return(
        <>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/chat' element={<Chat />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/log-in' element={<LogIn />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
            </Routes>
        </>
    )
}

export default Switch;