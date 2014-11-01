var path = "/";
var prompt = "user@Cloud9:";
var promptSuffix = "$&nbsp;";
var hist = [];
var histPtr = 0;

var filesystem = {
	"About_Me" : {
		"permissions":"664",
		"type":"-",
		"content":"I am a Junior Information Technology Major at the New Jersey Institute of Technology. I am currently employed at AdvancedGroup.net for web development and server maintenance."
	},
	"Education" : {
		"permissions":"755",
		"type":"d",
		"children" : {
			"NJIT":{
				"permissions":"664",
				"type":"-",
				"content":"New Jersey Institute of Technology - Newark, New Jersey<br>May 2016 (Expected)<br>College of Computing Sciences, Bachelor of Science in Information Technology<br>GPA: 3.6"
			}
		}
	},
	"Work_Experience" : {
		"permissions":"755",
		"type":"d",
		"children" : {
			"AdvancedGroup.net":{
				"permissions":"664",
				"type":"-",
				"content":"AdvancedGroup.net Augusta, New Jersey<br>January 2013 - Present<br>Intern Web Developer and System Administrator<br><br>○ Developed specialized content management systems using ColdFusion for clients in the financial and insurance sectors that were required to maintain HIPAA and PCI compliance<br>○ Provided Infrastructure as a Service, IaaS, for 8 clients who wished to cohost in our datacenter<br>○ Maintained 5 dedicated Microsoft SQL servers with failover protection to the US East and West Coast<br>○ Maintained webmail servers for over 75 clients<br>○ Maintained DNS and Domain servers in our internal datacenter<br>○ Oversaw the company network and provided firstresponse to any external network attacks<br>○ Assisted in the beginning of a mass migration of internal systems from our datacenter to Amazon EC2, including 10 servers<br>○ Assembled, maintained, and repaired server hardware part of our internal infrastructure"
			},
			"Kittatinny_Regional_High_School":{
				"permissions":"664",
				"type":"-",
				"content":"Kittatinny Regional High School Newton, New Jersey<br>June 2010 - June 2012<br>IT Technician<br>○ Implemented a new thin client computing lab to increase maintenance efficiency<br>○ Improved school web presence by proposing and implementing a new school website<br>○ Maintained computing systems throughout all wings of the building"
			}			
		}

	},
	"Technology_Summary" : {
		"permissions":"755",
		"type":"d",
		"children" : {
			"Scripting":{
				"permissions":"664",
				"type":"-",
				"content":"Bash, Ruby, Python, NodeJS"
			},
			"Software":{
				"permissions":"664",
				"type":"-",
				"content":"VMware vSphere, VMware Workstation, VirtualBox, LAMP, MS SQL, nginx, Apache, IIS, Grunt, Git, F-Secure, Microsoft Security Essentials, Avast, AVG"
			},
			"Technologies":{
				"permissions":"664",
				"type":"-",
				"content":"TCP/IP, DNS, DHCP, WINS, SMTP, FTP, SNMP, SSH"
			},
			"IaaS":{
				"permissions":"664",
				"type":"-",
				"content":"Amazon Web Services, DigitalOcean, Linode"
			},
			"Operating_Systems":{
				"permissions":"664",
				"type":"-",
				"content":"CentOS, RedHat Enterprise Linux, Debian, Ubuntu, Arch, Server 2003 & R2, Server 2008 & R2, Server 2012 & R2, XP, Vista, 7, 8, 8.1"
			}
		}
	},
	"etc":{
		"permissions":"755",
		"type":"d",
		"children":{
			"hosts":{
				"permissions":"755",
				"type":"-",
				"content":"127.0.0.1 localhost"
			},
			"apache2":{
				"permissions":"755",
				"type":"-",
				"content":"127.0.0.1 localhost"
			}
		}
	}, 
	"var":{
		"permissions":"755",
		"type":"d",
		"children":{
			"www":{
				"permissions":"755",
				"type":"d",
				"children":{
					"matthewlavine.net":{
						"permissions":"755",
						"type":"-",
						"content":"sites and stuff"	
					}
				}
			},
			"log":{
				"permissions":"755",
				"type":"-",
				"content":"i turned on"
			}
		}
	},
	"srv":{
		"permissions":"755",
		"type":"d",
		"children":{}
	},
	"opt":{
		"permissions":"755",
		"type":"d",
		"children":{}
	}
}

function println(line){
	rasterPrompt();
	$('#terminal').append('<div>' + line + '</div>');
	newPrompt();
}

function rasterPrompt(){
	var currCmd = $('#cmdline').val();
	$('.input-line').remove();
	$('#terminal').append('<div>' + prompt + path + promptSuffix + currCmd + '<div class="timeStamp">' + moment().format('ddd MMM D hh:mm:ss') + '</div></div>');
	hist.push(String(currCmd));
	histPtr = hist.length;
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
	println('Available Commands:<br>ls [-l]<br>cd [directory]<br>cat [file]<br>history<br>clear<br>help');
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
	return eval(evalpath);
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
	var arr = getSubItems(path);
	var output = '';
	if(args == '-l'){
		output = 'total ' + arr.length + '<br>';
		for (var i=0;i<arr.length;i++){
			output += getType(path + "/" + arr[i]) + expandPermissions(path + "/" + arr[i]) + ' matt matt 4096 Oct 11 7:31 ' + arr[i] + '<br>';
		} 
	}	else {
		for (var i=0;i<arr.length;i++){
			output += arr[i] + '<br>';
		}
	}
	println(output);
}

function cd(args){
	var arr = getSubItems(path);
	if(arr.indexOf(args) >= 0 ){
		if(getType(path + "/" + args) == "d"){
			rasterPrompt();
			path = '/' + args.replace('/','');
			newPrompt();
		} else {
			println('cd: ' + args + ': Is not a directory')
		}
	} else if (args == '..' && path != "/" && path.lastIndexOf("/") != 0){
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
	} else {
		println('cd: ' + args + ': No such file or directory');
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
	} else {
		println('cat: ' + args + ': Cannot cat file');
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
		ls(currCmd[1]);
		break;
		case 'll':
		ls("-l");
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
	var currWord = wordList[wordList.length-1];
	for (var i=0;i<keywords.length;i++){
		if(keywords[i].indexOf(currWord) == 0) {
			currCmd = currCmd.substr(0, currCmd.length - currWord.length);
			currCmd += keywords[i];
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

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) { // Enter
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
