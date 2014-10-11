var path = "/";
var prompt = "user@Cloud9:";
var promptSuffix = "$&nbsp;";
var _files = ["education", "work_experience", "scripting", "software", "technologies", "iaas", "operating_systems"];
var education_files = ["new_jersey_institute_of_technology"];
var work_experience_files = ["advancedgroup.net.txt", "kittatinny_regional_high_school.txt"];
var AdvancedGroup = "Kittatinny Regional High School Newton, New Jersey<br>June 2010 - June 2012<br>IT Technician<br>○ Implemented a new thinclient<br>computing lab to increase maintenance efficiency<br>○ Improved school web presence by proposing and implementing a new school website<br>○ Maintained computing systems throughout all wings of the building";
var Kittatinny = "AdvancedGroup.net Augusta, New Jersey<br>January 2013 - Present<br>Intern Web Developer and System Administrator<br><br>○ Developed specialized content management systems using ColdFusion for clients in the financial and insurance sectors that were required to maintain HIPAA and PCI compliance<br>○ Provided Infrastructure as a Service, IaaS, for 8 clients who wished to cohost in our datacenter<br>○ Maintained 5 dedicated Microsoft SQL servers with failover protection to the US East and West Coast<br>○ Maintained webmail servers for over 75 clients<br>○ Maintained DNS and Domain servers in our internal datacenter<br>○ Oversaw the company network and provided firstresponse to any external network attacks<br>○ Assisted in the beginning of a mass migration of internal systems from our datacenter to Amazon EC2, including 10 servers<br>○ Assembled, maintained, and repaired server hardware part of our internal infrastructure";
var scripting_files = ["Bash", "Ruby", "Python", "NodeJS"];																				
var software_files = ["VMware vSphere", "VMware Workstation", "VirtualBox", "LAMP", "MS SQL", "nginx", "Apache", "IIS", "Grunt", "Git", "F-Secure", "Microsoft Security Essentials", "Avast", "AVG"];
var technologies_files = ["TCP/IP", "DNS", "DHCP", "WINS", "SMTP", "FTP", "SNMP", "SSH"];
var iaas_files = ["Amazon Web Services", "DigitalOcean", "Linode"];
var operating_systems_files = ["CentOS", "RedHat Enterprise Linux", "Debian", "Ubuntu", "Arch", "Server 2003 & R2", "Server 2008 & R2", "Server 2012 & R2", "XP", "Vista", "7", "8", "8.1"];
var last_command = '';

function println(line){ls
	rasterPrompt();
	$('#body').append('<div>' + line + '</div>');
	newPrompt();
}

function rasterPrompt(){
	var currCmd = $('#cmdline').val();
	$('.input-line').remove();
	$('#body').append('<div>' + prompt + path + promptSuffix + currCmd + '</div>');
	last_command = currCmd;
}

function newPrompt(){
	$('#body').append('<div class="input-line"><div class="prompt">' + prompt + path + promptSuffix + '</div><div><input id="cmdline" class="cmdline" autofocus=""></div></div>');
	$('#cmdline').focus();
	refit();
}

function clear(){
	$('#body').empty();
	newPrompt();
}

function help(){
	println('Available Commands:<br>ls [-l] [directory]<br>cd [directory]<br>cat [file]<br>clear<br>help');
}

function ls(args){
	var arr = eval(path.replace('/','') + '_files');
	var output = '';
	if(_files.indexOf(args) >= 0){
		arr = eval(args + '_files');
	}
	if(args == '-l'){
		output = 'total ' + arr.length*4 + '<br>';
		for (var i=0;i<arr.length;i++){
			if(_files.indexOf(arr[i]) >= 0) {
				output += 'drwxr-x-r-x 2 user user 4096 Oct 11 7:31 ' + arr[i] + '<br>';
			} else {
				output += '-rw-r---r-- 1 user user 1321 Oct 11 7:31 ' + arr[i] + '<br>';
			}
		} 
	}	else {
			for (var i=0;i<arr.length;i++){
				output += arr[i] + '<br>';
			}
	}
	println(output);
}

function cd(args){
	var arr = eval(path.replace('/','') + '_files');
	if(arr.indexOf(args) >= 0 ){
		rasterPrompt();
		path = '/' + args.replace('/','');
		newPrompt();
	} else if (args == '..' || args == '' || args == '/' || args == undefined) {
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
	if(args == 'advancedgroup.net.txt'){
		println(AdvancedGroup);
	} else if(args == 'kittatinny_regional_high_school.txt'){
		println(Kittatinny);
	} else {
		println('cat: ' + args + ': No such file or directory');
	}
}

function pwd(){
	println(path);
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
		case 'cat':
			cat(currCmd[1]);
			break;
		case 'help':
			help();
			break;
		case 'clear':
			clear();
			break;
		default:
			println($('#cmdline').val() + ': command not found');
	}
}

function autoComplete(){
	var keywords = eval(path.replace('/','') + '_files');
	var currCmd = $('#cmdline').val();
	var wordList = currCmd.split(' ');
	var currWord = wordList[wordList.length-1];
	for (var i=0;i<keywords.length;i++){
		if(keywords[i].indexOf(currWord) >= 0) {
			currCmd = currCmd.substr(0, currCmd.length - currWord.length);
			currCmd += keywords[i];
			$('#cmdline').val(currCmd);
			break;
		}
	} 
}

function history(){
	if(last_command != ''){
		$('#cmdline').val(last_command);
	}
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
    	history();
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

$(window).resize(function(){
	refit();
})

$(document).ready(function(){
	refit();
	$('#lastLoginTime').html(moment().format('ddd MMM D hh:mm:ss'));
})

$(document).click(function(){
	$('#cmdline').focus();
})
