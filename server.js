require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'Kylie',
    title: 'Post 1'
  },
  {
    username: 'Ivan',
    title: 'Post 2'
  },
  {
      username: 'Michael',
      title: "Post 3"
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
  const username = req.body.username
  const user = {name: username}
  const accessKey = jwt.sign(user, process.env.ACCESS_KEY)
  res.json({accessKey: accessKey})
})

const authenticateToken = (req, res, next) => {
  const authHeaders = req.headers['authorization']
  const token = authHeaders && authHeaders.split('')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(3000)