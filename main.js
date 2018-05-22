var person;
 
var _opcoes = {"1":"Iniciar"};

var d4 =[1,2,3,4];
var d6 =[1,2,3,4,5,6];
var d8 =[1,2,3,4,5,6,7,8];
var d10=[1,2,3,4,5,6,7,8,9,10];
var d12=[1,2,3,4,5,6,7,8,9,10,11,12];
var d20=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
 

$( document ).ready(function() {	
		
		// validaAcesso();		

		montaPersonagemPrincipal("char.json");
		
		AjustaTela(
		"05.jpg", 
		"Olá você está prestes a jogar um jogo de escolhas, seja sábio para não se arrepender! Ressaltamos que cada eventura foi desenvolvida para ser jogada apenas uma vez. Pense em suas decisões.",
		_opcoes,
		15000
		);	
		

    });


	
function montaPersonagemPrincipal(character){
	 
	 person = getDadoJsonSincrono("./data/char/"+character);
	 $('#lifepoints').attr('max', person.MAXHP);	
	 $('#lifepoints').attr('value', person.HP);
	 $('#Nome').text(person.Nome);	
	 $('#Dano').text(person.Dano);	
	 $('#AC').text(person.AC);	
	 $('#ATK').text(person.ATK);		 
	
}	


function AjustaTela(imagem, mensagem, listaOpcoes, tempoopcoes) {
	
		
	$('#fundo').css('background','url(media/imagem/'+imagem+') no-repeat');	
	$('#fundo').css('background-attachment','fixed');	
	$('#fundo').css('webkit-background-size','cover');	
	$('#fundo').css('-moz-background-size','cover');	
	$('#fundo').css('-o-background-size','cover');	
	$('#fundo').css('-o-background-size','cover');	
	
	mudaMensagem(mensagem, listaOpcoes, tempoopcoes);		
	
}


function mudancaHP(mudanca){
	
	person.HP = person.HP + mudanca;	
	
	if(person.HP > person.MAXHP){		
		person.HP =  person.MAXHP;
	}
	
	if (person.HP <= 0 ){
		alert("Seu personagem morreu, tente novamente");
	}	
	$('#lifepoints').attr('value', person.HP);
}

function mudaMensagem(mensagem, listaOpcoes, tempoopcoes){	

	$('#opcoesbox').hide();
	$('#mensagem').hide();


	$('#mensagem').text(mensagem);		
	$('#mensagem').fadeIn(3000);


	$('#opcoesbox').html(ajustaListaOpcoes(listaOpcoes));	
	
	setTimeout(
	function() 
	{		
		$('#opcoesbox').fadeIn(3000);		
	}, tempoopcoes);	

}



function validaAcesso(){
	
		var pass=prompt('Digite a chave para acesso:','');
			
		if(pass != 'teste123'){
					
	  	$('html').css('display','none');	
			die();		 			
		}
	
}

 function tocaMusica(Musica){		 
	
		$('#background').attr('src',"media/audio/"+Musica);	
		document.getElementById("background").play();	
	 
 }
 
  function tocaNarracao(Audio){		 
	
		$('#audio').attr('src',"media/audio/"+Audio);	
		document.getElementById("Audio").play();	
	 
 }
 

 
  function avancaHistoria(destino){
	

	var _dados = getDadoJsonSincrono('./data/level/'+destino+'.json');	
	
	if(_dados.Music != null){
		tocaMusica(_dados.Music);
	}
	if(_dados.Narracao != null){
		setTimeout(
		function() 
		{		
		tocaNarracao(_dados.Narracao);
		}, _dados.TempoNarracao);	
	}	
	if(_dados.HPChange != null){
		mudancaHP(_dados.HPChange);				
	}
	
	$.getJSON('./data/level/'+destino+'.json', function(data) {	
	switch(data.TipoTela) {
    case "mudaMensagem":	
		mudaMensagem(data.Message, data.Opcoes, data.TempoOpcoes);	   	
        break;
    case "AjustaTela":	
		AjustaTela(data.Background, data.Message, data.Opcoes, data.TempoOpcoes);	     
     break;	 
	case "AjustaTelaMusica":	
		AjustaTela(data.Background, data.Message, data.Opcoes, data.TempoOpcoes);	  
    break;
	case "AjustaTelaMusicaeNarracao":	
		AjustaTela(data.Background, data.Message, data.Opcoes, data.TempoOpcoes);	
	break;
	case "Combate":	
		  Combate(person, data);	
	break;
    default:
        alert ('Opção não esperada');
	}	
	})
	.error(function(data) { console.log(data); });
	 
 }

function ajustaListaOpcoes(opcoes){
	
	var texto = "<ul id ='opcoes'>";
	
	$.each(opcoes, function (index, value) {
	 texto = texto + "<li><a onclick=avancaHistoria('" + index + "')>"+value+"</li>"; 
	 
	});
	
	texto = texto + "</ul>";
	
	return texto;
		
}

function getDadoJsonSincrono(_url){
    var result = null;
    $.ajax({
        async: false,
        url: _url ,    
        dataType: "json",
        success: function(data){
            result = data;
        }
    });
    return result;
}


function Combate(person, enemy){
	
	while(person.HP > 0 && enemy.HP > 0 ){
		
		if(person.AC < enemy.AC){
			
			console.log('Personagem ataca primeiro');
			
			if((calculaDado('d20')+ person.ATK)>enemy.AC){				
				
				console.log('Personagem acerta ataque');				
				enemy.HP = enemy.HP - calculaDado(person.Dano);						
				console.log('Pontos de vida do inimigo '+ enemy.HP );
				
	       }
		   if((calculaDado('d20')+ enemy.ATK)>person.AC){	
				
				console.log('Inimigo acerta ataque');		   
				mudancaHP(calculaDado(enemy.Dano) * -1);	
				console.log('Pontos de vida do personagem ' + person.HP);						
		   }

	 }else{
		
		console.log('Inimigo ataca primeiro');
		
		 if((calculaDado('d20')+ enemy.ATK)>person.AC){	
		 
					console.log('Inimigo acerta ataque');
					mudancaHP(calculaDado(enemy.Dano) * -1);	
					console.log('Pontos de vida do personagem ' + person.HP);					
		}
		
	
		if((calculaDado('d20')+ person.ATK)>enemy.AC){
					
					console.log('Personagem acerta ataque');
					enemy.HP = enemy.HP - calculaDado(person.Dano);		
					console.log('Pontos de vida do inimigo '+ enemy.HP );
			   }			  
		
	}
	}
	
	if(person.HP > 0){		
		avancaHistoria(enemy.Vitoria);
	}else{		
		avancaHistoria(enemy.Derrota);				
	}
}

function calculaDado(dado){
	
	var pickOne;
	var value;
	
	switch(dado) {		
		case "d4":	
		  pickOne = d4;
		break;
		case "d6":	
		  pickOne = d6;
		break;
		case "d8":	
		  pickOne = d8;
		break;
		case "d10":	
		  pickOne = d10;
		break;
		case "d20":	
		  pickOne = d20;
		break;
		default:
			alert('Opção não esperada');		
	}	
	
	
    value  = pickOne[Math.floor(Math.random() * pickOne.length)];	
	return value;
	
}

