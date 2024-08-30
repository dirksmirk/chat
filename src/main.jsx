import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './Context.jsx'
import { CustomThemeProvider } from './ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <CustomThemeProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </CustomThemeProvider>
    </BrowserRouter>

)
