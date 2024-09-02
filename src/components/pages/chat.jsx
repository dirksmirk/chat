import { TextField, List, ListItem, ListItemText, Button, Grid,  } from "@mui/material";
import { useEffect, useState, useRef } from "react";

const Chat = () => {
    const inputUserId = useRef();
    const [users, setUsers] = useState([])
    const [guid, setGuid] = useState('');
    const [inviteResponse, setInviteResponse] = useState(false);

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
        console.log("GuID has been generated!")
        console.log(guid)
    };

    const inviteUser = () => {
        if (!guid) {
            console.error('GUID is not generated or is empty');
            alert('could not invite.')
            return;
        }
        
        fetch(`https://chatify-api.up.railway.app/invite/${inputUserId}`, {
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
        .then((data) => {
            setTimeout(() => {
                setInviteResponse(true);
            }, 3000);
            console.log("You invited a user!")
            console.log(data)
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        })
    };

    const sendMessage = async () => {

        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
/*                     "text": "Hello, world!",
                    "conversationId": "550e8400-e29b-41d4-a716-446655440000" */
                })
            })
            const data = await response.json();

            if (response.ok) {
                console.log('message succesfully sent: ', data)
            } else {
                console.log('Error sending message:', data)
            }
        } catch (error) {
            console.error('Network error:', error)
        }
    }

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
            <Grid size={2}>
            <TextField label='enter userID' inputRef={inputUserId} />
            <Button onClick={inviteUser}>Invite User!</Button>
            </Grid>
        </Grid>
    )
}

export default Chat;