const fs = require("fs");

function addUser(req, res) {
    let users = [];
    try {
        const data = fs.readFileSync("data/profile.json", "utf-8");
        users = JSON.parse(data);
        if (!Array.isArray(users)) {
            users = [];
        }
    } catch (err) {
    }


    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    console.log(req.body);
    const newUser = {
        id,
        name: req.body.name,
        age: req.body.age,
        planet: req.body.planet,
        species: req.body.species,
        preferredLanguage: req.body.preferredLanguage,
        gender: req.body.gender,
        contactInformation: req.body.contactInformation,
    };

    users.push(newUser);


    fs.writeFileSync("data/profile.json", JSON.stringify(users, null, 2));

    res.send("User added successfully!");
}

module.exports = addUser;
