const path = require('path');
const express = require('express');


const app = express();

app.use('',express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('dashboard.html', { root: '.' });
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

app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
  }));
  
  // Save the token in the session
  app.get('/auth/discord/callback', (req, res) => {
	  req.session.accessToken = accessToken; // Save token after authentication
	  res.redirect('/dashboard');
  });
  
  // Access the token from session
  app.get('/some-protected-route', (req, res) => {
	  const accessToken = req.session.accessToken;
	  // Use the accessToken for API requests or other logic
  });


const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));