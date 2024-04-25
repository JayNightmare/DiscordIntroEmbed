let isLoggedIn = false;

document.getElementById('loginButton').addEventListener('click', () => {
  if (!isLoggedIn) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    window.location.href = authUrl;
  } else {
    alert('You are already logged in!');
  }
});

window.addEventListener('message', event => {
  if (event.origin === window.location.origin) {
    const data = event.data;
    if (data.type === 'DISCORD_LOGGED_IN') {
      isLoggedIn = true;
      document.getElementById('loginStatus').textContent = 'Logged In';
      localStorage.setItem('discordAccessToken', data.accessToken);
    }
  }
});

window.addEventListener('load', () => {
  const discordAccessToken = localStorage.getItem('discordAccessToken');
  if (discordAccessToken) {
    isLoggedIn = true;
    document.getElementById('loginStatus').textContent = 'Logged In';
  }
});

document.getElementById('generateButton').addEventListener('click', function() {
  if (!isLoggedIn) {
    alert('Please log in with Discord first.');
    return;
  }

  if (!localStorage.getItem('discordAccessToken')) {
    // Redirect to Discord OAuth2 authorization
    const CLIENT_ID = process.env.CLIENT_ID;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    window.location.href = authUrl;
    return;
  }

  // User is already logged in, continue with card generation
  const discordId = document.getElementById('discordId').value;
  const gradientStart = document.getElementById('gradientStart').value;
  const gradientEnd = document.getElementById('gradientEnd').value;

  if (!discordId) {
    alert('Please enter a Discord ID.');
    return;
  }

    const discordId = document.getElementById('discordId').value;
    const gradientStart = document.getElementById('gradientStart').value;
    const gradientEnd = document.getElementById('gradientEnd').value;

    if (!discordId) {
        alert('Please enter a Discord ID.');
        return;
    }

    // Replace this with the actual API call to your backend
    fetch(`http://localhost:3000/getUserData?discordId=${discordId}`) // Update with your actual endpoint
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.status === 401) {
        localStorage.removeItem('discordAccessToken');
        alert('Your Discord session has expired. Please login again.');
        return;
        }
        return response.json();
    })
    .then(userData => {
      if (!userData.id) {
        alert('Unable to fetch user data from Discord');
        return;
      }

        const cardPreview = document.getElementById('cardPreview');
        cardPreview.innerHTML = ''; // Clear the preview field

        // Create the card with user data
        const cardElement = createU