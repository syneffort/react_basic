const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = mongoose.Schema({
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
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;