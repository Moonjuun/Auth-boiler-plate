const express = require('express') // express 모듈을 가져온다
const app = express() // express 함수를 이용해서 새로운 app을 만든다
const port = 3000 // 포트는 아무거나 해도 된다!

const mongoose = require('mongoose') // 몽고디비를 편하게 이용하게 해주는 툴인 몽고구스를 통해 몽고디비와 연결
mongoose.connect('mongodb+srv://moonjun:12qwaszx@boiler-plate.6wp0rs0.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected!!!'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello!! 나의 첫 노드 프로젝트!!')
})

app.listen(port, () => { // 포트 3000번을 참조해서 app을 실행
  console.log(`Example app listening on port ${port}`) // app 3000번 포트에 listen이 되면 콘솔로그가 찍힘
})