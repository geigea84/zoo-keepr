const fs = require("fs");
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// 2.5 parse incoming string or array data
// (middleware functions)
app.use(express.urlencoded({extended: true}));
// 2.5 parse incoming JSON data
app.use(express.json());

// 3.4 connect css and js to html
/* We added some more middleware to our server and used the 
express.static() method. The way it works is that we provide 
a file path to a location in our application (in this case, 
the public folder) and instruct the server to make these 
files static resources. */
app.use(express.static("public"));

// 1.5 creating a route
const {animals} = require("./data/animals");

/* 1.5 This function will take in req.query as an 
argument and filter through the animals accordingly */
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated animalsArray
        // If personalityTraits is a string, place it into a new array and Save
        if (typeof query.personalityTraits === "string") {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            /* Check the trait against each animal in the filteredResults array.
            Remember, it is initially a copy of the animalsArray, but here we're
            updating it for each trait in the .forEach() loop.  For each trait
            being targeted by the filter, the filteredResults array will then
            contain only the entries that contain the trait, so at the end we'll
            have an array of animals that have every one of the traits when the
            .forEach() loop is finished. */
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// 1.7 takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// 2.6
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, "./data/animals.json"),
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

//2.6 data validation
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== "string") {
        return false;
    }
    if (!animal.species || typeof animal.species !== "string") {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== "string") {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// 1.5 adding the route
app.get("/api/animals", (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// 1.7 adding second route
app.get("/api/animals/:id", (req, res) => {
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
app.post("/api/animals", (req, res) => {
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

// 2.4 Insomnia Core to test API endpoints 

/* 1.5 There are two important takeaways from this code:

The first is that the get() method requires two arguments. 
The first is a string that describes the route the client 
will have to fetch from. The second is a callback function 
that will execute every time that route is accessed with 
a GET request.

The second takeaway is that we are using the send() method 
from the res parameter (short for response) to send the 
string Hello! to our client. */

// 3.4 adding a new route
/* Unlike most GET and POST routes that deal with creating 
or return JSON data, this GET route has just one job to do, 
and that is to respond with an HTML page to display in the 
browser. So instead of using res.json(), we're using 
res.sendFile(), and all we have to do is tell them where 
to find the file we want our server to read and send back 
to the client. */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// 3.6
app.get("/animals", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

// 1.4 keep this at the bottom
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});