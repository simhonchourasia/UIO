const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// model
const User = require('../../models/User');

// @type   POST
// @route  api/auth
// @desc   authenticate user
// @access public
router.post('/', (req, res) => {
    const { email, password} = req.body;
    // validate
    if (!email || !password) {
        return res.status(400).json({msg: 'Password, email are all required'});
    }
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(400).json({msg: 'User not found'});
            }
        
            // validate password
            bcrypt.compare(password, user.password)
                .then(matched => {
                    if (!matched) return res.status(400).json({msg: 'Wrong password'})

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


// @type   GET
// @route  api/auth/user
// @desc   get user data
// @access private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
});



module.exports = router;