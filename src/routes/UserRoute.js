const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
// const app = express()
const { body } = require('express-validator');
const router = express.Router();
const UserModel = require("../models/UserModel");
// const bodyParser = require('body-parser');
// router.use(bodyParser)
var bodyParser = require('body-parser')
router.use(bodyParser.json())

router.post("/login",body('email').isEmail(),body('password').notEmpty(), async (req, res) => {
    // console.log("from login route")
    try{
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     return res.status(400).json({
        //         status:"Failed",
        //         Error:errors.array()
        //     })
        // }
        // console.log(req)
        // console.log(req.body)
        const { email, password } = req.body;
        const userData = await UserModel.findOne({ email });
        if (userData) {
            let result = await bcrypt.compare(password, userData.password);
            if (result) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                    data: userData._id,
                },
                    process.env.SECRET
                );
                res.status(200).json({
                    status: "Success",
                    message: "user logged in successfully",
                    token: token,
                });
            } else {
                res.status(400).json({
                    status: "Password not matched",
                    message: "Wrong Password",
                });
            }
        }else{
            res.status(400).json({
                status:"Failed",
                message:"User is not registered. Pls signup before signin"
            })
        }
    }catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message,
        });
    }
});

router.post('/register',body('email').isEmail(),body('password').isLength({ min: 6, max: 16 }), async (req, res) => {
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     return res.status(400).json({
        //         status:"Failed",
        //         Error:errors.array(),
        //         message:errors.array().filter((e)=>e.value.length<6&&e.param=="password").length?"password length should be 6 to 16 chars":""
        //     })
        // }
        // console.log(req.body)
        const { email, password, confirmPassword } = req.body;
        let userData = await UserModel.findOne({ email });
        if (userData) {
            return res.status(409).json({
                status: "Existed Email",
                message: "User already exists with the given email. Pls proceed to signin"
            })
        }
        // console.log(password,confirmPassword)
        if (password !== confirmPassword) {
            return res.status(400).send('Password and confirm password are not matching');
        }

        bcrypt.hash(password, 10, async function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                })
            }
            userData = await UserModel.create({
                email: email,
                password: hash,
                name: email.split("@")[0]
            });
            res.json({
                status: "Success",
                message: "User succesfully created",
                userData
            })
        })
    }
    catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }
});

router.get('/get', async (req, res) => { 
    try{
        const userData = await UserModel.find();
        res.json({
            status: "Success",
            message: "User succesfully created",
            userData
        })
    }
    catch(e){
        res.json({
            status: "Failed",
            message: e.message
        })
    }

})
module.exports = router;