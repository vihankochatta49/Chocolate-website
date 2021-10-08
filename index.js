var express = require('express')
var path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const validator = require('validator')
const { stringify } = require('querystring')
var app = express()
var port = 4200

app.set('view engine', 'hbs')

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const logSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please write in correct format!')
            }
        }
    },
    pass: {
        type: String,
        required: true,
        unique: true,
    }
})

mongoose.connect('mongodb://localhost:27017/cw')
    .then(() => console.log('connection successful...'))
    .catch(err => console.log(err));

app.use('/send', require(path.join(__dirname, 'routes/cwfeed.js')))

app.get('/', (req, res) => (
    res.render('index', { name: 'Feedback', message: 'Sign-in' })
))

app.get('/love', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/messages.html'))
})

app.post('/login', urlencodedParser, (req, res) => {

    const Log = new mongoose.model('Log', logSchema);

    const createDocs = async () => {
        try {
            const apprecs = new Log({
                'Email': req.body.email,
                'pass': req.body.pass
            })

            const login = await Log.insertMany([apprecs])
            console.log(login)
            res.render('index', {
                message: "Welcome!",
                name: 'Feedback'
            })
        } catch (err) {
            console.log(err)
        }
    }
    createDocs();
})

app.listen(port, () => { console.log(`App listening at: http://localhost:${port}`) })
