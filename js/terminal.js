var path = "/";
var prompt = "user@Cloud9:";
var promptSuffix = "$&nbsp;";
var hist = [];
var histPtr = 0;
var filesystem = {};
var commands = ["pwd", "cd", "ls", "ll", "cat", "help", "clear", "date", "whoami", "alias", "history"];

$.getJSON("./js/filesystem.json", function(data){
	filesystem = data;
});

function println(line){
	rasterPrompt();
	$('#terminal').append('<div>' + line + '</div>');
	newPrompt();
}

function rasterPrompt(){
	var currCmd = $('#cmdline').val();
	$('.input-line').remove();
	$('#terminal').append('<div>' + prompt + path + promptSuffix + currCmd + '<div class="timeStamp">' + moment().format('ddd MMM D hh:mm:ss') + '</div></div>');
}

function newPrompt(){
	$('#terminal').append('<div class="input-line"><div class="prompt">' + prompt + path + promptSuffix + '</div><div><input id="cmdline" class="cmdline" autofocus=""></div></div>');
	$('#cmdline').focus();
	refit();
}

function clear(){
	$('#terminal').empty();
	newPrompt();
}

function help(){
	println('Available Commands:<br>ls [-l] [directory]<br>cd [directory]<br>cat [file]<br>history<br>clear<br>help');
}

function getSubItems(dir){
	var evalpath = 'filesystem';
	dir.replace(/\//gi, " ").substr(1).split(" ").forEach(function(element, index, array) {
		if(element == "") return;
		evalpath += '["' + element + '"]';
		if(eval(evalpath + '["type"]') == "d") evalpath += '["children"]';
	});
	return Object.keys(eval(evalpath));
}

function getType(path){
	var evalpath = 'filesystem';
	path.replace(/\//gi, " ").substr(1).split(" ").forEach(function(element, index, array) {
		if(element == "") return;
		evalpath += '["' + element + '"]';
		if (element == array[array.length-1]){
			evalpath += '["type"]';
		} else {
			evalpath += '["children"]';
		};
	});
	try {
		return eval(evalpath);	
	} catch (e) {
		return undefined;
	}	
}

function getContent(file){
	var evalpath = 'filesystem';
	file.replace(/\//gi, " ").substr(1).split(" ").forEach(function(element, index, array) {
		if(element == "") return;
		evalpath += '["' + element + '"]';
		if (element == array[array.length-1]){
			evalpath += '["content"]';
		} else {
			evalpath += '["children"]';
		};
	});
	return eval(evalpath);
}

function expandPermissions(path){
	var evalpath = 'filesystem';
	path.replace(/\//gi, " ").substr(1).split(" ").forEach(function(element, index, array) {
		if(element == "") return;
		evalpath += '["' + element + '"]';
		if (element == array[array.length-1]){
			evalpath += '["permissions"]';
		} else {
			evalpath += '["children"]';
		};
	});
	var permRaw = eval(evalpath);
	var permPretty = "rwxrwxrwx";
	var permMask = '';
	for(var i=0;i<permRaw.length;i++){
		permMask += Number(permRaw[i]).toString(2);
	}
	for(var i=0;i<permMask.length;i++){
		if(permMask[i] == 0) permPretty = permPretty.substr(0, i) + "-" + permPretty.substr(i+1, permPretty.length);
	}
	return permPretty;
}

function ls(args){
	var lsPath = path;
	if((args[1] != undefined && args[1] != "-l") || (args[2] != undefined && args[2] != "-l")){
		var absPath = ((args[1] != undefined && args[1] != "-l") || (args[2] != undefined && args[2] == "-l")) ? args[1] : args[2];
		if(absPath.substr(0,1) != "/") {
			if(getSubItems(path).indexOf(absPath.split("/")[0]) != -1) {
				absPath = "/" + absPath;	
			} else {
				println('ls: cannot access ' + absPath + ': No such file or directory');
				return;
			}
		}
		if(absPath.substr(absPath.length-1) == "/")
			absPath = absPath.substr(0, absPath.length-1);
		if(getSubItems(path).indexOf(absPath) != -1 || (absPath.indexOf("/") == 0 && getType(absPath) == "d")) {
			lsPath = absPath;
		} else {
			println('ls: ' + absPath + ': Is not a directory');
			return;
		}
	}
	var arr = getSubItems(lsPath);
	var output = '';
	if((args[1] != undefined && args[1] == "-l") || (args[2] != undefined && args[2] == "-l")){
		output = 'total ' + arr.length + '<br>';
		for (var i=0;i<arr.length;i++){
			output += getType(lsPath + "/" + arr[i]) + expandPermissions(lsPath + "/" + arr[i]) + ' matt matt 4096 Oct 11 7:31 ' + arr[i] + '<br>';
		} 
	}	else {
		for (var i=0;i<arr.length;i++){
			output += arr[i] + '<br>';
		}
	}
	println(output);
}

function cd(args){
	var cleanArgs = args;
	var arr = getSubItems(path);
	if(args.substr(args.length-1) == "/")
		args = args.substr(0, args.length-1);
	if (args == '..' && path != "/" && path.lastIndexOf("/") != 0){
		rasterPrompt();
		path = path.substr(0, path.lastIndexOf("/"));
		newPrompt();
	} else if ((args == '..' && (path == "/" || path.lastIndexOf("/") == 0)) || args == '' || args == '/' || args == undefined) {
		rasterPrompt();
		path = '/';
		newPrompt();
	} else if (args == '.') {
		rasterPrompt();
		newPrompt();
	} else if(args.substr(0,1) == "/" || getSubItems(path).indexOf(args.split("/")[0]) != -1 ){
		if(args.substr(0,1) != "/") {
			if(path == "/"){
				args = path + args;
			} else {
				args = path + "/" + args;
			}
		}
		if(getType(args) == "d") {
			rasterPrompt();
			path = args;
			newPrompt();
			return;
		} else if(getType(args) == undefined) {
			println('cd: ' + cleanArgs + ': No such file or directory');
			return;
		} else {
			println('cd: ' + cleanArgs + ': Is not a directory')
		}
	} else {
		println('cd: ' + cleanArgs + ': No such file or directory');
	}
}

function cat(args){
	var arr = getSubItems(path);
	if(arr.indexOf(args) >= 0 ){
		if(getType(path + "/" + args) == "-"){
			println(getContent(path + "/" + args));
		} else {
			println('cat: ' + args + ': Is a directory');
		}
	} else if(args.indexOf("/") == 0) {
		if(getType(args) == "-"){
			println(getContent(path + "/" + args));
		} else {
			println('cat: ' + args + ': Is a directory');
		}
	} else if(args.indexOf("/") != -1) { 
		if(getType("/" + args) == "-"){
			println(getContent(path + "/" + args));
		} else {
			println('cat: ' + args + ': Is a directory');
		}
	} else {
		println('cat: ' + args + ': No such file or directory');
	}
}

function shellshock(args){
	if(args.indexOf("()") > 0 && args.indexOf("vulnerable") > 0) {
		println('Why would you do that?');
	} else {
		rasterPrompt();
		newPrompt();
	}
}

function whoami(){
	println('user')
}

function pwd(){
	println(path);
}

function alias(){
	println("ll=\"ls -l\"");
}

function history(){
	var output = "";
	for(var i=0;i<hist.length;i++){
		output += i + "&nbsp;&nbsp;" + hist[i] + "<br>";
	}
	println(output);
}

function parser() {
	var currCmd = $('#cmdline').val().split(' ');

	switch(currCmd[0]) {
		case 'pwd':
		pwd();
		break;
		case 'cd':
		cd(currCmd[1]);
		break;
		case 'ls':
		ls(currCmd);
		break;
		case 'll':
		ls(["ls", "-l"]);
		break;
		case 'cat':
		cat(currCmd[1]);
		break;
		case 'help':
		help();
		break;
		case 'clear':
		clear();
		break;
		case 'date':
		println(moment().format('ddd MMM D hh:mm:ss'));
		break;
		case 'env':
		shellshock($('#cmdline').val());
		break;
		case 'whoami':
		whoami();
		break;
		case 'alias':
		alias();
		break;
		case 'history':
		history();
		break;
		case '':
		rasterPrompt();
		newPrompt();
		break;
		default:
		println(currCmd[0] + ': command not found');
	}
}

function autoComplete(){
	var keywords = getSubItems(path);
	var currCmd = $('#cmdline').val();
	var wordList = currCmd.split(' ');
	var currWordParts = wordList[wordList.length-1].split("/");
	var currPath = wordList[wordList.length-1].substr(0,wordList[wordList.length-1].lastIndexOf("/"));
	var currWord = currWordParts[currWordParts.length-1];
	if(currPath != "") {
		if(currPath.substr(0,1) != "/")
			currPath = "/" + currPath;
		keywords = getSubItems(currPath);
	}
	for (var i=0;i<keywords.length;i++){
		if(keywords[i].indexOf(currWord) == 0) {
			currCmd = currCmd.substr(0, currCmd.length - currWord.length);
			currCmd += keywords[i];
			$('#cmdline').val(currCmd);
			break;
		}
	} 
	for (var i=0;i<commands.length;i++){
		if(commands[i].indexOf(currWord) == 0) {
			currCmd = currCmd.substr(0, currCmd.length - currWord.length);
			currCmd += commands[i];
			$('#cmdline').val(currCmd);
			break;
		}
	} 
}

function histUp(){
	if(hist.length == 0)
		return;
	if(histPtr - 1 >= 0)
		histPtr--;
	$('#cmdline').val(hist[histPtr]);
}

function histDown(){
	if(hist.length == 0)
		return;
	if(histPtr + 1 <= hist.length)
		histPtr++;
	$('#cmdline').val(hist[histPtr]);
}

function logHist(){
	var currCmd = $('#cmdline').val();
	hist.push(String(currCmd));
	histPtr = hist.length;	
}

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) { // Enter
    	logHist();
    	parser();
    	e.stopPropagation();
    	e.preventDefault();
    }
}, false);

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 9) { // Tab
    	autoComplete();
    	e.stopPropagation();
    	e.preventDefault();
    }
}, false);

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 38) { // Up Arrow
    	histUp();
    	e.stopPropagation();
    	e.preventDefault();
    }
}, false);

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 40) { // Down Arrow
    	histDown();
    	e.stopPropagation();
    	e.preventDefault();
    }
}, false);

function refit(){
	$('#cmdline').width($('#terminal').width()-160);
	$("html, body").scrollTop($(document).height());
}


$(window).resize(function(){
	refit();
});

$(document).ready(function(){
	refit();
	//$('#lastLoginTime').html(moment().format('ddd MMM D hh:mm:ss'));
});

$(document).click(function(){
	$('#cmdline').focus();
});
