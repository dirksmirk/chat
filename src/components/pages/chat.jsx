import { TextField, List, ListItem, ListItemText,  } from "@mui/material";
import { useEffect, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Chat = () => {
    const [localStorageValue, setlocalStorageValue] = useState('');
    const [users, setUsers] = useState('')

    useEffect(() => {
        const localStorageItem = localStorage.getItem('token');
        if (localStorageItem) {
            setlocalStorageValue(localStorageItem);
        }
    }, []);

    console.log('JWT Token:', localStorageValue);
    // Getting 401 error, not authorized. Do I need to send the JWT along somehow?
    useEffect(() => {
        if (localStorageValue) {
            fetch('https://chatify-api.up.railway.app/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorageValue}`
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
    }, [localStorageValue]);

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