// Require path
var path = require("path");

// Requite express and create express app
var express = require("express");
var app = express();

// Require body-parse send we need to handle
// POST DATA for adding a quote
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded( {extended: true} ));

// Static content
app.use(express.static(path.join(__dirname + "/static")));

// Set up view folder and ejs
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");

// Require mongoose
var mongoose = require("mongoose");

// Connect to a Mongo Database named
// "quoting_dojo" and if this DB doesn't exist
// create it
mongoose.connect("mongodb://localhost/quoting_dojo");

// Create a new schema instance of mongoose.Schema(...)
var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String,
    // Insert current date, time in
    // "ISODate" format
    updated_at: {type: Date, default: Date.now}
});

// Create a blueprint object and
// necessary database collection out of the model
var Quote = mongoose.model("Quote", QuoteSchema);

// Index route
app.get("/", function(req, res) {
    res.render("index");
});

// Route to add a quote
app.post("/quotes", function(req, res) {

    // Show form data posted
    console.log("POST DATA", req.body);

    // Create a new quote with the
    // corresponding "name" and "quote"
    // form fields from req.body
    var quote = new Quote({
        name: req.body.name,
        quote: req.body.quote
    });

    // Try to save that new quote to the DB and if
    // needed run a callback with an error
    quote.save(function(err) {
        if(err) {
            console.log("Quote not saved in MongoDB 'quoting_dojo' database.");
        }
        else {
            console.log("Successfully added a quote.");
            res.redirect("/");
        }
    });

});

app.get("/quotes", function(req, res) {
    // Execute the "Quote" model to display documents
    // in the "quote" collection
    Quote.find({}).exec(function(err, quotes) {
        // If errors exist console log them on terminal server-side
        if(err) {
            console.log("Error:", err);
        }
        // Else render "index.ejs" and pass a "quotes" object with the
        // "quotes" Mongo clllection of the "quoting_dojo" DB to "index.ejs"
        else {
            res.render("quotes", {quotes: quotes});
        }
    });
});

// Listen on port 8000
app.listen(8000, function() {
    console.log("Node.js running on port 8000");
});