const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// model
const User = require('../../models/User');

// @type   POST
// @route  api/users
// @desc   Register new User
// @access public
router.post('/', (req, res) => {
    const {name, email, password} = req.body;
    // validate
    if (!name || !email || !password) {
        return res.status(400).json({msg: 'Name, password, email are all required'});
    }
    User.findOne({email: email})
        .then(user => {
            if (user) {
                return res.status(400).json({msg: 'Email already taken'});
            }
            const newUser = new User({name, email, password})
        
        // hash and salt
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign(
                            {id: user.id}, 
                            config.get('jwtSecret'),
                            {expiresIn: 3600}, 
                            (err, token) => {
                                if (err) throw err;
                                res.json({
                                    token: token,
                                    user: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email
                                    }
                                })
                            }
                        )
                    })
                })
            })
        })
})


// @type   POST
// @route  api/items
// @desc   create post
// @access public


// @type   DELETE
// @route  api/items/:id
// @desc   delete an item by id
// @access public


module.exports = router;