import { TextField, List, ListItem, ListItemText,  } from "@mui/material";
import { useEffect, useState } from "react";
import { AuthenticateContext } from "../../Context";

const Chat = () => {
    const [users, setUsers] = useState('')

    console.log('JWT Token:', localStorage.getItem('token'));
    // Getting 401 error, not authorized. Do I need to send the JWT along somehow?
    useEffect(() => {
            fetch('https://chatify-api.up.railway.app/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        
    }, []);

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