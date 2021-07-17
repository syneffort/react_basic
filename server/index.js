const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

dotenv.config();

const User = require('./models/User');
const config = require('./config/key');
const auth = require('./middleware/auth');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => {
    console.log('✅ MongoDB connected...');
}).catch((error) => {
    console.error(`❗ ${error}`);
});

const app = express();
app.set('port', process.env.PORT || 5000);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

app.use('/api/users', require('./routes/users'));

app.listen(app.get('port'), () => {
    console.log(`✔ Example app listening on port ${app.get('port')}`);
});
