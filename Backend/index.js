require('dotenv').config();
const express = require('express');
const cors = require('cors');

const defaultRoutes = require('./routes/index.js');

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());

app.use('/static', express.static('public'))

app.use('/', defaultRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Server is up and running")
})

app.listen(port, () => {
    console.log("listening to localhost:" + port);
})