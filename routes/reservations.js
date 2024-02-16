const express = require('express');
const addreservation = require('../addreservation.js');
const router = express.Router();
const fs = require('fs');

// Load reservations data
let reservations = require('../data/reservation.json');
let aliens = require(`../data/profile.json`)
let profiles = require('../data/profile.json');


// Get all reservations
router.get('/list', (req, res) => {
    fs.readFile('./data/reservation.json' , 'utf-8' , (err,data)=>{
        if(err){
            console.error('error' , err);
            res.status(500).send('internal server error')
            return;
        }
        const list = JSON.parse(data);
        res.render('reslist' ,  {list:list});
    })
})
//###########################################################3
router.get('/addNewReservation', (req, res) => {
    res.render('createreservation');
})
//save data
router.post('/create', (req, res) => {
    const newReservation = req.body;
    let userExists = false;
    for (let i = 0; i < aliens.length; i++) {
        if (aliens[i].id === Number(newReservation.clientId)) {
            userExists = true;
            break;
        }
    }
    // Automatically assign the next available ID
    const nextId = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;
    newReservation.id = nextId;
    if (userExists) {
        reservations.push(newReservation);
        fs.writeFile('./data/reservation.json', JSON.stringify(reservations, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.redirect('http://localhost:8080/reservation/list');
        });
    } else {
        res.status(400).send('User does not exist');
    }
});
//##############################################################################3
router.post('/addreservation', addreservation);

// Get a specific reservation by ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const reservation = reservations.find(reservation => reservation.id === id);

    if (!reservation) {
        res.status(404).send('Reservation not found');
    } else {
        res.status(200).json(reservation);
    }
});

// Get reservations by user ID
router.get('/search/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userReservations = reservations.filter(reservation => reservation.clientId === userId);

    if (userReservations.length === 0) {
        res.status(404).send('Reservations not found for this user');
    } else {
        res.status(200).json(userReservations);
    }
});

// Add a new reservation
router.post('/', (req, res) => {
    const newReservation = req.body;
    let userExists = false;
    for (let i = 0; i < aliens.length; i++) {
        if (aliens[i].id === Number(newReservation.clientId)) {
            userExists = true;
            break;
        }
    }
    // Automatically assign the next available ID
    const nextId = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;
    newReservation.id = nextId;
    if (userExists) {
        reservations.push(newReservation);
        fs.writeFile('./data/reservation.json', JSON.stringify(reservations, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).send('Reservation added successfully');
        });
    } else {
        res.status(400).send('User does not exist');
    }
});

// Update a reservation
router.put('/:id', (req, res) => {
    const idToUpdate = parseInt(req.params.id);
    const updatedReservation = req.body;

    const index = reservations.findIndex(reservation => reservation.id === idToUpdate);
    if (index !== -1) {
        reservations[index] = { ...reservations[index], ...updatedReservation };
        fs.writeFile('./data/reservation.json', JSON.stringify(reservations, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('Reservation updated successfully');
        });
    } else {
        res.status(404).send('Reservation not found');
    }
});

// Delete a reservation
router.delete('/:id', (req, res) => {
    const idToRemove = parseInt(req.params.id);
    reservations = reservations.filter(reservation => reservation.id !== idToRemove);
    fs.writeFile('./data/reservation.json', JSON.stringify(reservations, null, 4), 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Reservation deleted successfully');
    });
});




//#################################################################################
//delete single reservation
//delete an alien profile from the json file
router.delete('/delete/:id', (req, res) => {
    fs.readFile('./data/reservation.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading JSON file", err);
            res.status(500).send('Internal Server Error');
            return;
        }
        try {
            const json = JSON.parse(data);
            const idToRemove = parseInt(req.params.id);
            const filteredData = json.filter(item => item.id !== idToRemove);
            fs.writeFile('./data/reservation.json', JSON.stringify(filteredData, null, 4), 'utf8', (err) => {
                if (err) {
                    console.error("Error writing JSON file", err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.send('Deleted object with id ' + idToRemove);
            });
        } catch (parseError) {
            console.error("Error parsing JSON", parseError);
            res.status(500).send('Internal Server Error');
        }
    });
});
//#################################################################################


module.exports = router;
