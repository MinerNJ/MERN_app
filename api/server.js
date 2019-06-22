const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//Creating MongoDB database
const dbRoute = 
    'mongodb+srv://njminer:Assaultman0351%40@cluster0-1uvfp.mongodb.net/test?retryWrites=true&w=majority';

//connects back end to database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => (
    'connected to the database'
));

//checks if connection is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//get method for all data in database
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err});
        return res.json({ succes: true, data: data});
    });
});

//update method for data in db
router.post('/updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ succes: true });
    });
});

//delete method for db
router.delete('/deleteData', (req, res) => {
    const { id } = req.body;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.end(err);
        return res.json({ success: true });
    });
});

//create method for db
router.post('/putData', (req, res) => {
    let data = new Data();
    const { id, message } = req.body;
    if ((!id && id !== 0) || !message){
        return res.json({
            succes: false, 
            error: 'INVALID INPUTS',
        });
    }
    data.message = message;
    data.id = id;
    data.save((err) => {
        if (err) return res.json({ succes: false, error: err});
        return res.json({ success: true });
    });
});

//appending api for http requests
app.use('/api', router);

//launches backend into port
app.listen(API_PORT, () => console.log(
    `
        LISTENING ON PORT ${API_PORT}
`
));