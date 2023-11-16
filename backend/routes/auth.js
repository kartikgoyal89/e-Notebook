const express = require('express');
const User = require ('../models/User')
const router = express.Router();
const { body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const { useId } = require('react');

const JWT_SECRET ='Himanshuisagoodb$oy';

//ROUTE 1: Create a user using POST "/api/auth/createuser" No login required   
router.post('/createuser',[
    body('name', 'Enter valid Name').isLength({min: 3}),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})], 
     async (req, res) =>{

        let success = false;

    
        //If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({success, errors: errors.array()});
        }

        try {
            //Check whether the user with this email exists already
            let user = await User.findOne({email: req.body.email});
            if(user){
                return res.status(400).json({success, error: "User with this email already exits"})
            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            //create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            });

            const data = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken})
        } 
        catch (error) {
            console.error(error.mesage);
            res.status(500).send("Interanl server Error");
        }

    })



    //ROUTE 2: Authenticate a user using POST "/api/auth/login" No login required   
    router.post('/login',[
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()], 
     async (req, res) =>{
    
        let success = false;

        //If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {email,password} = req.body;
        try {
            //Check whether the user with this email exists or not
            let user = await User.findOne({email});
            if(!user){
                success = false;
                return res.status(400).json({success, error: "Please try to login with correct credentials"})
            }

            //If email exists then check for correct password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                success = false;
                return res.status(400).json({success, error: "Please try to login with correct credentials"});
            }

            const data = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({success, authtoken})
        } 
        catch (error) {
            console.error(error.mesage);
            res.status(500).send("Interanl server Error");
        }

    })


    //ROUTE 3: Get loggedin user details using POST "/api/auth/getuser" Login required   
    router.post('/getuser', fetchuser, async (req, res) =>{
        try {
            userId = req.user.id;
            const user = await User.findById(userId).select("-password")
            res.send(user)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal serer Error");
        }

    })


module.exports = router