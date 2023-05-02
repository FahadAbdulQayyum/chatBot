const express = require('express')
const cors = require('cors')
const config = require('config')
const request = require('request')
const app = express()
const PORT = 3001 || process.env.PORT

const bodyParser = require('body-parser')

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(bodyParser.json())

app.use(cors())

const PRODUCT_ID = config.get('product_id') //"727deede-5404-4182-bfea-8a15f5a4281a"
const PHONE_ID = config.get('phone_id') //"28602"
const TOKEN_ID = config.get('token_id') //"c75d7a86-8a08-4202-b8da-ca93df9363d5"

app.get('/', (req, res) => {
    res.send(`Home:`)
})

app.post('/userMsg', (req, res) => {
    let url = `https://api.maytapi.com/api/${PRODUCT_ID}/${PHONE_ID}/sendMessage`;
    let data = {
        to_number: req.body.to_number,
        message: req.body.message,
        type: req.body.type,
        prev: req.body.prev
    };
    let ress = request({
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-maytapi-key": TOKEN_ID
        },
        json: data
    });

    if (JSON.parse(ress.body).message === 'Hi' || JSON.parse(ress.body).message === 'Hello' || JSON.parse(ress.body).message === 'hi' || JSON.parse(ress.body).message === 'hello' || JSON.parse(ress.body).message === 'hey' || JSON.parse(ress.body).message === 'Hey') {
        console.log('hi reply')
        return res.json({
            "reply": "hi, welcome to TechOn. How may we help you today?\n1. Customer Support\n2. Sales"
        })
    }
    if (JSON.parse(ress.body).message === '1' && (JSON.parse(ress.body).prev === 'hi, welcome to TechOn. How may we help you today?\n1. Customer Support\n2. Sales r')) {
        console.log("we'll connect.")
        return res.json({ "reply": "we'll connect you to support shortly." })
    }
    if (JSON.parse(ress.body).message === '2' && (JSON.parse(ress.body).prev === 'hi, welcome to TechOn. How may we help you today?\n1. Customer Support\n2. Sales r' || JSON.parse(ress.body).prev === '1')) {
        console.log('check 2: ', JSON.parse(ress.body).prev);
        console.log('sales will reach... No')
        return res.json({
            "reply": "sales will reach out to you.\nis there anything else i can do for you?\n1. Yes\n2. No"
        })
    }
    if (JSON.parse(ress.body).message === '1' && (JSON.parse(ress.body).prev === 'sales will reach out to you.\nis there anything else i can do for you?\n1. Yes\n2. No r' || JSON.parse(ress.body).prev === "we'll connect you to support shortly. r" || JSON.parse(ress.body).prev === "hi, welcome to TechOn. How may we help you today? 1. Customer Support 2. Sales r")) {
        console.log('check', JSON.parse(ress.body).prev);
        console.log('please type...')
        return res.json({ "reply": "please type your query." })
    }

    if (JSON.parse(ress.body).message === '2' && (JSON.parse(ress.body).prev === "hi, welcome to TechOn. How may we help you today? 1. Customer Support 2. Sales r" || JSON.parse(ress.body).prev === "sales will reach out to you.\nis there anything else i can do for you?\n1. Yes\n2. No r")) {
        console.log('check', JSON.parse(ress.body).prev);
        console.log('thanks for ...')
        return res.json({
            "reply": "thanks for your time."
        })
    }
    else {
        console.log('check', JSON.parse(ress.body).prev);
        console.log('final else')
        return res.json({ "reply": "thanks we'll look into it." })
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})