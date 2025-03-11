const path = require('path');
const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware for sessions (should be placed before routes)
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        httpOnly: true
    }
}));

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (request, response) => {
    return response.sendFile('html/index.html', { root: __dirname });
});

app.get('/auth/discord', (request, response) => {
    return response.sendFile('html/dashboard.html', { root: __dirname });
});

app.get('/CreateCard', function(request, response) {
    return response.sendFile('NavBarOptions/CreateCard/CreateCard.html', { root: __dirname });
});

app.get('/Gallery', function(request, response) {
    return response.sendFile('NavBarOptions/Gallery/Gallery.html', { root: __dirname });
});

app.get('/navbar-input', (request, response) => {
    return response.sendFile('html/navbar.html', { root: __dirname });
});

app.get('/dashboard', (request, response) => {
    return response.sendFile('html/dashboard.html', { root: __dirname });
});

// Save the token in the session
app.get('/some-protected-route', (req, res) => {
    const accessToken = req.session.accessToken;
    if (accessToken) {
        res.send('Access granted');
    } else {
        res.send('Access denied');
    }
});

// OAuth callback route
app.get('/auth/discord/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send('Missing code');

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://127.0.0.1:5500/auth/discord/callback',
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        req.session.regenerate(err => {
            if (err) return res.status(500).send('Session error');
            req.session.accessToken = tokenResponse.data.access_token;
            res.redirect('/dashboard');
        });

    } catch (error) {
        console.error('OAuth Token Exchange Failed:', error.response?.data || error.message);
        res.status(500).send('OAuth Failed');
    }
});

// Catch-all route for 404 errors
app.get('*', (request, response) => {
    console.log('Requested URL:', request.originalUrl);
    return response.status(404).send('Page not found');
});

// Disable caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
