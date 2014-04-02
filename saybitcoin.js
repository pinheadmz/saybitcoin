var base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var hex = '0123456789ABCDEF';
var bin = '01';
var dec = '0123456789';

function encode(input, inputAlph, outputAlph, spacer){
	var output = '';
	var inputBase = BigInteger(inputAlph.length);
	var outputBase = BigInteger(outputAlph.length);
	var l = input.length;
	
	// convert input string into BigInteger by totaling each digit * exponent position
	// loop through string 'backwards' for little endian
	var total = BigInteger(0);
	for (var i = 0 ; i < l ; i++){	
		var alphaPos = inputAlph.indexOf(input[i]);	
		
		// character is not in input alphabet
		if (alphaPos == -1){
			error('"' + input[i] + '" is not valid');
			return false;
		}
				
		var n = BigInteger(alphaPos);
		var exp = inputBase.pow(i);
		var value = n.multiply(exp);
		total = total.add(value);
	}
	
	// make a copy of total before it gets crunched
	var keepTotal = total;
	
	// convert BigInteger value of input to output alphabet string
	var first = true;
	while (total.isPositive()){
		var remainder = total.remainder(outputBase);
		var alphaPos = remainder.valueOf();
		
		// no extra spaces at end of output
		if(!first)
			output += spacer;
		else
			first = false;
					
		output += outputAlph[remainder];
		
		var total = total.divide(outputBase);		
	}
	
	// return converted string and BigInteger value for Bitcoin validation
	response = [output, keepTotal];
	return response;
}

function goEncode(){
	clearError();
	var input = document.getElementById('encoder').value;
	
	// strip spaces from input
	input = input.replace(/\s/g,''); 
	
	var output = encode(input, base58, words, ' ')[0];
		
	if(output)
		document.getElementById('encoderOutput').value = output;
}

function goDecode(){
	clearError();
	var input = document.getElementById('decoder').value;
	
	// clear out any non word characters, capital letters and trailing whitespace
	input = input.replace(/,/g,'');
	input = input.replace(/^[.\s]+|[.\s]+$/g, '');
	input = input.toLowerCase();
	
	// convert input string into array, cutting on the spaces between words
	var input = input.split(' ');
		
	var output = encode(input, words, base58, '')[0];
	
	if(output)
		document.getElementById('decoderOutput').value = output;
}

function error(msg){
	document.getElementById('errorOutput').innerHTML = msg;
	return false;
}

function clearError(){
	document.getElementById('errorOutput').innerHTML = '';
}

// event handlers for text fields
window.onload = function(){
	document.getElementById('encoder').onkeydown = function(e){
		e = e || event;
		if (e.keyCode === 13){
			goEncode();
			return false;
		}
	}
	
	document.getElementById('decoder').onkeydown = function(e){
		e = e || event;
		if (e.keyCode === 13){
			goDecode();
			return false;
		}
	}
	
	document.getElementById('decoderOutput').onmouseup = function(e){
		this.select();
	}
	document.getElementById('encoderOutput').onmouseup = function(e){
		this.select();
	}
	document.getElementById('encoder').onmouseup = function(e){
		this.select();
	}
	document.getElementById('decoder').onmouseup = function(e){
		this.select();
	}
	document.getElementById('donateText').onmouseup = function(e){
		this.select();
	}	
}


