const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { Schema } = mongoose;

const saltRounds = 10;

const userSchema = new Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 5
    },
    lastname: {
        type: String,
        maxLength: 50,
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

// 람다식 사용 시 this 사용 불가함
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    let user = this;
    let token = jwt.sign(user._id.toString(), process.env.JTW_TOKEN);
    
    user.tokenExp = moment().add(1, 'hour').valueOf();
    user.token = token;
    user.save((err, user) => {
        if (err) return cb(err);
        cb(null, user);
    })
};

userSchema.statics.findByToken = function (token, cb) {
    let user = this;
    jwt.verify(token, process.env.JTW_TOKEN, (err, decoded) => {
        user.findOne({ _id: decoded, token: token }, (err, user) => {
            if (err) return cb(err);

            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;