import { useRef, useState, useEffect } from "react";
import { FormControl, FormLabel, Button, TextField } from '@mui/material';

const CreateUser = () => {
    // Refs to store input values
    const userName = useRef();
    const password = useRef();
    const email = useRef();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('https://chatify-api.up.railway.app/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                console.log(data);
            })
            .catch(error => {
                console.error(error.message);
            });
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (userName.current.value === '' || password.current.value === '' || email.current.value === '') {
            alert("Alla fält måste fyllas i.");
            return; // Stoppa funktionen här om något fält är tomt
        } if (users.username === users.current.value) {
            alert("Username or email already exists")
            return;
        }
        const data = {
            "username": userName.current.value,
            "password": password.current.value,
            "email": email.current.value,
            "avatar": "picture"

        };

        // Send POST request to create auction
        await fetch('https://chatify-api.up.railway.app/auth/register',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
         }) 
         .then(response => response.json())  
         .then(data => {
            console.log('Auction created successfully:', data);
        })
        .catch(error => {
            console.error('Error creating auction:', error);
        });
    }


    return (
        <FormControl onSubmit={handleSubmit}>
            <FormLabel>Enter Name</FormLabel>
            <TextField></TextField>
            <Button type="submit">Submit</Button>
        </FormControl>
    )
}

export default CreateUser;