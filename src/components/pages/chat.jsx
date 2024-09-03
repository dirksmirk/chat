import { TextField, List, ListItem, ListItemText, ListItemButton, ListItemIcon, Collapse, Button, Grid, Box, Tabs, Tab  } from "@mui/material";
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
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [selectedConversation, setSelectedConversation] = useState(0);
    const [newMessage, setNewMessage] = useState('');
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
        if (messages) {
            // See when messages change
            console.log('messages:', messages);
        }
    }, [messages])

    const handleInviteButtonClick = () => {
        const userId = inputUserId.current.value;
        inviteUser(userId, guid, setGuid);
    };

    useEffect(() => {
        const newGuid = generateGuid();  // Generate new GUID
        setGuid(newGuid);  // Set the GUID in state
        console.log('Generated GUID on render:', newGuid);
    }, []);

    useEffect(() => {
        if (guid || newMessage ) {
            fetch(`https://chatify-api.up.railway.app/conversations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                return response.json();
            })
            .then(data => {
                setConversations(data);
                console.log("Fetched conversations: ", data);
                data.forEach(conversation => {
                    fetchMessages(conversation)
                });
            })
            .catch(error => {
                console.error('Error fetching conversations:', error);
            });
        }
    }, [guid, newMessage]);

    const fetchMessages = (conversationId) => {
        fetch(`https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            return response.json();
        })
        .then(data => {
            setMessages(prevMessages => ({
                ...prevMessages,
                [conversationId]: data // Store messages information by conversationId
            }));
            console.log(data)
        })
        .catch(error => {
            console.error(`Error fetching messages for conversation ${conversationId}:`, error);
        });
    };

    const handleTabChange = (event, newValue) => {
        setSelectedConversation(newValue);
    };

/*     useEffect(() => {
        if (newMessage) {
            fetchMessages();
        }
    }, []) */

    /* useEffect(() => {
        if (conversations.length > 0) {
            conversations.map(conversation => (
                fetch(`https://chatify-api.up.railway.app/messages?conversationId=${conversation}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        console.error("Failed to get messages: ", response)
                    }
                    return response.json();
                })
                .then(data => {
/*                     setMessages(prevMessages => ({
                        ...prevMessages,
                        [conversation.id]: data.text // Store messages under the conversationId key
                    })); 
                    console.log(data)
                })
                .catch(error => {
                    console.error("Failed to fetch messages: ", error)
                })
            ))
        }
    }, [conversations]) */

    const sendMessage = async (sendId) => {
        console.log(inputText.current.value)
        try {
            const response = await fetch('https://chatify-api.up.railway.app/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    "text": inputText.current.value, /* We get the message text from the input field */
                    "conversationId": sendId /* get conversation ID from conversation fetch request */
                })
            })
            const data = await response.json();

            if (response.ok) {
                console.log('message succesfully sent: ', data)
                setNewMessage(data.latestMessage.text)

            } else {
                console.log('Error sending message:', data)
            }
        } catch (error) {
            console.error('Network error:', error)
        }
    }

    return (
        <Grid container spacing={0}>
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
                    <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'inherit' }} >
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
            <Grid size={6}>
            <Tabs
                    value={selectedConversation}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="conversation tabs"
                >
                    {conversations.map((conversation, index) => (
                        <Tab key={conversation.id} label={`Conversation ${index + 1}`} />
                    ))}
                </Tabs>
                {conversations.map((conversation, index) => (
                    <TabPanel key={conversation.id} value={selectedConversation} index={index}>
                        <List>
                            {messages[conversation] && messages[conversation].length > 0 ? (
                                messages[conversation].map((message) => (
                                    <ListItem key={message.id}>
                                        <ListItemText 
                                            primary={message.text} 
                                            secondary={`Sent by User ${message.userId} on ${new Date(message.createdAt).toLocaleString()}`} 
                                        />
{/*                                          <TextField inputRef={inputText} label="Write a message" />
                                        <Button onClick={() => sendMessage(message.conversationId)}>Send your message!</Button> */}
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No messages found" />
                                </ListItem>
                            )}
                        </List>

                            <TextField inputRef={inputText} label="Write a message" fullWidth />
                            <Button variant="contained" color="primary" onClick={() => sendMessage(conversation)}>Send your message!</Button>

                    </TabPanel>
                ))}
            </Grid>

{/*             <Grid size={2}>
            <Button onClick={() => setGuid(generateGuid)}>Generate guid!</Button>
            </Grid> */}
{/*             <Grid size={2}>
            <TextField label='enter userID' inputRef={inputUserId} />
            <Button onClick={handleInviteButtonClick}>Invite User!</Button>
            </Grid> */}
        </Grid>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default Chat;