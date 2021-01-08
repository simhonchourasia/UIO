const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema ({
    name: {type: String, required: true},
    ower: {type: String, required: true},
    owee: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = Item = mongoose.model('item', ItemSchema);