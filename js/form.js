//Variaveis globais.

var labelsText = ["nome", "email", "senha", "pessoa-fisica", "empresa"];
var inputTypes = ["text", "text", "password", "radio", "radio"];
var labels = []; // Onde serao guardadas as tags de rotulo a serem inseridas no html
var inputs = []; // Onde serao guardadas as tags de input a serem inseridas no html
var values = [];
var checkboxes = [];
var checkboxLabels = [];
var button = document.createElement("INPUT");
var formHeight = 75;
var i;


// cria um formulario para login/cadastro
function createForm(){
    //var nome = nomeValue || "abcd"; 
    
    //criando e inserindo a formulario no HTML
    var form = document.createElement("FORM");
    form.style.boxShadow="1px 2px 7px rgba(0,0,0,0.4)";
    form.style.overflowY = "hidden";
    form.action = "/login";
    form.method = "POST";
    form.id = "form";
    form.style.height = "190px";
    document.body.appendChild(form);
    
    for(i = 0; i < labelsText.length; i++){
        
        //criando tags de input.
        inputs.push(document.createElement("INPUT"));
        inputs[i].setAttribute("type", inputTypes[i]);
        inputs[i].id = labelsText[i] + "-input";
        inputs[i].name = labelsText[i];
        inputs[i].className = "input";
        
        if(inputTypes[i] == "radio"){
            inputs[i].value = labelsText[i];
            inputs[i].name = inputTypes[i];
            inputs[i].className = "radioButton";
            form.innerHTML += "<br><br>";
            form.appendChild(inputs[i]);
            form.innerHTML += "<spam class='label'> " + labelsText[i] + "</spam>";
            
            formHeight += 30; //aumentando a altura do formulario
            
        } else {
        
            //criando tags de rotulo
            labels.push(document.createElement("P"));
            labels[i].id = labelsText[i] + "-label";
            labels[i].className = "label";
            labels[i].innerHTML = labelsText[i] + ":";
            
            //inserindo as tags no HTML
            form.appendChild(labels[i]);
            form.appendChild(inputs[i]);
            
            formHeight += 75; //aumentando a altura do formulario
        }
    } 
    
    //inserindo o botão no HTML
    button.id = "button";
    button.type = "submit";
    button.value = "Entrar";
    button.onclick = buttonOnclick;
    form.appendChild(button);
    
    //inserindo link para cadastro/login
    var link = document.createElement("A");
    link.href = "javascript:void(0);";
    link.id = "link";
    link.innerHTML = "Ainda não cadastrado?";
    setTop(-75);
    link.onclick = function(){
        if(form.style.height == "190px"){
            link.innerHTML = "Já sou cadastrado!"; //altera texto do link
            form.style.height = formHeight + "px"; //altera altura do form
            form.action = "/cadastrar"; // muda a acao do formulario
            button.value = "Cadastrar"; // altera texto do botao
            setTop(20);
        } else{
            link.innerHTML = "Ainda não cadastrado?"; //altera texto do link
            form.style.height = "190px"; //altera altura do form
            form.action = "/login"; // muda a acao do formulario
            button.value = "Entrar"; // altera texto do botao
            setTop(-75);
        }
    }
    form.appendChild(link);
}


// cria um formulario para alteração dos dados 
function createUpdateForm(){
    
    //criando e inserindo a formulario no HTML
    var form = document.createElement("FORM");

    form.style.boxShadow="1px 2px 7px rgba(0,0,0,0.4)";
    form.style.overflowY = "hidden";
    form.style.height = "450px";
    form.action = "/update";
    form.method = "POST";
    form.id = "updateForm";
    document.body.appendChild(form);
    
    for(i = 0; i < 3; i++){
        
        //criando tags de input.
        inputs.push(document.createElement("INPUT"));
        inputs[i].setAttribute("type", inputTypes[i]);
        inputs[i].id = labelsText[i] + "-input";
        inputs[i].name = labelsText[i];
        inputs[i].className = "input";
        inputs[i].setAttribute('value', values[i]);
        
        //criando tags de rotulo
        labels.push(document.createElement("P"));
        labels[i].id = labelsText[i] + "-label";
        labels[i].className = "label";
        labels[i].innerHTML = labelsText[i] + ":";
        
        //inserindo as tags no HTML
        form.appendChild(labels[i]);
        form.appendChild(inputs[i]);
        
        formHeight += 75; //aumentando a altura do formulario
    }
    
    form.innerHTML += "<p >Selecione as suas alergias:</p>";
    
    //inserindo checkbox na pagina
    var div = document.createElement('DIV');
    div.id = "checkbox-wrapper";
    div.style.border = "1px solid rgba(0,0,0,0.3)";
    form.appendChild(div);
    
    //inserindo checkboxes na pagina.
    for(i = 0; i < checkboxLabels.length; i++){
        div.innerHTML += "<br>";
        
        //gerando e inserindo checkboxes
        checkboxes.push(document.createElement('INPUT'));
        checkboxes[i].type = "checkbox";
        checkboxes[i].setAttribute('class', 'checkbox');
        if(values[i+3]){
            checkboxes[i].setAttribute('checked', values[i+3]);
        }
        checkboxes[i].name = checkboxLabels[i];
        div.appendChild(checkboxes[i]);
        //document.getElementsByName(checkboxLabels[i])[0].checked = true;
        
        //gerando e inserindo rotulos
        var label = document.createElement('SPAM');
        label.innerHTML = checkboxLabels[i];
        label.class = "checkbox-label";
        div.appendChild(label);
    }
    
    //inserindo o botão no HTML
    button.id = "button";
    button.type = "submit";
    button.value = "atualizar";
    button.onclick = buttonOnclick;
    form.appendChild(button);
    
}

//cria uma div com o link de logout.
function createTopMenu(user){
    var topo = document.createElement('DIV');
    topo.id = "div-topo";
    document.body.appendChild(topo); //insere topo no corpo do html
    
    var logout = document.createElement('A');
    logout.id = "logout";
    logout.href = "/logout";
    topo.appendChild(logout); //insere logout no topo
    
    var hello = document.createElement('H2');
    hello.id = "hello";
    hello.innerHTML = "Olá, "+ user + ".";
    topo.appendChild(hello); //insere hello no topo
    
}

function setTop(value){
    inputs = document.getElementsByTagName("input");
    labels = document.getElementsByClassName("label");
    
    for(i = 0; i < labels.length; i++){
        if(inputs[i].name != "radio"){
            inputs[i].style.top = value + "px";
            console.log(labels.length);
            labels[i].style.top = value + "px";
        }
    }
}

function buttonOnclick(){
    console.log("it works");
    var message = "";
    var tag;
    for(i = 0; i < labelsText.length; i++){
        tag = document.getElementById(labelsText[i] + "-input");
        if( tag.checked == true || (tag.className != "radioButton" && tag.value != "")){
            message += " " + tag.value;  
        }
    }
}