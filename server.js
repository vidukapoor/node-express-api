const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db_auth = `mongodb://localhost:27017/test_analytics`;
if (process.env.MONGO_USER) {
  db_auth = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@ds247670.mlab.com:47670/test_analytics`;
}
var db

// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
// MongoClient.connect('mongodb://YOUR_USERNAME:YOUR_PASSWORD@ds047955.mongolab.com:47955/star-wars-quotes', (err, database) => {
MongoClient.connect(db_auth, (err, database) => {
  if (err) return console.log(err)
  db = database.db('test_analytics')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.post('/create', (req, res) => {
  db.collection('analytics').save(req.body, (err, result) => {
    if (err) return res.json({ success: false, err });
    console.log('saved to database')
    res.json({ success: true });
  })
})

app.get('/fetch', (req, res) => {
  db.collection('analytics').find({},{sort:{_id:-1}}).toArray((err, result) => {
    if (err) return res.json({ success: false, err });
    res.json({ success: true, result });
  })
})
