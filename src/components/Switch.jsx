import { Routes, Route } from "react-router-dom"
import Register from "./register";
import Chat from "./chat";
import LogIn from "./Login";

const Switch = () => {
    return(
        <>
            <Routes>
                <Route path='/' element={<Chat />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/log-in' element={<LogIn />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
            </Routes>
        </>
    )
}

export default Switch;