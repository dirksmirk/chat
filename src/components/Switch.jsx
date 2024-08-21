import { Routes, Route } from "react-router-dom"
import Register from "./register";
import Chat from "./chat";
import LogIn from "./Login";
import Profile from "./Profile";

const Switch = () => {
    return(
        <>
            <Routes>
                <Route path='/chat' element={<Chat />}></Route>
                <Route path='/' element={<Register />}></Route>
                <Route path='/log-in' element={<LogIn />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
            </Routes>
        </>
    )
}

export default Switch;