const express = require("express")

const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');

const cors = require('cors')
const pool = require('./db')

const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())


app.use('/restaurantmanager', require('./routes/resmanager'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serer started on port ${PORT}`));
