const path = require('path');
const express = require('express');
const session = require('express-session'); // Import express-session

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: __dirname });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('dashboard.html', { root: __dirname });
});

app.get('/CreateCard', function(request, response) {
    return response.sendFile('public/NavBarOptions/CreateCard/CreateCard.html', { root: __dirname });
});

app.get('/Gallery', function(request, response) {
    return response.sendFile('public/NavBarOptions/Gallery/Gallery.html', { root: __dirname });
});

app.get('*', (request, response) => {
    console.log('Requested URL:', request.originalUrl); // This will log the actual requested URL
    return response.status(404).send('Page not found');
});

app.get('navbar-input', (request, response) => {
    return response.sendFile('navbar.html', { root: __dirname });
});

app.use(session({
	secret: '1234',
	resave: false,
	saveUninitialized: true,
	cookie: { 
        sameSite: 'strict',
        secure: true,
        httpOnly: true
    }
}));
  
// Save the token in the session
app.get('/some-protected-route', (req, res) => {
    const accessToken = req.session.accessToken;
    if (accessToken) {
        res.send('Access granted');
    } else {
        res.send('Access denied');
    }
});

// Route for handling OAuth callback, assuming 'accessToken' is obtained correctly
app.get('/auth/discord/callback', (req, res) => {
    req.session.regenerate((err) => {
        if (err) {
            console.error('Session regeneration failed:', err);
            return res.status(500).send('Internal Server Error');
        }
        req.session.accessToken = accessToken;
        res.redirect('/dashboard');
    });
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));