const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();

const User = require('./models/User');
const config = require('./config/key');
const auth = require('./middleware/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(cookieParser());

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

app.get('/api/hello', (req, res) => {
    res.send('Hello React!')
});

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

app.post('/api/users/login', (req, res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log(err, user);
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '이메일에 해당하는 사용자가 없습니다.',
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: '잘못된 비밀번호입니다.'});

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            });
        });
    });
});

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token : "" }, (err, user) => {
        if (err) return res.json({ success: false, err });

        return res.status(200).send({ success: true });
    });
});

const port = 5000;

app.listen(port, () => {
    console.log(`✔ Example app listening on port ${port}`);
});
