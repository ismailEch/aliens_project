const express = require('express');
const fs = require('fs');
const app = express();

const router = express.Router();
app.use(express.static('public'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define a route to handle requests for the menu
router.get('/', (req, res) => {
    // Read the JSON data from the file
    fs.readFile('./data/drinks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading menu data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the JSON data
        const drinks = JSON.parse(data);

        // Render the index.ejs file and pass the menu data to it
        res.render('index', { drinks: drinks });
    });
});

// Serve static files from the public directory
//########################################################################
router.get('/list', (req, res) => {
    // Read the JSON data from the file
    fs.readFile('./data/drinks.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading menu data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Parse the JSON data
        const drinks = JSON.parse(data);

        // Render the index.ejs file and pass the menu data to it
        res.render('drinks', { drinks: drinks });
    });
});
//########################################################################

module.exports = router;

