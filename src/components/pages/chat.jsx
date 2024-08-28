import { TextField, List, ListItem, ListItemText,  } from "@mui/material";
import { useEffect, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Chat = () => {
    const [sessionStorageValue, setsessionStorageValue] = useState('');
    const [users, setUsers] = useState('')

    useEffect(() => {
        const sessionStorageItem = sessionStorage.getItem('token');
        if (sessionStorageItem) {
            setsessionStorageValue(sessionStorageItem);
        }
    }, []);

    console.log('JWT Token:', sessionStorageValue);
    // Getting 401 error, not authorized. Do I need to send the JWT along somehow?
    useEffect(() => {
        if (sessionStorageValue) {
            fetch('https://chatify-api.up.railway.app/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorageValue}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                /* console.log('Fetched users:', data); */
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
        }
    }, [sessionStorageValue]);

    useEffect(() => {
        if (users) {
            // See when users change
            console.log('users:', users);
        }
    }, [users])

    return (
        <TextField label='chat here' />
    )
}

export default Chat;