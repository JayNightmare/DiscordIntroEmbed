const path = require('path');
const express = require('express');
const session = require('express-session'); // Import express-session

const app = express();

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

app.get('*', (request, response) => {
    console.log('Requested URL:', request.originalUrl); // This will log the actual requested URL
    return response.status(404).send('Page not found');
});

app.get('navbar-input', (request, response) => {
    return response.sendFile('html/navbar.html', { root: __dirname });
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
        return res.redirect('html/dashboard.html', { root: __dirname });
    });
});

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

const port = '5500';
app.listen(port, () => console.log(`App listening at http://127.0.0.1:${port}`));