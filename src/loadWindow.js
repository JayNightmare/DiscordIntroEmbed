window.onload = () => {
    // Read cookies and extract the accessToken
    function getCookie(name) {
        return document.cookie.split('; ').reduce((acc, cookie) => {
            let [key, value] = cookie.split('=');
            if (key === name) return decodeURIComponent(value);
            return acc;
        }, null);
    }

    const accessToken = getCookie('accessToken');

    if (!accessToken) {
        window.location.href = '/index.html'; // Redirect to login if no token
        return;
    }

    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    })
    .then(result => result.json())
    .then(response => {
        console.log(response);
        const { username, discriminator, avatar, id, global_name } = response;

        // Set welcome message
        document.getElementById('name').innerText = ` ${global_name}`;
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
        console.error("Failed to fetch user data:", error);
        window.location.href = '/index.html'; // Redirect to login on failure
    });
};
