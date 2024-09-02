import { TextField, List, ListItem, ListItemText, Button, Grid,  } from "@mui/material";
import { useEffect, useState } from "react";

const Chat = () => {
    const [users, setUsers] = useState('')
    const [guid, setGuid] = useState('');

    const getAllUsers = () => {
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
    }

    useEffect(() => {
        if (users) {
            // See when users change
            console.log('users:', users);
        }
    }, [users])

    const generateGuid = () => {
        const newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => 
            (c === 'x' ? Math.floor(Math.random() * 16) : (Math.floor(Math.random() * 4) + 8)).toString(16)
        );
        setGuid(newGuid);
    };

    const inviteUser = (userId) => {
        if (!guid) {
            console.error('GUID is not generated or is empty');
            alert('could not invite.')
            return;
        }
        
        fetch(`https://chatify-api.up.railway.app/invite/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                conversationId: guid,
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Problem with inviting user');
            }
            return response.json();
        })
        .then(() => {
            setTimeout(() => {
                setIsInviteResponse(true);
            }, 3000);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        })
        .finally (() => {
            // Reset guid value and everything
            generateGuid();
        })
    };

    return (
        <Grid container spacing={0}>
            <Grid size={4}>
            <TextField label='chat here' />
            </Grid>
            <Grid size={2}>
            <Button onClick={getAllUsers}>Get all users!</Button>
            </Grid>
            <Grid size={2}>
            <Button onClick={generateGuid}>Generate guid!</Button>
            </Grid>
        </Grid>
    )
}

export default Chat;