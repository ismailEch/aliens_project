const fs = require("fs");

function addReservation(req, res) {
    let reservations = [];
    try {
        const data = fs.readFileSync("data/reservation.json", "utf-8");
        reservations = JSON.parse(data);
        if (!Array.isArray(reservations)) {
            reservations = [];
        }
    } catch (err) {
        // Handle error
    }

    const id = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;

    console.log(req.body);
    const newReservation = {
        id,
        clientId: Number(req.body.clientId),
        alien_name: req.body.alien_name,
        drink_ordered: req.body.drink_ordered,
        quantity_of_drinks: req.body.quantity_of_drinks,
        quantity_of_people: req.body.quantity_of_people,

    };

    reservations.push(newReservation);

    fs.writeFileSync("data/reservation.json", JSON.stringify(reservations, null, 2));

    res.send("Reservation added successfully!");
}

module.exports = addReservation;
