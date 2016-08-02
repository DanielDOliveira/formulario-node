var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mysql = require('mysql');

var session;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions ({
    secret: '$(#$#BKbkG&#R&hjre_+0',
    resave: false,
    saveUninitialized: true
}))


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
            console.log('error. not connected');
        } else {
            console.log('connected');
        }
    })
}

function finishConnection(){
    connection.end(function(error) {
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if(!!error){
            console.log('error. not disconnected');
        } else {
            // The connection is terminated gracefully
            console.log('connected');
        }
    });
}


//definindo caminho / (index)
app.get('/', function(req, resp){
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    console.log("site acessado");
    resp.sendFile('./files/index.html', {root: __dirname});
});

//definindo caminho do arquivo javascript
app.get('/js/form.js', function(req, resp){
    resp.sendFile('./js/form.js', {root: __dirname});
});

//definindo caminho do arquivo css
app.get('/css/style.css', function(req, resp){
    resp.sendFile('./css/style.css', {root: __dirname});
});

//definindo acoes apos a 'submicao' do formulario
app.post('/login', function(req, resp) {
    //resp.end(JSON.stringfy(req.body));
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    
    var query = "SELECT senha FROM usuarios WHERE email = '" + req.body.email +"';";
    var senha;
    
    //startConnection(); // inicia conexao
    
    //executa query
    connection.query(query, function(error, rows, field){
        if(!!error){
            console.log('Erro na query');
            resp.redirect('/redirects');
            
        } else {
            console.log('query bem sucedida');
            console.log(rows);
            
            if(rows == []){
                console.log("vazioooooooo");
            }
            
            var string = JSON.stringify(rows); //transforma o resultado da pesquisa em string
            console.log(string.length);
            var json = JSON.parse(string); // transforma a string em objeto
            
            if(string.length == 2){
                senha = "";
                resp.redirect('/redirects');
            } else {
                senha = json[0].senha;
            }
            
            //verifica se uma senha associada ao email foi encontrada no DB
            if(senha !== ""){
                //verifica se a senha digitada confere com a encontrada no DB
                if(req.body.senha == senha){
                    session.uniqueID = req.body.email;
                    console.log(session.uniqueID);
                    resp.redirect('/perfil');
                } else {
                    console.log(senha);
                    console.log(req.body.senha);
                    resp.redirect('/redirects');
                }
            }
        }
    });

});

//definindo caminho /logout
app.get('/logout', function(req, resp){
    req.session.destroy(); // destroi sessao.
    console.log("sessao destruida");
    resp.redirect('/');
})

app.get('/perfil2.html', function(req, resp){
    resp.sendFile('./perfil2.html', {root: __dirname});
})

//definindo caminho /perfil
app.get('/perfil', function(req, resp){
    session = req.session;
    resp.sendFile('./perfil2.html', {root: __dirname});
/*    resp.send("<iframe src = '/perfil2.html' height = '100%' width = '100%' "
        + "position = 'relative' top = '-30px'>  </iframe>"
        + "<h1> "+ session.UniqueID +"</h1>"
    );*/
    
/*    resp.send( "<h1> "+ session.UniqueID +"</h1>" + "<script type='text/javascript' src='/js/form.js'></script>"
        + "<script type = 'text/javascript'> createForm(); </script>"
        + "<link type = 'text/css' rel = 'stylesheet' href = '/css/style.css' />"
    );
    */
})

//definindo caminho para /cadastrar
app.post('/cadastrar', function(req, resp){

    //query
    var query;
    query = "INSERT INTO usuarios (nome, email, senha) VALUES ('";
    query += req.body.nome + "', '" + req.body.email + "', '" + req.body.senha + "');";
    console.log(query);
    
    connection.query(query, function(error, rows, field){
        if(!!error){
            console.log('Erro na query');
        } else {
            console.log('query bem sucedida');
            console.log(rows);
            session = req.session;
            resp.redirect('/');
        }
    });
    
})

//definindo caminho /redirects
app.get('/redirects', function(req, resp) {
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/perfil');
        console.log(session);
    } else {
        resp.end('Erro ao tentar entrar no perfil. Usuario nao logado!');
    }
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Listening at port "+process.env.PORT);
});