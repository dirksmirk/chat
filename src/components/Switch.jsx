import { Routes, Route } from "react-router-dom"
import Register from "./pages/register";
import Chat from "./pages/chat";
import LogIn from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";

const Switch = () => {
    return(
        <>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/log-in' element={<LogIn />}></Route>

                <Route element={<ProtectedRoutes />}>
                    <Route path='/chat' element={<Chat />}></Route>
                    <Route path='/profile' element={<Profile />}></Route>
                </Route>
            </Routes>
        </>
    )
}

export default Switch;