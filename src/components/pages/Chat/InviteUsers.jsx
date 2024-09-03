// src/utils/inviteUser.js

import { generateGuid } from "./GenerateGuid";

export const inviteUser = (userId, guid, setGuid) => {
  if (!guid) {
    console.error('Generating GUID...');
    const newGuid = generateGuid();
    setGuid(newGuid);
    guid = newGuid;
  } 

  if (!userId) {
    console.error('A userID is required');
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
    .then((data) => {
      console.log("You invited a user!");
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    })
    .finally(() => {
      const newGuid = generateGuid();
      setGuid(newGuid);
      console.info("A new GUID has been created after inviting a user!");
    });
};
