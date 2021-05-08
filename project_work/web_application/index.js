const express = require("express")

const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('./db')

const path = require('path')

const app = express()
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.json())

app.use(express.static("client/build"))

// process.env.NODE_ENC => production or undefined
if(process.env.NODE_ENV === "production"){
    // server static content
    // npm run build
    app.use(express.static(path.join(__dirname, "client/build")))
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use('/restaurantmanager', require('./routes/resmanager'));
app.use('/waiter', require('./routes/waiter'));
app.use('/inventorymanager', require('./routes/invmanager'))
app.use('/kitchenpersonnel', require('./routes/kitchenpersonnel'))

// catch all method
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build/index.html"))
// })

// process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serer started on port ${PORT}`));
