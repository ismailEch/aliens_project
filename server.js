const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
const userRouter = require('./routes/aliens.js');
const resRouter = require('./routes/reservations.js');
const drinksRouter = require('./routes/drinks.js');



// const alienRouter = require('./routes/aliens');
let aliens = require(`./data/profile.json`);

app.get('/aliens/profile', (req, res) => {
    res.status(200).json(aliens)
})

//home page
app.get('/', (req, res) => {
    console.log(__dirname);
    res.status(200).sendFile(__dirname + '/home.html');
})
//Display form to create new profile
app.get('/create', (req, res) => {
    res.status(200).sendFile(__dirname + '/index.html');
})
//return all AliensPage
app.get('/aliens', (req, res) => {
    res.sendFile(path.join(__dirname, 'aliens.html'));
});

app.get('/aliens/api', (req, res) => {
    res.json(aliens);
});
//Display form to create new profile
app.get('/reserve', (req, res) => {
    res.status(200).sendFile(__dirname + '/indexres.html');
})
//send info to our json file
// app.use('/' , userRouter);


//Get alien by id

app.use('/aliens', userRouter);  //this is how we can use the router in a specific route


// app.get('/aliens/:name',)

app.use('/reservation', resRouter);


app.use('/drinks', drinksRouter);

// app.get('/aliens/:name',)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));

