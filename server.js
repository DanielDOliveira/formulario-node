var express = require('express');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mysql = require('mysql');
var app = express();
var session;

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

// funcao para inserir um caractere no meio de uma string
function splice(string, index, addition ){
  return string.slice(0, index) + (addition || "") + string.slice(index, string.length);
}

// funcao para tratar strings evitando injeções de sql
function sanitize(s){
    var i;
    
    var conditionA;
    var conditionB;
    
    for (i = 0; i < s.length; i++){
        
        conditionA = (s[i] == "'" || s[i] == ";") && (s[i-1] != String.fromCharCode(92));
        conditionB = s[i] == "-" && s[i+1] == "-" && s[i-1] != String.fromCharCode(92);
        
        if(conditionA || conditionB){
            s = splice(s, i, String.fromCharCode(92)); //adicionando barra invertida
            i++;
        }
    }
    return s;
}

// gera uma string com um script js com o intuito de
// passar dados do lado do servidor para variaveis javascript do browser.
function generateUpdateScript(values, checkboxLabels, user){
    var script = "<script type ='text/javascript'>";
    var labels = ["nome", "email", "senha"];
    var i;
    
    for (i = 0; i < values.length; i++){
        if(i < 3){
            script += "values.push('" + sanitize(values[i]) + "');"
        } else {
            script += "values.push(" + values[i] + ");";
        }
        console.log(values[i]);
    }
    
    for(i = 0; i < checkboxLabels.length; i++){
        script += "checkboxLabels.push('" + checkboxLabels[i] + "');";
    }
    script += "createTopMenu('"+ user +"');";
    script += "createUpdateForm();";
    script += "</script>";
    
    return script;
}

function generateMessageScript(message, redirect){
    var script = "<script type='text/javascript'>alert('"+ message +"');"
            + "window.location='"+ redirect +"';</script> <noscript>Se não for direcionado automaticamente,"
            + "clique <a href='"+ redirect +"'>aqui</a>.</noscript>";
    return script;    
}

//definindo caminho / (index)
app.get('/', function(req, resp){
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    console.log("site acessado");
    resp.sendFile('./html/index.html', {root: __dirname});
});

//definindo caminho /pos-update
app.get('/pos-update', function(req, resp){
    var message = "Dados atualizados!";
    var send = generateMessageScript(message, "/perfil");
    resp.send(send);
})

//definindo caminho /bad-login
app.get('/bad-login', function(req, resp){
    var message = "Email ou senha incorretos! Tente novamente.";
    var send = generateMessageScript(message, "/");
    resp.send(send);
})

//definindo caminho /not-logged
app.get('/not-logged', function(req, resp){
    var message = "Acesso não autorizado! Usuário não logado. Por favor entre na sua conta!";
    var send = generateMessageScript(message, "/");
    resp.send(send);
})

//definindo caminho /not-logged
app.get('/erro-cadastro', function(req, resp){
    var message = "Os campos nome, email e senha são obrigatórios! Preencha-os por favor.";
    var send = generateMessageScript(message, "/");
    resp.send(send);
})

//definindo caminho /not-logged
app.get('/cadastro-efetuado', function(req, resp){
    var message = "Cadastro efetuado com sucesso!";
    var send = generateMessageScript(message, "/perfil");
    resp.send(send);
})

//definindo caminho /logout
app.get('/logout', function(req, resp){
    req.session.destroy(); // destroi sessao.
    var message = "Você saiu de sua conta.";
    var send = generateMessageScript(message, "/");
    resp.send(send);
})

//definindo caminho do arquivo javascript
app.get('/js/form.js', function(req, resp){
    resp.sendFile('./js/form.js', {root: __dirname});
});

//definindo caminho do arquivo css
app.get('/css/style.css', function(req, resp){
    resp.sendFile('./css/style.css', {root: __dirname});
});

//definindo caminho do arquivo de imagem de background
app.get('/img/background-image.jpg', function(req, resp){
    resp.sendFile('./img/background-image.jpg', {root: __dirname});
});

//definindo acoes apos a 'submicao' do formulario
app.post('/login', function(req, resp) {
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/redirects');
    }
    
    var email = sanitize(req.body.email);
    var query = "SELECT senha FROM usuarios WHERE email = '" + email +"';";
    var senha;
    
    //executa query
    connection.query(query, function(error, rows, field){
        if(!!error){
            console.log('Erro na query' + query);
            resp.redirect('/redirects');
            
        } else {
            console.log('query bem sucedida');
            console.log(rows[0]);
            
            var string = JSON.stringify(rows); //transforma o resultado da pesquisa em string
            console.log(string.length);
            var json = JSON.parse(string); // transforma a string em objeto
            
            if(string.length == 2){
                senha = "";
                resp.redirect('/bad-login');
            } else {
                senha = json[0].senha;
            }
            
            //verifica se uma senha associada ao email foi encontrada no DB
            if(senha !== ""){
                //verifica se a senha digitada confere com a encontrada no DB
                if(sanitize(req.body.senha) == senha){
                    session.uniqueID = req.body.email; // define session.uniqueId
                    console.log(session.uniqueID);
                    resp.redirect('/perfil');
                } else {
                    console.log(senha);
                    console.log(req.body.senha);
                    resp.redirect('/bad-login');
                }
            }
        }
    });

});

//definindo caminho para /cadastrar
app.post('/cadastrar', function(req, resp){
    //queries
    var insertAlergiasQuery = "INSERT INTO alergias (amendoin, camarão) VALUES (0, 0)";
    
    var nome = sanitize(req.body.nome);
    var email = sanitize(req.body.email);
    var senha = sanitize(req.body.senha);
    
    if(nome == "" || email == "" || senha == ""){
        resp.redirect('/erro-cadastro');
    } else {
        //inserindo uma linha na tabela alergias.
        connection.query(insertAlergiasQuery, function(error, rows, field){
            if(!!error){
                console.log('Erro na query - ' + insertAlergiasQuery);
            } else {
                console.log('query executada');
                console.log(rows);
                var insertId = rows.insertId;
                
                var insertUsuarioQuery = "INSERT INTO usuarios (nome, email, senha, idAlergias) VALUES ('"
                    + nome + "', '" + email + "', '" + senha + "', '"
                    + insertId + "');";
                
                //inserindo uma linha na tabela usuarios
                connection.query(insertUsuarioQuery, function(error, rows, field){
                    if(!!error){
                        console.log('Erro na query - ' + insertUsuarioQuery);
                    } else {
                        console.log('query bem sucedida');
                        console.log(rows);
                        session = req.session;
                        session.uniqueID = email;
                        resp.redirect('/cadastro-efetuado');
                    }
                });
            }
        });
    }
})


//definindo caminho /update
app.post('/update', function(req, resp) {
    //resp.end(JSON.stringfy(req.body));
    session = req.session;
    
    var nome = sanitize(req.body.nome);
    var email = sanitize(req.body.email);
    var senha = sanitize(req.body.senha);
    
    var selectColunasQuery  = "SELECT column_name FROM information_schema.columns WHERE table_name LIKE 'alergias'";
    var updateUsuarioQuery = "UPDATE usuarios SET nome = '"+nome+"', email = '"
            + email + "', senha = '" +senha + "' WHERE id = ";
    var updateAlergiasQuery = "UPDATE alergias SET ";
    var selectUsuarioQuery = "SELECT id, idAlergias FROM usuarios WHERE email = '" + sanitize(session.uniqueID) +"';";
    var colunasAlergias = [];
    var idUsuario;
    var idAlergia;
    var i;
    
    /*
        selecionar idAlergia de usuario - nenhum requisito. (primeiro)
        atualizar usuario - nenhum requisito (deve ocorrer por ultimo)
        atualizar alergias - colunas, idAlergias.
        selecionar colunas - nenhum requisito.
    */
    
    //executa query para selecao de idAlergias em usuarios
    connection.query(selectUsuarioQuery, function(error, rows, field){
        if(!!error){
            console.log('Erro na query - ' + selectUsuarioQuery);
            resp.redirect('/redirects');
            
        } else {
            console.log('query bem sucedida');
            console.log(rows[0]);
            idAlergia = rows[0].idAlergias;
            idUsuario = rows[0].id;
            
            updateUsuarioQuery += idUsuario;
            
            //executa query para atualizar os dados do usuario
            connection.query(updateUsuarioQuery, function(error, rows, field){
                if(!!error){
                    console.log('Erro na query - ' + updateUsuarioQuery);
                    resp.redirect('/redirects');
                    
                } else {
                    console.log('query bem sucedida');
                    console.log(rows);
                    
                }
            });
            
            
            //executa query para atualizar as colunas da tabela alergias
            connection.query(selectColunasQuery, function(error, rows, field){
                if(!!error){
                    console.log('Erro na query' + selectColunasQuery);
                    resp.redirect('/redirects');
                    
                } else {
                    console.log('query bem sucedida');
                    console.log(rows);
                    
                    for(i = 1; i < rows.length; i++){
                        colunasAlergias.push(rows[i].column_name);
                        console.log(colunasAlergias[i]);
                    }
                    
                    // gerando a query de update da tabela alergias dinamicamente.
                    for(i = 0; i < colunasAlergias.length; i++){
                        updateAlergiasQuery += colunasAlergias[i] + " = " 
                                + (req.body[colunasAlergias[i]] ? 1 : 0);
                        if (i < colunasAlergias.length-1){
                           updateAlergiasQuery += ", "; 
                        }
                    }
                    updateAlergiasQuery += " WHERE id = " + idAlergia;
                    
                    //executa query para atualizar os dados da tabela alergias
                    connection.query(updateAlergiasQuery, function(error, rows, field){
                        if(!!error){
                            console.log('Erro na query - ' + updateAlergiasQuery);
                            resp.redirect('/redirects');
                            
                        } else {
                            console.log('query bem sucedida');
                            console.log(rows);
                            
                            resp.redirect("/pos-update"); // redireciona pagina
                            
                        }
                    });
                    
                }
            });
        }
    });

});

//definindo caminho /perfil
app.get('/perfil', function(req, resp){
    session = req.session;
    
    var email = sanitize(session.uniqueID);
    
    if(!session.uniqueID){
        resp.redirect('/redirects');
        
    } else {
        var selectColunasQuery = "SELECT column_name FROM information_schema.columns WHERE table_name LIKE 'alergias'";
        var selectUsuarioQuery = "SELECT nome, email, senha, idAlergias FROM usuarios WHERE email = '" + email + "'";
        var selectAlergiasQuery = "SELECT * FROM alergias WHERE id = ";
        var checkboxLabels = [];
        var values = [];
        var idAlergia;
        var i;
        
        //pesquisando os dados da tabela usuarios
        connection.query(selectUsuarioQuery, function(error, rows, field){
            if(!!error){
                console.log('Erro na query' + selectUsuarioQuery);
            } else {
                console.log('query executada');
                console.log(rows);
                
                //carregando values com valores lidos do DB
                values.push(rows[0].nome);
                values.push(rows[0].email);
                values.push(rows[0].senha);
                idAlergia = rows[0].idAlergias;
                
                console.log(rows[0]);
                
                //pesquisando o nome das colunas da tabela alergias
                connection.query(selectColunasQuery, function(error, rows, field){
                    if(!!error){
                        console.log('Erro na query ' + selectColunasQuery);
                    } else {
                        console.log('query executada');
                        console.log(rows);
                        
                        for(i = 1; i < rows.length; i++){
                            checkboxLabels.push(rows[i].column_name);
                            console.log(checkboxLabels[i]);
                        }
                        
                        selectAlergiasQuery += idAlergia;
                        
                        console.log(selectAlergiasQuery);
                        
                        //pesquisando os dados da tabela alergias
                        connection.query(selectAlergiasQuery, function(error, rows, field){
                            if(!!error){
                                console.log('Erro na query ' + selectAlergiasQuery);
                            } else {
                                console.log('query executada');
                                console.log(rows);
                                
                                for(i = 0; i < checkboxLabels.length; i++){
                                    var checkboxValue = rows[0][checkboxLabels[i]] ? true : false;
                                    values.push(checkboxValue);
                                    console.log(values[i+3]);
                                }
                                
                                // gerando pagina dinamicamente.
                                var jsForm = "<script type='text/javascript' src='/js/form.js'></script>";
                                var css = "<link type = 'text/css' rel = 'stylesheet' href = '/css/style.css' />";
                                var hello = "<p></p>";
                                var script = generateUpdateScript(values, checkboxLabels, session.uniqueID);
                                console.log(script);
                                var logoutLink = "<a href='/logout'> logout </a>";
                                var send = jsForm + css + hello + script + logoutLink;
                                resp.send(send);
                            
                            }
                        });
                        
                    }
                });
                
            }
        });
    }
})

//definindo caminho /redirects
app.get('/redirects', function(req, resp) {
    session = req.session;
    if(session.uniqueID){
        resp.redirect('/perfil');
        console.log(session);
    } else {
        resp.redirect('/not-logged');
    }
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Listening at port "+process.env.PORT);
});