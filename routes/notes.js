const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Notes = require('../models/Notes');

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        return res.status(400).json({ errors: "Internal server error" });
    }
});

router.post('/addnote', fetchUser, [
    body('title', "Title length must be greater than 2").isLength({ min: 3 }),
    body('description', 'Description length must be greater than 4').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        success = true;
        res.json({success,savedNote});
    } catch (error) {
        return res.status(400).json({ success,errors: "Internal server error" });
    }
});

router.put('/updatenote/:id', fetchUser, async (req, res) => {

    let success = false;
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title)
            newNote.title = title;
        if (description)
            newNote.description = description;
        if (tag)
            newNote.tag = tag;
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Error finding the note");
        }

        if (note.user.toString() != req.user.id) {
            return res.status(400).send("Not allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        success = true;
        res.json({note,success});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success,errors: "Internal server error" });
    }

});
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    let success = false;
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Error finding the note");
        }

        if (note.user.toString() != req.user.id) {
            return res.status(400).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        success = true;
        res.json({success,"note":note});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success,errors: "Internal server error" });
    }

});


module.exports = router