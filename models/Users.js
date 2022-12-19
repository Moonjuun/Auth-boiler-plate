const mongoose = require('mongoose')

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

// 이 스키마를 모델로 감싸줌 
const User = mongoose.model('User', userSchema) // {'모델의 이름', 스키마} 넣어주면 된다!!

module.export = { User }