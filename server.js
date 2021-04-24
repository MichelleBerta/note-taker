const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const util = require("util");

const uuid = require("uuid-random");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  let db = [];
  readFile("./db/db.json", "utf8").then((notes) => {
    console.log(notes, db);
    try {
      db = JSON.parse(notes);
      console.log(db);
    } catch (error) {
      console.log("error: " + error);
      db = [];
    }
    return res.json(db);
  });
});

app.post("/api/notes", (req, res) => {
  readFile("./db/db.json", "utf8").then((notes) => {
    // http://expressjs.com/en/api.html#req.body
    // https://www.npmjs.com/package/uuid-random#example-usage
    const currentNotes = JSON.parse(notes);
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uuid(),
    };
    currentNotes.push(newNote);
    writeFile("./db/db.json", JSON.stringify(currentNotes));
    res.json(200);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  readFile("./db/db.json", "utf8").then((notes) => {
    let currentNotes = JSON.parse(notes);
    // http://expressjs.com/en/api.html#req.params
    currentNotes = currentNotes.filter((note) => note.id !== req.params.id);
    writeFile("./db/db.json", JSON.stringify(currentNotes));
    res.json(200);
  });
});

// LISTENER
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
