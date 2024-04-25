require('dotenv').config(); // If you're using dotenv to handle environment variables
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/auth/discord', (req, res) => {
    // Redirect users to Discord's OAuth2 authorization endpoint
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`);
});

app.get('/oauth/callback', async (req, res) => {
    // Discord redirects back to this route with a code parameter
    const code = req.query.code; 

    try {
        // Exchange the code for an access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch user profile using the access token
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!userResponse.ok) {
            throw new Error(`HTTP Error Response: ${userResponse.status} ${userResponse.statusText}`);
        }

        const profile = await userResponse.json();

        // Send the profile information back to the front end, or handle it as needed
        res.send(profile);
    } catch (error) {
        // Handle any errors that occurred during the process
        console.error(error);
        res.status(500).send('An error occurred while trying to authenticate with Discord.');
    }
});

// API route to handle fetching user data
app.get('/api/user', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  
  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!userResponse.ok) {
      throw new Error(`HTTP Error Response: ${userResponse.status} ${userResponse.statusText}`);
    }

    const profile = await userResponse.json();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

app.get('/verifyToken', async (req, res) => {
  const token = req.query.token;
  try {
    // Verify the token is valid on Discord's API
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res.status(response.ok ? 200 : 401).send(response.ok);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error verifying token');
  }
});

const server = app.listen(3000, () => console.log('Server started on port 3000'));
