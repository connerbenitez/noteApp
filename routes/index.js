var express = require("express");
var router = express.Router();
var fs = require("fs");

let notes = [];


fs.readFile("notes.json", "utf8", function (err, data) {
  if (!err && data) {
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing notes.json:", parseErr);
    }
  }
});

function saveNotesToFile() {
  fs.writeFile("notes.json", JSON.stringify(notes, null, 2), function (err) {
    if (err) {
      console.error("Error saving notes:", err);
    }
  });
}


router.get("/note/:id/edit", function (req, res) {
  let id = parseInt(req.params.id);
  let note = notes.find((n) => n.id === id);

  if (note) {
    res.render("edit", { note });
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});


router.get("/note/:id/delete", function (req, res) {
  let id = parseInt(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  saveNotesToFile();
  res.redirect("/");
});


router.post("/submit-note", function (req, res) {
  let id = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  let title = req.body.title;
  let body = req.body.body;
  let color = req.body.color || "white";
  let starred = req.body.starred === "true";

  let newNote = { id, title, body, color, starred };
  notes.push(newNote);
  saveNotesToFile();

  res.redirect("/");
});


router.post("/edit-note/:id", function (req, res) {
  let id = parseInt(req.params.id);
  let note = notes.find((n) => n.id === id);

  if (note) {
    note.title = req.body.title || note.title;
    note.body = req.body.body || note.body;
    note.color = req.body.color || note.color;
    note.starred = req.body.starred === "true";
    
    saveNotesToFile();
    res.redirect("/");
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});


router.get("/", function (req, res) {
  res.render("index", { title: "Note-Taking App", data: notes });
});

module.exports = router;
