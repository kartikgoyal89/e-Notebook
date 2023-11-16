const express = require('express');
const router = express.Router();
const Note = require ('../models/Note')
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult} = require('express-validator');

//ROUTE 1: Get all the Notes using GET "/api/notes/fetchallnotes" Login required   
router.get('/fetchallnotes', fetchuser, async (req, res) =>{
    try {
        const notes = await Note.find({user: req.user.id});
    res.json(notes)
    } catch (error) {
        console.error(error.mesage);
        res.status(500).send("Interanl server Error");
    }
    
})


//ROUTE 2: Add a new Note using POST "/api/notes/addnote" Login required   
router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({min: 3}),
    body('description', 'Description must be atleast 5 characters').isLength({min: 5})
], async (req, res) =>{
    try {
        const { title, description, tag} = req.body;

        //If there area errors, return Bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)

    } catch (error) {
        console.error(error.mesage);
        res.status(500).send("Interanl server Error");
    }
})


//ROUTE 3: Update an existing Note using PUT "/api/notes/updatenote/:id" Login required
router.put('/updatenote/:id', fetchuser, async (req, res) =>{
    const { title, description, tag} = req.body;

    try {
        //create a newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        //Allows updation only if note with this id is owned by this user only
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note})

    } catch (error) {
        console.error(error.mesage);
        res.status(500).send("Interanl server Error");
    }

})


//ROUTE 4: Deleting an existing Note using DELETE "/api/notes/deletenote/:id" Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) =>{
    try {
        //Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        //Allows deletion only if note with this id is owned by this user only
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted"})

    } catch (error) {
        console.error(error.mesage);
        res.status(500).send("Interanl server Error");
    }

})

module.exports = router