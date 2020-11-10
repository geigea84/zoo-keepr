const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

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

// 1.5 adding the route
app.get("/api/animals", (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

/* 1.5 There are two important takeaways from this code:

The first is that the get() method requires two arguments. 
The first is a string that describes the route the client 
will have to fetch from. The second is a callback function 
that will execute every time that route is accessed with 
a GET request.

The second takeaway is that we are using the send() method 
from the res parameter (short for response) to send the 
string Hello! to our client. */

// 1.4 keep this at the bottom
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});