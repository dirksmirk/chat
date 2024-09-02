export const getAllUsers = () => {
    fetch('https://chatify-api.up.railway.app/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error getting users: ', response);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error contacting server:', error);
    });
}