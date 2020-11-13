// 4.4 importing functions from lib/animals.js
const {
    filterByQuery, 
    findById, 
    createNewAnimal, 
    validateAnimal
} = require("../../lib/animals");

// 4.4 changing app.get or app.post to router.get or router.post
const router = require("express").Router();

// 1.5 creating a route
const {animals} = require("../../data/animals");

// 1.5 adding the route
// app represents a single instance of the express.js server
router.get("/animals", (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// 1.7 adding second route
router.get("/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    }
    else {
        res.send(404);
    }
});

/* 2.3 POST requests differ from GET requests in that they 
represent the action of a client requesting the server to 
accept data rather than vice versa */
router.post("/animals", (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted.");
    }
    // add animal to json file and animals array in this function
    else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// 4.4 export router (formerly app)
module.exports = router;