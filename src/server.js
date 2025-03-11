const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const serverCache = new NodeCache({ stdTTL: 900 }); // Cache TTL: 15 min

const FRONTEND_URL = "https://jaynightmare.github.io/DiscordIntroEmbed/src/html";

// * Middleware: Cookie Parser
app.use(cookieParser());

// * CORS: Allow requests from GitHub Pages
app.use(cors({
    origin: 'https://jaynightmare.github.io',
    credentials: true,
}));

// * Session Configuration (Required for Passport)
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));

// * Passport.js Configuration
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
    const userData = {
        username: profile.username,
        id: profile.id,
        avatar: profile.avatar,
        access_token: accessToken,
    };
    done(null, userData);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

// * Route: Start Discord Authentication
app.get('/auth/discord', passport.authenticate('discord'));

// * Route: Handle Discord OAuth Callback
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: `${FRONTEND_URL}/index.html`,
}), (req, res) => {
    const user = req.user;

    // Generate JWT Token
    const token = jwt.sign({
        username: user.username,
        id: user.id,
        avatar: user.avatar,
        access_token: user.access_token,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store the JWT in a secure cookie
    res.cookie('auth_token', token, {
        httpOnly: true,  // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600 * 1000,  // Expires in 1 hour
    });

    // Redirect to GitHub Pages dashboard
    res.redirect(`${FRONTEND_URL}/dashboard.html`);
});

// * Route: Logout & Clear Cookies
app.get('/logout', (req, res) => {
    res.clearCookie('auth_token', { secure: true, sameSite: 'None' });
    req.logout(() => {
        res.redirect(`${FRONTEND_URL}/index.html`);
    });
});

// * Middleware: Validate JWT Authentication
const authenticate = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

// * Route: Check Authentication Status
app.get('/api/auth/status', authenticate, (req, res) => {
    res.json({
        loggedIn: true,
        username: req.user.username,
        avatar: req.user.avatar,
        id: req.user.id,
    });
});

// * Route: Fetch User Guilds with Caching
app.get('/api/auth/guilds', authenticate, async (req, res) => {
    const { id, access_token } = req.user;

    // Check Cache
    const cachedGuilds = serverCache.get(id);
    if (cachedGuilds) {
        return res.json({ guilds: cachedGuilds });
    }

    try {
        const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const guilds = response.data;
        const manageableGuilds = guilds.filter(guild => (guild.permissions & 0x20) === 0x20);

        // Store in Cache
        serverCache.set(id, manageableGuilds);

        res.json({ guilds: manageableGuilds });
    } catch (error) {
        console.error('Error fetching guilds:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch guilds' });
    }
});

// * Route: Fetch Specific Guild
app.get('/api/auth/guilds/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { access_token } = req.user;

    try {
        const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const guilds = response.data;
        const guild = guilds.find(g => g.id === id);

        if (!guild) {
            return res.status(404).json({ message: 'Guild not found or no access' });
        }

        res.json({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            canManage: (guild.permissions & 0x20) === 0x20,
        });
    } catch (error) {
        console.error('Error fetching guild:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch guild' });
    }
});

// * Catch-All Route for 404 Errors
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
});

// * Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
