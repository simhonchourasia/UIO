const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

// model
const Item = require('../../models/Item');

// @type   GET
// @route  api/items
// @desc   get all Items
// @access public
router.get('/', (req, res) => {
    Item.find().sort({date: -1})
        .then(items => res.json(items))
});

// @type   POST
// @route  api/items
// @desc   create post
// @access private
router.post('/', auth, (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        ower: req.body.ower,
        owee: req.body.owee,
        amount: req.body.amount
    });
    newItem.save().then(item => res.json(item));
});

// @type   DELETE
// @route  api/items/:id
// @desc   delete an item by id
// @access private
router.delete('/:id', auth, (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(()=> res.json({msg: 'deleted'})))
        .catch(Err => res.status(404).json({msg: 'failed'}));
});


module.exports = router;