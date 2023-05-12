var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require('../helpers/authHelper');

const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, question } = req.body;
        // validation
        if(!name) {
            return res.send({message: "Name is Required"})
        }
        if(!email) {
            return res.send({message: "Email is Required"})
        }
        if(!password) {
            return res.send({message: "Password is Required"})
        }
        if(!phone) {
            return res.send({message: "Phone is Required"})
        }
        if(!address) {
            return res.send({message: "Address is Required"})
        }
        if(!question) {
            return res.send({message: "question is Required"})
        }

        // esistiong user
        const existiongUser = await userModel.findOne({email});
        if(existiongUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered please login"
            })
        }

        // register user 
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({name, email, phone, address, question, password:hashedPassword }).save()

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
};


const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        // validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            })
        }

        // check user
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd"
            })
        }

        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        // token
        const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: "login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in login",
            error
        })
    }
}


const forgotPasswordController = async (req, res) => {
    try {
        const {email, question, newPassword} = req.body;
        if(!email) {
            res.status(400).send({
                message: "email is required"
            })
        }
        if(!question) {
            res.status(400).send({
                message: "question is required"
            })
        }
        if(!newPassword) {
            res.status(400).send({
                message: "newPassword is required"
            })
        }

        // check
        const user = await userModel.findOne({email, question})

        if(!user) {
            return res.status(404).send({
                success:false,
                message: "Wrong Email Or Answere"
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed})
        res.status(200).send({
            success: true,
            message: "Password reset successful"
        })

    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "something is wrong",
            error
        })
    }
}

const updateProfileController = async (req, res) => {
    try {
        const {name, email, password, address, phone} = req.body;
        const user = await userModel.findById(req.user._id)
        if(password && password.length < 6) {
            return res.json({error: "password is required and 6 character long"})
        }
        const hashedPassword = password ? await hashedPassword(password) : undefined
        const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, {new: true})

        res.status(200).send({
            success: true,
            message: "updated",
            updateUser
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "something is wrong while updateing profile",
            error
        })
    }
}



const testController = (req, res) => {
    res.send("working..")
}

module.exports = {registerController, loginController, testController, forgotPasswordController, updateProfileController };
