const express = require('express') // express 모듈을 가져온다
const app = express() // express 함수를 이용해서 새로운 app을 만든다
const port = 3000 // 포트는 아무거나 해도 된다!

const bodyParser = require('body-parser');
const { User } = require("./models/Users");
const config = require("./config/key");
const cookeParser = require('cookie-parser');
const { auth } = require("./middleware/auth");

// application/x-www-form-urlencoded 이런 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입으로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookeParser());

const mongoose = require('mongoose') // 몽고디비를 편하게 이용하게 해주는 툴인 몽고구스를 통해 몽고디비와 연결
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!!!'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello!! 나의 첫 node.js 프로젝트!! 넌 할 수 있어 더 올라가자!!')
})

// 회원가입
app.post('/api/users/register', (req, res) => {
    //회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다
    const user = new User(req.body)

    // 몽고DB에서 오는 데이터를 세이브
    user.save((err, userInfo) => {
        if(err) return res,json({ success: false, err})
        return res.status(200).json({ 
            success: true
        })
    })
})

// 로그인
app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 DB에 있는지 찾는다, findOne() 몽고디비에서 제공하는 메서드
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false, 
                message: "아이디와 비밀번호를 확인해주세요!"
            })
        }
        // 요청된 이메일이 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "아이디와 비밀번호를 확인해주세요!" })
    
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
    
                // 토큰을 저장한다. 쿠키, 로컬스토리지 등등에 저장할 수 있다
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
    // 맞다면 그 유저의 토큰 생성
})

// 토큰을 이용한 인증
app.get('/api/users/auth', auth, (req, res) => {
    
    // 여기까지 미들웨어(auth.js)에서 통과해 왔다는 것은 Authentication이 true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, // role이 0 이면 일반 유저 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image:req.user.image
    })
})

// 로그아웃 기능
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        { token: ""},
        (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port, () => { // 포트 3000번을 참조해서 app을 실행
  console.log(`Example app listening on port ${port}`) // app 3000번 포트에 listen이 되면 콘솔로그가 찍힘
})