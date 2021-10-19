if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const QRCode = require('qrcode');
const path = require('path');
const mongoose = require('mongoose')
const PersonDetails = require('./model/userSchema.js');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/qrcode';

mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    res.render('home')
})

app.post('/details', async (req, res) => {
    const Data = req.body.data;

    const per = await new PersonDetails(Data);
    await per.save();
    if (Data.length === 0) {
        res.send('No Data Found');
    }
    const qr = `https://desolate-garden-33008.herokuapp.com/details/${per._id}`;
    QRCode.toDataURL(qr,(err, url) => {
        if (err) {
            res.send("Error occured");
        }
        res.render('qrcode',{url})
    })

});

app.get('/details/:id', async (req, res) => {
    const { id } = req.params;
    const per = await PersonDetails.findById(id)
    if (per) {
        return res.render('scan', { per })
    }
    res.send('no data found')

})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serving port ${port}`)
})