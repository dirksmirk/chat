import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Collapse,
  Button,
  Grid,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { getAllUsers } from "./Chat/GetAllUsers";
import { generateGuid } from "./Chat/GenerateGuid";
import { inviteUser } from "./Chat/InviteUsers";

const Chat = () => {
  const inputUserId = useRef();
  const inputText = useRef();
  const searchQuery = useRef();
  const [input, setInput] = useState();
  const [users, setUsers] = useState([]);
  const [guid, setGuid] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const [inviteResponse, setInviteResponse] = useState(false);
  const [open, setOpen] = useState(true);

  //handle the opening and closing of our user list
  const handleClick = () => {
    setOpen(!open);
  };

  // setting our search value into our input state
  const search = () => {
    const inputValue = searchQuery.current.value.trim();
    setInput(inputValue);
  };

  // filters our users based on our search input
  const filteredUsers = input
    ? users.filter(
        (user) =>
          user.username &&
          user.username.toLowerCase().includes(input.toLowerCase())
      )
    : users.filter((user) => user);

  useEffect(() => {
    if (users) {
      // See when users change
      console.log("users:", users);
    }
  }, [users]);
  useEffect(() => {
    if (messages) {
      // See when messages change
      console.log("messages:", messages);
    }
  }, [messages]);

  const handleInviteButtonClick = () => {
    const userId = inputUserId.current.value;
    inviteUser(userId, guid, setGuid);
  };

  //Get all users on load
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  //Generate guid on load
  useEffect(() => {
    const newGuid = generateGuid(); // Generate new GUID
    setGuid(newGuid); // Set the GUID in state
    console.log("Generated GUID on render:", newGuid);
  }, []);

  //If there is a guid OR a newMessage, fetch what conversations we have
  useEffect(() => {
    if (guid || newMessage) {
      fetch(`https://chatify-api.up.railway.app/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch conversations");
          }
          return response.json();
        })
        .then((data) => {
          setConversations(data);
          console.log("Fetched conversations: ", data);
          // once we've fetched our conversations, we want to go through each conversation and map out our messages
          data.forEach((conversation) => {
            fetchMessages(conversation);
          });
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
        });
    }
  }, [guid, newMessage]);

  //Our function to fetch the messages for our conversations. This runs through the fetch conversation function
  //And it runs for every conversation that we get, getting the messages for that conversationId
  const fetchMessages = (conversationId) => {
    fetch(
      `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        return response.json();
      })
      .then((data) => {
        //Here we get the messages for the conversationId we're looking at and store that information in an array, under the conversationId
        setMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: data, // Store messages information by conversationId
        }));
      })
      .catch((error) => {
        console.error(
          `Error fetching messages for conversation ${conversationId}:`,
          error
        );
      });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedConversation(newValue);
  };

  //Our function to send messages based on conversationId. This is connected to our tabs
  const sendMessage = async (sendId) => {
    console.log(inputText.current.value);
    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            text: inputText.current
              .value /* We get the message text from the input field */,
            conversationId:
              sendId /* get conversation ID from conversation fetch request */,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        console.log("message succesfully sent: ", data);
        setNewMessage(data.latestMessage.text);
      } else {
        console.log("Error sending message:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Grid container spacing={2} padding={2} margin={1}>
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
          <TabPanel
            key={conversation.id}
            value={selectedConversation}
            index={index}
          >
            <List sx={{ overflow: "auto", height: "75vh" }}>
              {messages[conversation] && messages[conversation].length > 0 ? (
                messages[conversation].map((message) => (
                  <ListItem key={message.id}>
                    <ListItemText
                      primary={message.text}
                      secondary={`Sent by User ${message.userId} on ${new Date(
                        message.createdAt
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No messages found" />
                </ListItem>
              )}
            </List>
            <TextField inputRef={inputText} label="Write a message" fullWidth />
            <Button
              variant="contained"
              color="primary"
              onClick={() => sendMessage(conversation)}
            >
              Send your message!
            </Button>
          </TabPanel>
        ))}
      </Grid>
      <Grid size={2} margin={1}>
        <List sx={{ overflow: "auto", height: "85vh" }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "primary",
            }}
          >
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
                filteredUsers.map((user) => (
                  <ListItemButton
                    key={user.userId}
                    sx={{ pl: 4 }}
                    onClick={() => inviteUser(user.userId, guid, setGuid)}
                  >
                    <ListItemText
                      primary={user.username}
                      secondary={user.userId}
                    />
                  </ListItemButton>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Sorry we couldnt find any users" />
                </ListItem>
              )}
            </List>
          </Collapse>
        </List>
      </Grid>
      <Grid size={2} margin={1}>
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
    </Grid>
  );
};

//This TabPanel function is what helps manage our tabs, hide those that we arent looking at/using atm
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default Chat;
