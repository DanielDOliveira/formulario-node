var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

console.log(process.env.IP);
console.log(parseInt(process.env.PORT));


var connection = mysql.createConnection({
    //propriedades...
    host: process.env.IP,
    user: 'root',
    password: '',
    database: 'c9'
})

function startConnection(){
    connection.connect(function(error){
        if(!!error){
            console.log('error');
        } else {
            console.log('connected');
        }
    })
}
    
app.get('/', function(req, resp){
    //query
    connection.query("SELECT * FROM usuarios", function(error, rows, fields){
        if(!!error){
            console.log('Erro na query');
        } else {
            console.log('query bem sucedida');
            console.log(rows);
            resp.send("query executada");
        }
    });
})

app.listen(parseInt(process.env.PORT), process.env.IP);
    
/*    connection.end(function(error) {
      // The connection is terminated gracefully
      // Ensures all previously enqueued queries are still
      // before sending a COM_QUIT packet to the MySQL server.
    });*/

