const express = require('express');
const fs = require('fs');
const app = express();
const addUser = require('../adduser.js');
const router = express.Router();
let aliens = require(`../data/profile.json`);
app.use(express.json());
app.set('view engine', 'ejs');





router.get('/profile', (req, res, next) => {
    res.status(200).json(aliens)
})
router.post('/adduser', addUser);
//###########################################################################
 //home page redirect:
router.get('/start', (req, res) => {
    res.render('home');
})

//add new user page and data
router.get('/addNewUser', (req, res) => {
    res.render('createprofile');
})
//
router.post('/create/new', (req, res) => {
    const newUser = req.body;
    const nextId = aliens.length > 0 ? aliens[aliens.length - 1].id + 1 : 1;
    newUser.id = nextId;
        aliens.push(newUser);
        fs.writeFile('./data/profile.json', JSON.stringify(aliens, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing JSON file', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.redirect('http://localhost:8080/drinks/list');
        });
});
//git all aliens page
router.get('/list', (req, res) => {
    fs.readFile('./data/profile.json' , 'utf-8' , (err,data)=>{
        if(err){
            console.error('error' , err);
            res.status(500).send('internal server error')
            return;
        }
        const list = JSON.parse(data);
        res.render('list' , {list:list});
    })
})

//send data
app.get('/list/api', (req, res) => {
    res.json(aliens);
});
//end
//###########################################################################

router.route('/:id').get(
    (req, res) => {
        let id = req.params.id;
        id = Number(id);
        console.log("Searching for " + id + "...");
        // find the alien by its name in the array of aliens and return it
        let result = aliens.find((alien) => { return alien.id === id });
        res.send(result);
    }
)
    //update an existing alien
    .put(
        (req, res) => {
            let idToUpdate = req.params.id;
            idToUpdate = Number(idToUpdate);
            let updatedAlien = req.body;
            console.log("Updating alien with ID: " + idToUpdate);

            let index = aliens.findIndex(alien => alien.id === idToUpdate);
            if (index !== -1) {
                aliens[index] = { ...aliens[index], ...updatedAlien };
                fs.writeFile('./data/profile.json', JSON.stringify(aliens, null, 4), 'utf8', function (err) {
                    if (err) {
                        console.error("Error writing JSON file", err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
                    res.send('Updated alien with ID ' + idToUpdate);
                });
            } else {
                res.status(404).send('Alien not found');
            }
        })
    //delete an alien profile from the json file
    router.delete('/delete/:id', (req, res) => {
        fs.readFile('./data/profile.json', 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading JSON file", err);
                res.status(500).send('Internal Server Error');
                return;
            }
            try {
                const json = JSON.parse(data);
                const idToRemove = parseInt(req.params.id);
                const filteredData = json.filter(item => item.id !== idToRemove);
                fs.writeFile('./data/profile.json', JSON.stringify(filteredData, null, 4), 'utf8', (err) => {
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
    
module.exports = router
