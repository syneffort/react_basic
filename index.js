const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const User = require('./models/User');
const config = require('./config/key');

const app = express();
const port = 5000;


app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => {
    console.log('MongoDB connected...');
}).catch((error) => {
    console.error(`❗ ${error}`);
});

app.get('/', (req, res) => {
    res.send('Hello Node!');
});

app.post('/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`✔ Example app listening on port ${port}`);
});
