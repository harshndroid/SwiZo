var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

// clientId: 58104468056-qd9kkj04fv1125i2huas3tg14b8os1bf.apps.googleusercontent.com
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'major_project_database'
});

con.connect(function(err) {
    if (err) {
        return console.error('connection error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("server running on ", PORT)
});

app.get('/', function (req, res) {
  res.send('Hello APIs!');
});


app.post('/login', function(req, res) {
    console.log('/login');
    if(req.body.user_phoneNumber !== 0){
        con.query("SELECT COUNT(*) AS cnt FROM users WHERE user_phoneNumber = ? " , req.body.user_phoneNumber, function(err , data){
            if(err){
                console.log("/set_user",err);
            }   
            else{
                if(data[0].cnt > 0){
                      console.log("Already exists");
                      con.query('UPDATE users SET user_address = ? WHERE user_phoneNumber = ?', ([req.body.user_address, req.body.user_phoneNumber]), (e,rows,fields)=>{
                          if(e) console.log("/set_user",e);
                          else{
                              con.query("Select * from users where user_phoneNumber = ?", req.body.user_phoneNumber, (e, rows, fields)=>{
                                  if(e) console.log("/set_user",e);
                                  else{
                                      console.log(rows);
                                      res.send(rows);
                                  }
                              });
                          }
                      })
                }else{
                    con.query("INSERT into users (user_name, user_phoneNumber, user_address) VALUES ('"+req.body.user_name+"', '"+req.body.user_phoneNumber+"', '"+req.body.user_address+"')", function(err, rows,fields){
                        if (err) throw err;
                        else{
                            con.query("Select * from users where user_phoneNumber = ?", req.body.user_phoneNumber, (e, rows, fields)=>{
                                if(e) console.log("/set_user",e);
                                else{
                                    console.log(rows);
                                    res.send(rows);
                                }
                            });
                        };                                    
                    });
                }
            }
        })
    }
});

app.post('/set_user', function(req, res) {
    console.log('/set_user');
    if(req.body.user_phoneNumber !== 0){
        con.query("SELECT COUNT(*) AS cnt FROM users WHERE user_phoneNumber = ? " , req.body.user_phoneNumber, function(err , data){
            if(err){
                console.log("/set_user",err);
            }   
            else{
                if(data[0].cnt > 0){
                      console.log("Already exists");
                      con.query("Select * from users where user_phoneNumber = ?", req.body.user_phoneNumber, (e, rows, fields)=>{
                          if(e) console.log("/set_user",e);
                          else{
                              console.log(rows);
                              res.send(rows);
                          }
                      });
                }else{
                    con.query("INSERT into users (user_name, user_phoneNumber, user_address) VALUES ('"+req.body.user_name+"', '"+req.body.user_phoneNumber+"', '"+req.body.user_address+"')", function(err, rows,fields){
                        if (err) throw err;
                        else{
                            con.query("Select * from users where user_phoneNumber = ?", req.body.user_phoneNumber, (e, rows, fields)=>{
                                if(e) console.log("/set_user",e);
                                else{
                                    console.log(rows);
                                    res.send(rows);
                                }
                            });
                        };                                    
                    });
                }
            }
        })
    }
});

app.get('/get_restaurants', (req, res)=>{
    console.log('/get_restaurants');
    con.query("Select * from restaurants", (e, rows, fields)=>{
        if(e) console.log("/get_restaurants",e);
        res.send(rows);
    })
});

app.get('/get_categories', (req, res)=>{
    console.log('/get_categories');
    con.query("Select * from categories", (e, rows, fields)=>{
        if(e) console.log("/get_categories",e);
        res.send(rows);
    })
});

app.post('/get_items', (req, res)=>{
    console.log('/get_items');
    con.query("Select * from items where restaurant_id = ?", req.body.restaurant_id, (e, rows, fields)=>{
        if(e) console.log("/get_items",e);
        res.send(rows);
    })
});

app.post('/get_items_by_categories', (req, res)=>{
    console.log('/get_items_by_categories');
    con.query("Select * from items where category_id = ?", req.body.category_id, (e, rows, fields)=>{
        if(e) console.log("/get_items_by_categories",e);
        res.send(rows);
    })
});
app.post('/edit_user_details', function(req, res) {
    console.log('/edit_user_details');
    con.query('UPDATE users SET user_name = ?, user_phoneNumber = ?, user_address = ? WHERE user_id = ?', ([req.body.user_name, req.body.user_phoneNumber, req.body.user_address, req.body.user_id]), (e,rows,fields)=>{
        if(e) console.log("/edit_user_details",e);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
});
app.post('/place_order', function(req, res) {
    console.log('/place_order');
    con.query(" INSERT into orders (order_id, order_title, user_id, restaurant_id) VALUES ('"+req.body.order_id+"', '"+req.body.order_title+"', '"+req.body.user_id+"', '"+req.body.restaurant_id+"') ", (e,rows,fields)=>{
        if(e) console.log("/place_order",e);
        else{
            con.query("Select * from orders where user_id = ?", req.body.user_id, (e,rows,fields)=>{
                if(e){
                    console.log("place_order*", e);
                }
                else{
                    res.send(rows);
                    console.log("here", rows);
                }
            });
        }
    })
});