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
  Typography,
  Avatar,
} from "@mui/material";
import { useEffect, useState, useRef, useContext } from "react";
import { AuthenticateContext } from "../../Context";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { getAllUsers } from "./Chat/GetAllUsers";
import { generateGuid } from "./Chat/GenerateGuid";
import { inviteUser } from "./Chat/InviteUsers";

const Chat = () => {
  const { decodedToken, setDecodedToken} = useContext(AuthenticateContext)
  const inputText = useRef();
  const searchQuery = useRef();
  const [input, setInput] = useState();
  const [users, setUsers] = useState([]);
  const [guid, setGuid] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [inviteResponse, setInviteResponse] = useState(false);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false)

  //handle the opening and closing of our user list
  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setDecodedToken(JSON.parse(localStorage.getItem("decodedToken")))
}, [])

  //Sätter vad vi sökt från våran referens till våran input state
  const search = () => {
    const inputValue = searchQuery.current.value.trim();
    setInput(inputValue);
  };

  //Filtrerar användarlistan baserat på vad vi sökt
  const filteredUsers = input
    ? users.filter(
        (user) =>
          user.username &&
          user.username.toLowerCase().includes(input.toLowerCase())
      )
    : users.filter((user) => user);

    const getUserInfo = (userId) => {
      return filteredUsers.find((user) => user.userId === userId);
    };
  
  //Hämta alla användare när vi renderar objektet
  useEffect(() => {
    getAllUsers(setUsers);
  }, []);

  //Skapa guid när vi rendererar objektet
  useEffect(() => {
    const newGuid = generateGuid(); // Generate new GUID
    setGuid(newGuid); // Set the GUID in state
    console.log("Generated GUID on render:", newGuid);
  }, []);

  useEffect(() => {
    //Våran function inom useEffecten för att hämta alla våran konversationer
    const fetchConversations = () => {
      return fetch(`https://chatify-api.up.railway.app/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch conversations");
          }
          return response.json();
        });
    };
    //våran andra function inom useEffecten för att hämta alla våra konversationer vi blivit inbjudna till
    const fetchInvitedConversations = () => {
      return fetch(`https://chatify-api.up.railway.app/users/${decodedToken.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user invites");
          }
          return response.json();
        })
        .then((data) => {
          const invites = JSON.parse(data[0].invite);
          return invites.map(invite => invite.conversationId);
        });
    };
    //Till sist behöver vi kombinera alla konversationer. Våran Promise.all kör igång båda fetch requests samtidigt och inväntar att båda blir klara
    //Därefter så har vi två arrays av koversationIds, som vi slänger ihop till en array. Denna array går sedan igenom varje konversation och hämtar alla meddelanden för den konversationen
    //Detta kickar igång när man laddar in sidan och guid genereras, när man skickar en invita och guid genereras på nytt samt när man skickar ett nytt meddelande
    if (guid || newMessage) {
      Promise.all([fetchConversations(), fetchInvitedConversations()])
        .then(([fetchedConversations, invitedConversations]) => {
          const combinedConversations = [...fetchedConversations, ...invitedConversations];
          setConversations(combinedConversations);
          console.log("Combined conversations: ", combinedConversations);
  
          // Fetch messages for each conversation
          combinedConversations.forEach((conversation) => {
            fetchMessages(conversation);
          });
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
        });
    }
  }, [guid, newMessage]);

  //Våran funktion för att hämta alla våra meddelanden ur våra konversationer. Körs varje gång vi hämtar konversationerna
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
          //När vi får våra meddelanden och kopplad information så sparar vi det i en array under våran message state, som är kopplade under deras conversationId
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
    //Funktion som hanterar att när man klickar på en tab, byter man till den
  const handleTabChange = (event, newValue) => {
    setSelectedConversation(newValue);
  };

  //Våran funktion för att skicka meddelanden. baseras på conversationId, som fås baserat på vilken tab man är inne på
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
            text: inputText.current.value /* We get the message text from the input field */,
            conversationId: sendId /* get conversation ID from the corresponding tab */,
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
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <Tab key={conversation.id} label={`Conversation ${index + 1}`} />
            ))
          ) : (
            <Tab label="No conversatio yet. Invite someone to get started!" />
          )
        }
        </Tabs>
        {conversations.map((conversation, index) => (
          <TabPanel
            key={conversation.id}
            value={selectedConversation}
            index={index}
          >
            <List sx={{ overflow: "auto", height: "75vh" }}>
              {messages[conversation] && messages[conversation].length > 0 ? (
                messages[conversation].map((message) => {
                  const userInfo = getUserInfo(message.userId)
                  const isLoggedInUser = message.userId === decodedToken.id;
                  return (
                  <ListItem 
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isLoggedInUser ? 'flex-end' : 'flex-start',
                  }}
                  >
                    <ListItemIcon>
                    {!isLoggedInUser && userInfo && (
                      <Avatar
                      alt={userInfo.username}
                      src={userInfo.avatar}
                      sx={{ marginRight: 2 }}
                      />
                    )}
                    </ListItemIcon>
                      <Box
                        sx={{
                          maxWidth: '60%',
                          backgroundColor: isLoggedInUser ? '#DCF8C6' : '#FFFFFF',
                          borderRadius: '10px',
                          padding: '10px',
                          textAlign: isLoggedInUser ? 'right' : 'left',
                        }}
                      >
                        <ListItemText
                          primary={message.text}
                          secondary={`Sent by ${isLoggedInUser ? decodedToken.user : userInfo?.username || 'User ' + message.userId} on ${new Date(message.createdAt).toLocaleString()}`}
                        />
                      </Box>
                      <ListItemIcon>
                      {isLoggedInUser && (
                        <Avatar
                          alt={decodedToken.username}
                          src={decodedToken.avatar}
                          sx={{ marginLeft: 2 }}
                        />
                      )}
                      </ListItemIcon>
                  </ListItem>
                );
                })
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
                    <ListItemIcon>
                      <Avatar
                        alt="avatar"
                        src={user.avatar}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.username}
                      secondary={"invite"}
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
        <Typography>
          Click on the user in the list you want to invite to a conversation!
        </Typography>
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
