'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hi I\'m a chatbot')
})

let token = 'EAAEkRmhxv1YBANhcYZBNkpUZBS2S78aLTNjkCNKtDL2yuYlVi2kkcXJTRkTdEtKJrZA377L6cAon2YRh7DeoD4XcMehZBkCWjwSjA0ufY1glTiOSkcF1MuPj1BZC0SwMSSK4tIGCEwCn0QwD6AH1S2ZAxCulFZArUrhF9UoWXr7dgZDZD'

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'ch4tb0t') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendText(sender, 'Ch4tB0t answers: ' + text)
        }
    }
    res.sendStatus(200)
})

function sendText(sender, text) {
    let messageData = { text: text }
    request({
        url: 'https://graph.facebook.com/v2.8/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log('sending error')
        } else if (response.body.error){
            console.log('reponse body error')
        }
    })
}

app.listen(app.get('port'), function () {
    console.log('running: port')
})