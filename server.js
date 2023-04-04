const express = require("express");
const path = require("path");
const fs = require("fs");
const noteId = require("nid");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  //Serve the index.html file to the client
  res.sendFile(path.join(__dirname, "/public/index.html"));
  console.log("Served the index.html file to the client");
});

app.get("/notes", (req, res) => {
  //Serve the notes.html file to the client
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  console.log("Serve the notes.html file to the client");
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      res.json("Error reading database");
      throw err;
    }
    if (data === "[]") {
      res.json("There are no notes.");
      console.log("There are no notes.");
    }
    else {
    res.json(JSON.parse(data));
    console.log("get request to /api/notes");
    }
  });
});

app.post("/api/notes", (req, res) => {
  // Destructuring assignment for the items in req.body
  console.log("post request to /api/notes");
  const { title, text } = req.body;
  // If all the required properties are present
  if (title && text) {    
    const id = noteId(5);
    console.log("ID", id);
    // Variable for the note to be saved
      var newNote = {
      title,
      text,
      id
    };
  console.log("New note", newNote);
  }
  // Obtain existing notes
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      res.json("Error reading database");
      throw err;
    }
    else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      // Add a new review
      parsedNotes.push(newNote);
      // Write updated notes back to the file
      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes, null, 2), (err) => {
        if (err) {
          res.json("Error saving database");
          throw err;
        }
        else {
          res.json("Note saved!");
          console.log("note saved")
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const idToDelete = req.params.id;
  console.log("delete request received for id" + req.params.id);
  // Get the existing notes
  fs.readFile("./db/db.json", (err, data) => {
    if (err) {
      res.json("Error reading database");
      throw err;
    }
    else {
      // Convert the array of existing notes into a JSON object
      const notes = JSON.parse(data);
      // Check the existing notes to see if the requested id exists
      /*let foundNote = no;
      for (const note of notes) {
      if (note.id === idToDelete) {
        foundNote = yes;
      }*/
      // Use filter to remove the note to be deleted
      const filteredNotes = notes.filter(note => note.id !== idToDelete);
      if (filteredNotes.length === notes.length) {
        res.json("Note not found");
        console.log("Note not found");
      }
      else {
        // Write filtered notes back to the file
        fs.writeFile("./db/db.json", JSON.stringify(filteredNotes, null, 2), (err) => {
          if (err) {
            res.json("Error saving database");
            rconsole.log("error saving database");
            throw err;
          }
          else {
            res.json("Note deleted!");
            console.log("Note deleted!");
          }
        });
      }
    }
  });
});

// Fallback route for when a user attempts to visit routes that don't exist
app.get('*', (req, res) => {
  //Serve the index.html file to the client
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
})