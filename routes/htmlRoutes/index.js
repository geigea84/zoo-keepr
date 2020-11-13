const path = require("path");
const router = require("express").Router();

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
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// 3.6
router.get("/animals", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/animals.html"));
});

router.get("/zookeepers", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

module.exports = router;