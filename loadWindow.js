window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (!accessToken) {
        window.location.href = '/';
        return;
    }


    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        // Avatar Icon Script Extended
        .then(result => result.json())
        .then(response => {
            console.log(response);
            const { username, discriminator, avatar, id, global_name } = response;
            //set the welcome username string
            document.getElementById('name').innerText = ` ${global_name}`;
            document.getElementById('username').innerText = `${username}`;

            //set the avatar image by constructing a url to access discord's cdn
            // document.getElementById("avatar").src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`;

            document.querySelector('.image-3Qwc32').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`;
            console.log(document.getElementById('avatar').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`);

            document.querySelector('.image-1Psl69').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`;
            console.log(document.getElementById('avatar').style.backgroundImage = `url("https://cdn.discordapp.com/avatars/${id}/${avatar}")`);

            document.getElementById("profile-link").href = `/auth/discord#${fragment}`;
        })
        .catch(console.error);
};
