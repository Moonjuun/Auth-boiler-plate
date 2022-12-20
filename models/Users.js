const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 몽고디비에서 모델은 테이블, 스키마는 컬럼으로 이해하자

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlenth: 15
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;


    if(user.isModified('password')) { // 유저가 암호를 변경할 때만 암호화
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash;
                next();
                // hash는 암호화 된 비밀번호
            });
        });    
    } else {
        next()
    }
})

// 이 스키마를 모델로 감싸줌 
const User = mongoose.model('User', userSchema) // {'모델의 이름', 스키마} 넣어주면 된다!!

module.exports = { User }