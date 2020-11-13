const fs = require("fs");
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// 4.4
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// 2.5 parse incoming string or array data
// (middleware functions)
app.use(express.urlencoded({extended: true}));
// 2.5 parse incoming JSON data
app.use(express.json());

/* 4.4 This is our way of telling the server that any time 
a client navigates to <ourhost>/api, the app will use the 
router we set up in apiRoutes. If / is the endpoint, then 
the router will serve back our HTML routes. */
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// 3.4 connect css and js to html
/* We added some more middleware to our server and used the 
express.static() method. The way it works is that we provide 
a file path to a location in our application (in this case, 
the public folder) and instruct the server to make these 
files static resources. */
app.use(express.static("public"));

// 1.4 keep this at the bottom
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});