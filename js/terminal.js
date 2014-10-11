var prompt = "user@Cloud9:~/$&nbsp;";

function println(line){
	console.log('print');
	var currCmd = $('#cmdline').val();
	$('.input-line').remove();
	$('#body').append('<div>' + prompt + currCmd + '</div>');
	if(currCmd != ""){
		$('#body').append('<div>' + line + '</div>');
	}
	newPrompt();
}

function newPrompt(){
	$('#body').append('<div class="input-line"><div class="prompt">' + prompt + '</div><div><input id="cmdline" class="cmdline" autofocus=""></div></div>');
	$('#cmdline').focus();
}

function parser() {
	var currCmd = $('#cmdline').val();

	switch(currCmd) {
		case 'ls':
			println('home    bin    root    etc    var');
			break;
		case 'help':
			println('Available Commands:<br>ls<br>help');
			break;
		case 'clear':
			$('#body').empty();
			newPrompt();
			break;
		case 'cls':
			$('#body').empty();
			newPrompt();
			break;
		default:
			println($('#cmdline').val() + ': command not found');
	}
}

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) { // Enter
    	parser();
    	e.stopPropagation();
    	e.preventDefault();
    }
}, false);

function refit(){
	$('#cmdline').width($('#body').width()-160);
	$('#body').height($(window).height()*3/4);
	var titlePos = $('.top').width() / 2 - $('#title').width();
	$('#title').css('left', titlePos);
}

$(window).resize(function() {
	refit();
})

$(document).ready(function() {
	refit();
})
