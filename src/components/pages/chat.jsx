import { TextField, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Collapse, Button, Grid, Box,  } from "@mui/material";
import { useEffect, useState, useRef } from "react";
/* import { ExpandLess, ExpandMore, InboxIcon } from "@mui/icons-material";
 */
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { getAllUsers } from "./Chat/GetAllUsers";
import { generateGuid } from "./Chat/GenerateGuid";
import { inviteUser } from "./Chat/InviteUsers";

const Chat = () => {
    const inputUserId = useRef();
    const inputText = useRef();
    const searchQuery = useRef();
    const [input, setInput] = useState();
    const [users, setUsers] = useState([])
    const [guid, setGuid] = useState('');
/*     const [inviteResponse, setInviteResponse] = useState(false);
 */    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

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
    useEffect(() => {
        if (guid) {
            // See when users change
            console.log('new GuID:', guid);
        }
    }, [guid])

    const handleInviteButtonClick = () => {
        const userId = inputUserId.current.value;
        inviteUser(userId, guid, setGuid);
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
                    "text": inputText.current.value, /* We get the message text from the input field */
                    "conversationId": "test"/* get conversation ID from conversation fetch request */
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
            <Button onClick={() => getAllUsers(setUsers)}>Get all users!</Button>
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
                    <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }} >
                        <ListItemButton position="sticky" onClick={handleClick}>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                        <ListItemText primary="Users" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </Box>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                            <ListItemButton key={user.userId} sx={{ pl: 4 }} onClick={() => inviteUser(user.userId, guid, setGuid)}>
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
            <Button onClick={() => setGuid(generateGuid)}>Generate guid!</Button>
            </Grid>
            <Grid size={2}>
            <TextField label='enter userID' inputRef={inputUserId} />
            <Button onClick={handleInviteButtonClick}>Invite User!</Button>
            </Grid>
        </Grid>
    )
}

export default Chat;