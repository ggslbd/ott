const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    fs.readFile('channels.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading channels.json:', err);
            res.status(500).send('Error reading channels.json');
        } else {
            const vodData = JSON.parse(data);
            res.render('index', { vodChannels: vodData });
        }
    });
});


// Route to find a specific channel based on postId
// Route to generate full post view
app.get('/post/:postId', (req, res) => {
    const { postId } = req.params;

    fs.readFile('channels.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading channels.json:', err);
            res.status(500).send('Error reading channels.json');
        } else {
            const vodData = JSON.parse(data);
            const channel = vodData.find((item) => item.postId === postId);

            if (channel) {
                res.render('channel', { channel });
            } else {
                res.status(404).send(`Channel with postId ${postId} not found.`);
            }
        }
    });
});



// Route to display reels
app.get('/reels', (req, res) => {
    fs.readFile('reels.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reel.json:', err);
            res.status(500).send('Error reading reel.json');
        } else {
            const reels = JSON.parse(data).reels;
            res.render('reels', { reels });
        }
    });
});

// Route for sharing a specific post
app.get('/share/:postId', (req, res) => {
    const { postId } = req.params;

    fs.readFile('channels.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading channels.json:', err);
            res.status(500).send('Error reading channels.json');
        } else {
            const vodData = JSON.parse(data);
            const channel = vodData.find((item) => item.postId === postId);

            if (channel) {
                res.render('share', { channel });
            } else {
                res.status(404).send(`Channel with postId ${postId} not found.`);
            }
        }
    });
});

// Route to generate the full channel list in JSON
app.get('/channels', (req, res) => {
    fs.readFile('channels.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading channels.json:', err);
            res.status(500).send('Error reading channels.json');
        } else {
            const vodData = JSON.parse(data);
            res.json({ vod: vodData });
        }
    });
});


// Serve the manifest file
app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Serve the service worker file
app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'service-worker.js'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});