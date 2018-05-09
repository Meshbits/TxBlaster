const path = require('path'),
		os = require('os'),
		shell = require('shelljs'),
		fs = require('fs-extra');

const config = fs.readJsonSync('../config.json');
const chainsinfo = fs.readJsonSync('../chainsinfo.json');
const mm_data = path.join(__dirname, '../assets/mmdata');
var pm2_insight_apps = {"apps": []};

/*
var batch_amount = 5;
var batch_amount_increase = batch_amount;
var batch_counter = 1;
*/

console.log('ASSETCHAIN ARRAY RANGE: ' + config.ac_range[0] + ' to ' + config.ac_range[1]);
console.log('ASSETCHAIN RANGE START:' + chainsinfo[config.ac_range[0]].coin);
console.log('ASSETCHAIN RANGE STOP:' + chainsinfo[config.ac_range[1]].coin);
console.log('COMMAND: ' + process.argv[2]);

switch (process.argv[2]) {
	case 'help':
		console.log(`--help goes here`);
		break;
	case 'insight':
		console.log('SETTING UP INSIGHT EXPLORER');
		setup_insight(process.argv[2]);
		break;
	case 'setexplorer':
		console.log('CREATING SETUP SCRIPT');
		setup_insight(process.argv[2]);
		break;
	case 'acsetup':
		setup_insight(process.argv[2]);
		break;
	case 'nginx':
		setup_insight(process.argv[2]);
		break;
	default:
		console.log(`this is default message`);
		break;
}
console.log(`==============================`);


function setup_insight(command) {

	for (let i=config.ac_range[0]; i<chainsinfo.length; i++) {

		//console.log(chainsinfo[i].coin);
		//console.log(chainsinfo[i].rpcport);
		//console.log(chainsinfo[i].mmport);

		//console.log(`------------------------------`);

		//////// IF ASSETCHAIN SETUP, THEN SETUP .CONF FILE OF ASSETCHAINS WITHIN THE RANGE SPECIFIED //////////
		if (command == 'acsetup') {
			var _tmp_conf_file_path = `${os.homedir()}/.komodo/${chainsinfo[i].coin}/${chainsinfo[i].coin}.conf`;
			var _tmp_conf_data = `server=1
whitelist=88.99.57.78
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://${config.ac_seed[process.argv[3]]}:${chainsinfo[i].zmqport}
zmqpubhashblock=tcp://${config.ac_seed[process.argv[3]]}:${chainsinfo[i].zmqport}
rpcallowip=88.99.57.78
rpcallowip=127.0.0.1
rpcport=${chainsinfo[i].rpcport}
rpcuser=${config.insight_setup.rpcuser}
rpcpassword=${config.insight_setup.rpcpassword}
uacomment=bitcore
showmetrics=0
rpcworkqueue=256`;
		
			fs.outputFileSync(_tmp_conf_file_path, _tmp_conf_data, function (err) {
				if (err) throw err;
			});
		}
		
		/////// MAKE SHELL SCRIPT FOR COPY/PASTE/SED ///////
		if (command == 'setexplorer') {
			var _tmp_shell_command = `
cp -av ${os.homedir()}/explorers/TXSCL ${os.homedir()}/explorers/${chainsinfo[i].coin}
sed -i 's/TXSCL/${chainsinfo[i].coin}/g' ${os.homedir()}/explorers/${chainsinfo[i].coin}/txscld
sed -i 's/TXSCL/${chainsinfo[i].coin}/g' ${os.homedir()}/explorers/${chainsinfo[i].coin}/txscl-cli
sed -i 's/TXSCL/${chainsinfo[i].coin}/g' ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/insight-ui/public/views/includes/header.html
sed -i 's/TXSCL/${chainsinfo[i].coin}/g' ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/insight-ui/public/js/main.js
uglifyjs ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/insight-ui/public/js/main.js -o ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/insight-ui/public/js/main.min.js
			`
			fs.appendFileSync('./setexplorer.sh', _tmp_shell_command);
		}


		////////// IF INSIGHT BLOCK EXPLORER, THEN SETUP ALL EXPLORERS BITCORE CONFIG FILE IN USER'S HOME/EXPLORERS DIRECTORY ///////////
		if (command == 'insight') {
			var _tmp_insight_conf_path = `${os.homedir()}/explorers/${chainsinfo[i].coin}/bitcore-node.json`;
			var _tmp_insight_conf_data = `{
	"network": "livenet",
	"port": ${chainsinfo[i].mmport},
		"services": [
		"bitcoind",
		"insight-api",
		"insight-ui",
		"web"
	],
	"servicesConfig": {
		"bitcoind": {
		"connect": [
			{
				"rpchost": "${config.ac_seed[process.argv[3]]}",
				"rpcport": ${chainsinfo[i].rpcport},
				"rpcuser": "${config.insight_setup.rpcuser}",
				"rpcpassword": "${config.insight_setup.rpcpassword}",
				"zmqpubrawtx": "tcp://${config.ac_seed[process.argv[3]]}:${chainsinfo[i].zmqport}"
			}
		]
		}
	}
}`;

			fs.outputFileSync(_tmp_insight_conf_path, _tmp_insight_conf_data, function (err) {
				if (err) throw err;
			});
			console.log(_tmp_insight_conf_path);
			//console.log(JSON.parse(_tmp_insight_conf_data));


			//////// MAKE PM2 START SCRIPT AS WELL ///////
			_tempAppObject = {
				"name": `${chainsinfo[i].coin}`,
				"script": `${os.homedir()}/explorers/${chainsinfo[i].coin}/bitcore-node.json`
			}
			//console.log(_tempAppObject);
			pm2_insight_apps.apps.push(_tempAppObject);
		}


		/////// MAKE NGINX FILE CONTENTS ///////
		if (command == 'nginx') {
			var _tmp_nginx_file_upstream = `
	server 127.0.0.1:${chainsinfo[i].mmport};	#${chainsinfo[i].coin}`

			fs.appendFileSync('./nginx_upstream_upstream', _tmp_nginx_file_upstream);

			var _tmp_nginx_file_serverconf = `

server {
	listen 80;
	server_name ${chainsinfo[i].coin}.meshbits.io;

	error_log /var/log/nginx/${chainsinfo[i].coin}.access.log;

	location / {
		proxy_pass http://127.0.0.1:${chainsinfo[i].mmport}/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_set_header Host $http_host;

		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forward-Proto http;
		proxy_set_header X-Nginx-Proxy true;

		proxy_redirect off;
	}
}
`

			fs.appendFileSync('./nginx_upstream_serverconf', _tmp_nginx_file_serverconf);
		}



		//console.log(`------------------------------`);

		if (chainsinfo[i].coin == chainsinfo[config.ac_range[1]].coin) {
			//console.log(pm2_insight_apps);
			if (command == 'insight') {
				fs.outputFileSync('./pm2_insight_apps.json', JSON.stringify(pm2_insight_apps, null, 2));
			}
			break;
		}
	}

}

