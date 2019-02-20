require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const firebase = require('firebase');

// Initialize Firebase
const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECTID,
    storageBucket: "",
    messagingSenderId: process.env.MSG_SENDER_ID
};

firebase.initializeApp(config);
const db = firebase.firestore();

app.get('/', function (req, res) {
    res.send(`RoboMatch Backend`)
});

app.get('/users', async function (req, res) {
    let users = []

    await db.collection('leaderboard').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            users.push(doc.data().name)
        });
    })
    res.json(users)
})

app.get('/view', async function (req, res) {
console.log(req.query)
    let sort = [req.query.field, req.query.order]
    let results = []

    await db.collection('leaderboard').orderBy(sort[0], sort[1]).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            results.push(doc.data())
        });
    })

    res.json(results)
    console.log(results)
});

app.post('/submit', function (req, res) {
    const name = req.body.name;
    const clicks = req.body.clicks;
    const time = req.body.time
    const mode = req.body.mode
    const cards = req.body.cards
    const target = req.body.target
    const score = req.body.score

    db.collection('leaderboard').add({
        name: name,
        clicks: parseInt(clicks, 10),
        time: parseInt(time, 10),
        mode: mode,
        cards: parseInt(cards, 10),
        target: parseInt(target, 10),
        score: parseInt(score, 10)
    }).then(
        res.end("success")
    )
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))