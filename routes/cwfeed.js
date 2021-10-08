var express = require('express')
var path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var router = express.Router();
var app = express()

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const schema = new mongoose.Schema({
    Feedback: String
})


router.post('/', urlencodedParser, (req, res) => {

    const Feedback = new mongoose.model('Feedback', schema);

    const createDoc = async () => {
        try {
            const apprec = new Feedback({
                'Feedback': req.body.feed
            })

            const feedback = await Feedback.insertMany([apprec])
            console.log(feedback)
            res.render('index', { name: 'Thanks!', message: 'sign-in' })
        } catch (err) {
            console.log(err)
        }
    }
    createDoc();
})

module.exports = router
