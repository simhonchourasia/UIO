const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const items = require('./routes/api/items');
const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const config = require('config');

const app = express();

// middleware
app.use(express.json());

// config
const db = config.get('mongoURI');

// connect
mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true})
    .then(()=>console.log('MongoDB Activated'))
    .catch(err => console.log(err));

// routes
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth', auth);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (Req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server activated on port ${port}`);
});