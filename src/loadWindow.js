window.onload = () => {
    // Read cookies and extract the JWT token
    function getCookie(name) {
        return document.cookie.split('; ').reduce((acc, cookie) => {
            let [key, value] = cookie.split('=');
            if (key === name) return decodeURIComponent(value);
            return acc;
        }, null);
    }

    const authToken = getCookie('auth_token'); // Updated to match JWT cookie from server

    if (!authToken) {
        window.location.href = '/index.html'; // Redirect to login if no token
        return;
    }

    // Validate token by calling the authentication status API
    fetch('https://your-server-url.com/api/auth/status', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Unauthorized');
        return response.json();
    })
    .then(user => {
        console.log("Authenticated User:", user);
        const { username, avatar, id } = user;

        // Set welcome message
        document.getElementById('name').innerText = ` ${username}`;
        document.getElementById('username').innerText = `${username}`;

        // Set avatar images if available
        if (avatar) {
            document.querySelector('.image-3Qwc32').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`;
            document.querySelector('.image-1Psl69').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`;
        }

        // Set profile link
        document.getElementById("profile-link").href = `/auth/discord`;
    })
    .catch(error => {
        console.error("Authentication failed:", error);
        window.location.href = '/index.html'; // Redirect to login on failure
    });
};
