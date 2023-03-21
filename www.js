const express = require("express");
const ejs = require("ejs");
const app = express();
const routes = require("./routes/routes.js");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileUpload = require('express-fileupload');


let db;

function openDB() {
    var sqlite = require('sqlite3').verbose();
    db = new sqlite.Database('./database/database.db', function (err) {
        if (err) {
            throw (err);
        } else {
            routes.setDB(db); 
        }
    });
}

openDB();




app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'hrw_torgan22',
    cookie: {
        maxAge: 3600000,
        sameSite: true,

    }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
 
 app.get('/', routes.index);
 //Muss noch gebaut werden:
 app.post('/newCollection', routes.newCollection);
 app.post('/deleteCollection', routes.deleteCollection);
 app.post('/addToCollection', routes.addToCollection);
 app.post('/collectiondetails', routes.collectiondetails);
 app.post('/allquestions', routes.allquestions);
 app.post('/deleteFromCollection', routes.deleteFromCollection);
 
 app.post('/addTagQ', routes.addTagQ);
 app.post('/deleteTagQ', routes.deleteTagQ);
 app.post('/deleteQuestion', routes.deleteQuestion);
 
 app.post('/addTagQMultiple', routes.addTagQMultiple);
 app.post('/deleteTagQMultiple', routes.deleteTagQMultiple);
 
 app.post('/addTagC', routes.addTagC);
 app.post('/deleteTagC', routes.deleteTagC);
 
 app.post('/import', routes.import);
 app.post('/export', routes.export);

 
 
 app.listen(4000); // http://18.210.108.32:8080/