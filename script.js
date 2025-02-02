let modoSuperscriptAtivado = false
let distanciaDeOperadoresEspeciais = [];
let resultado = document.getElementById('resultado');

function insertNumberInSubscript(num) {
    let superscript = [].slice.call(resultado.getElementsByTagName('sup')).at(-1);

    superscript.innerHTML += num;
}

function insert(num)
{
    if (modoSuperscriptAtivado === true) {
	switch (num) {
	case '*':
	case '-':
	case '/':
	case '+':
	case '%':
	    var numero = resultado.innerHTML;
	    resultado.innerHTML = numero + num;

	    alternaModoSuperscript(false);

	    distanciaDeOperadoresEspeciais.push({
		distancia: 1,
		type: 'POW'
	    });

	    break;
	default:
	    insertNumberInSubscript(num);
	    break;
	}
    } else {
	if (num === '%') {
	    var numero = resultado.innerHTML;
	    resultado.innerHTML = numero + 'MOD';

	    distanciaDeOperadoresEspeciais.push({
		distancia: -1,
		type: 'MOD'
	    });
	} else {
	    var numero = resultado.innerHTML;
	    resultado.innerHTML = numero + num;
	}

	for (let i = 0; i < distanciaDeOperadoresEspeciais.length; i++) {
	    distanciaDeOperadoresEspeciais[i].distancia += 1;
	}
    }
}

function alternaModoSuperscript(criaSupElement)
{
    modoSuperscriptAtivado = !modoSuperscriptAtivado;

    if (criaSupElement === true) {
	let superscript = document.createElement('sup');
	resultado.appendChild(superscript);
    }

    if (modoSuperscriptAtivado) {
	document.getElementById('botao-potencia').classList.add('potencia-ativa');
    } else {
	document.getElementById('botao-potencia').classList.remove('potencia-ativa');
    }
}

function clean ()
{
    resultado.innerHTML = "";
    distanciaDeOperadoresEspeciais = [];
    modoSuperscriptAtivado = false;
}

function removeNumeroDoSuperscript()
{
    let superscript = [].slice.call(resultado.getElementsByTagName('sup')).at(-1);

    if (superscript.innerHTML.length > 0) {
	superscript.innerHTML = superscript.innerHTML.substring(0, superscript.innerHTML.length - 1);

	if (superscript.innerHTML.length !== 0) {
	    return;
	}
    }

    alternaModoSuperscript(false);
    distanciaDeOperadoresEspeciais.shift();
    resultado.innerHTML = resultado.innerHTML.substring(0, resultado.innerHTML.length - "<sup></sup>".length);
}

function back ()
{
    if (modoSuperscriptAtivado === false) {
	if (distanciaDeOperadoresEspeciais.length !== 0 && distanciaDeOperadoresEspeciais[0].distancia === 0) {
	    switch(distanciaDeOperadoresEspeciais[0].type) {
	    case 'MOD':
		resultado.innerHTML = resultado.substring(0, resultado.length -3)

		distanciaDeOperadoresEspeciais.shift();
		break;
	    case 'POW':
		alternaModoSuperscript(false);

		removeNumeroDoSuperscript();
		break;
	    }
	} else {
	    resultado.innerHTML = resultado.innerHTML.substring(0, resultado.innerHTML.length -1)
	}

	for (let i = 0; i < distanciaDeOperadoresEspeciais.length; i++) {
	    distanciaDeOperadoresEspeciais[i].distancia -= 1;
	}
    }
    else {
	removeNumeroDoSuperscript();
    }
}

function calcular ()
{
    let resultadoDoCalculo = resultado.innerHTML;
    let regex = /<sup>(\d+)<\/sup>/
    let resultadoDoMatch;

    modoSuperscriptAtivado = false;
    
    do {
	resultadoDoMatch = regex.exec(resultado);

	if (resultadoDoMatch !== null && resultadoDoMatch.length === 2) {
	    resultadoDoCalculo = resultadoDoCalculo.replace(/<sup>\d+<\/sup>/, '**' + resultadoDoMatch[1]);
	}
    } while(resultadoDoMatch !== null && resultadoDoMatch.length === 2);
    
    
    if(resultadoDoCalculo) 
    {
	resultadoDoCalculo = resultadoDoCalculo.replaceAll('MOD', '%');
        resultado.innerHTML = eval(resultadoDoCalculo);
    }

    distanciaDeOperadoresEspeciais = [];
}
