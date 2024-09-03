import { TextField, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Collapse, Button, Grid,  } from "@mui/material";
import { useEffect, useState, useRef } from "react";
/* import { ExpandLess, ExpandMore, InboxIcon } from "@mui/icons-material";
 */
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


const Chat = () => {
    const inputUserId = useRef();
    const inputText = useRef();
    const searchQuery = useRef();
    const [input, setInput] = useState();
    const [users, setUsers] = useState([])
    const [guid, setGuid] = useState('');
    const [inviteResponse, setInviteResponse] = useState(false);
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

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

    const search = () => {
        const inputValue = searchQuery.current.value.trim();
        setInput(inputValue)
    };

    const filteredUsers = input
        ? users.filter(user => user.username && user.username.toLowerCase().includes(input.toLowerCase()))
        : users.filter(user => user);

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
    };

    const inviteUser = (userId) => {
        if (!guid) {
            console.error('generating guid!');
            generateGuid();
        } if (!userId) {
            console.error('A userID is required ')
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
        .finally(() => {
            generateGuid();
            console.info("A new guid has been created after inviting a user!")
        })
    };

    const handleInviteButtonClick = () => {
        const userId = inputUserId.current.value;
        inviteUser(userId);
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
                    "text": inputText,
                    "conversationId": guid
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
            <Button onClick={sendMessage}>Send your message!</Button>
            </Grid>
            <Grid size={2}>
            <Button onClick={getAllUsers}>Get all users!</Button>
            </Grid>
            <Grid size={2}>
            <TextField 
            label="search for user"
            variant="outlined"
            fullWidth
            inputRef={searchQuery}
            sx={{ mb: 2 }}
            />
            </Grid>
            <Grid size={2}>
            <Button onClick={search}>Search for user!</Button>
            </Grid>
            <Grid size={2}>
                <List sx={{overflow: 'auto', maxHeight: 300,}}>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                    <ListItemText primary="Users" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                            <ListItemButton key={user.userId} sx={{ pl: 4 }} onClick={() => inviteUser(user.userId)}>
                                <ListItemText primary={user.username} secondary={user.userId} />
                            </ListItemButton>
                    ))
                ): (
                    <ListItem>
                        <ListItemText primary="Sorry we couldnt find any users" />
                    </ListItem>
                )}
                </List>
                    </Collapse>
                </List>
            </Grid>
            <Grid size={2}>
            <Button onClick={generateGuid}>Generate guid!</Button>
            </Grid>
            <Grid size={2}>
            <TextField label='enter userID' inputRef={inputUserId} />
            <Button onClick={handleInviteButtonClick}>Invite User!</Button>
            </Grid>
        </Grid>
    )
}

export default Chat;