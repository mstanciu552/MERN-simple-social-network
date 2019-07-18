const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../verification/verify');
const dotenv = require('dotenv').config();

const Joi = require('@hapi/joi');

const validation = {
    username: Joi.string().min(6),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
}

const User = require('../db_setup/users');


router.get('/', (req, res) => {
    User.find({}, (err, user) => {
        if (err) console.log(err);
        else return res.send(user);
    });
});
router.post('/register', async (req, res) => {

    // Validation
    const { error } = Joi.validate(req.body, validation);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if user in db
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    // bcryptjs
    const hashSalt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, hashSalt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
    });
    user.save()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            console.error(err);
        });
});

router.post('/login', async (req, res) => {
    const { error } = Joi.validate(req.body, validation);
    if (error) return res.status(400).send(error.details[0].messsage);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password is wrong");

    const pass = await bcryptjs.compare(req.body.password, user.password);
    if (!pass) return res.status(400).send('Inavlid password');

    // Handle jsonwebtoken
    jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
        if (err) console.log(err);
        else {
            return res.json({token});
        }
    });
});


router.get('/user', verify, (req, res) => {
    let response = {};
    response = req.user;
    res.json(response);
});

router.patch('/user/:id', verify, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) console.error(err);
        else user.update({ username: req.body.username, email: req.body.email });
    });
});
router.delete('/user/:id', verify, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) console.error(err);
        else {
            if (user) {
                user.delete()
                    .catch(err => console.error(err));
            }
        }
    });
});


module.exports = router;
