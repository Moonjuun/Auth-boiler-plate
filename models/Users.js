const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword : 암호화되지 않은 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
            cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken을 이용해서 토큰 생성하기
    var user = this;
    console.log('user._id', user._id);
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token;
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    }) 
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + '' = token;
    // 토큰을 복호화한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저아이디를 이용해서 유저를 찾은 다음 클라이언트에서 가져온 토큰과 DB의 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


// 이 스키마를 모델로 감싸줌 
const User = mongoose.model('User', userSchema) // {'모델의 이름', 스키마} 넣어주면 된다!!

module.exports = { User }