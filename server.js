'use strict'
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const { json } = require('express');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT;
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.use(express.static('./public/css'));
app.use(express.static('./public/js'));

app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

app.get('/', homeHandler);
app.post('/add', addHandler);
app.get('/fav', favHandler);
app.get('/random-jokes', randomHandler);
app.get('/joke/:jokeID', detailsHandler);
app.put('/joke/update/:jokeID', updateHandler);
app.delete('/joke/delete/:jokeID',deleteHandler);


function homeHandler(req, res) {
    let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';
    superagent.get(url)
        .then((data) => {
            res.render('pages/index', { jokesArr: JSON.parse(data.text) })
        });

}
function randomHandler(rewq,res){
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url)
        .then((data) => {
            console.log(JSON.parse(data.text)[0] );
            res.render('pages/random', { jokeObj: JSON.parse(data.text)[0] });
        });

}

function addHandler(req, res) {
    let { type, setup, punchline } = req.body
    let values = [type, setup, punchline];
    let SQL = `INSERT INTO jokes (type, setup, punchline) VALUES ($1,$2,$3);`;
    client.query(SQL, values)
        .then(()=>{
            res.redirect('/fav');
        });

}
function favHandler (req,res){
    let SQL =`SELECT * FROM jokes`;
    client.query(SQL)
    .then((data)=>{
        res.render('pages/fav',{jokesArr:data.rows});
    });

}
function detailsHandler(req,res){
    let SQL =`SELECT * FROM jokes WHERE id=${req.params.jokeID}`;
    client.query(SQL)
    .then((data)=>{
        console.log(data.rows[0]);
        res.render('pages/joke',{jokesObj:data.rows[0]});
    });
}
function deleteHandler (req,res){
    let SQL = `DELETE FROM jokes WHERE id=${req.params.jokeID};`;
    client.query(SQL)
        .then(()=>{
            res.redirect('/fav');
        });

}
function updateHandler (req,res){
    let { type, setup, punchline } = req.body
    let values = [type, setup, punchline];
    let SQL = `UPDATE jokes SET type = $1, setup=$2,  punchline= $3  WHERE id=${req.params.jokeID};`;
    client.query(SQL,values)
        .then(()=>{
            res.redirect(`/joke/${req.params.jokeID}`);
        });

}
client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`listening on port ${PORT}`));
    });