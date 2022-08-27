const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const PRIVATE_JWT_KEY = "reactBackend";
router.post('/createuser',[
   body('email', "Enter a valid Email").isEmail(),
   body('password').isLength({ min: 5 }),
   body('name' , "Enter a valid name").not().isEmpty().trim().escape()

], async (req,res) => {
   const errors = validationResult(req);
   let success = false;
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   let user = await User.findOne({email : req.body.email});
   if(user){
      return res.status(400).json({success,error :"User already exist."});
   }
   const password_hash = bcrypt.hashSync(req.body.password, 10);
   user= await User.create({
      name: req.body.name,
      password: password_hash,
      email: req.body.email
    });
    const data = {
      user :{
         id : user._id
      }
    }
   
    success = true;
    res.json({success});

});
router.post('/login',[
   body('email', "Enter a valid Email").isEmail(),
   body('password',"Password cannot be empty").not().isEmpty().trim().escape()
], async (req,res) => {
   const errors = validationResult(req);
   let success = false;
   if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
   try {
   let user = await User.findOne({email : req.body.email});
   if(!user){
      return res.status(400).json({ success,errors: "Invalid Credentials"});
   }
   const password_match = await bcrypt.compare(req.body.password,user.password);
   if(!password_match){
      return res.status(400).json({ success,errors: "Invalid Credentials"});
   }
   const data = {
      user :{
         id : user._id
      }
    }
    const authToken = jwt.sign(data,PRIVATE_JWT_KEY);
    success = true;
    res.json({success,"authToken":authToken});

   } catch (error) {
      console.log("Internal server error")
      return res.status(400).json({ errors: "Internal server error"});
   }

});
router.post('/getuser',fetchUser,[
], async (req,res) => {
try {
   userId = req.user.id;
   const user = await User.findById(userId).select("-password");
   res.send(user);

} catch (error) {
   return res.status(400).json({ errors: "Internal server error"});
}
})

module.exports = router