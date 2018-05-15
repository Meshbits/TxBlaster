const request = require('request-promise'),
		sha256 = require('sha256'),
		fs = require('fs-extra'),
		path = require('path'),
		os = require('os'),
		pm2 = require('pm2'),
		exec = require('child_process').exec,
		Promise = require('bluebird'),
		_platform = os.platform();

const config = fs.readJsonSync('../config.json');
const chainsinfo = fs.readJsonSync('../chainsinfo.json');
const mm_data = path.join(__dirname, '../assets/mmdata');
const ac_data = path.join(__dirname, '../assets/ac_data');

const Reset = "\x1b[0m",
		Bright = "\x1b[1m",
		Dim = "\x1b[2m",
		Underscore = "\x1b[4m",
		Blink = "\x1b[5m",
		Reverse = "\x1b[7m",
		Hidden = "\x1b[8m",

		FgBlack = "\x1b[30m",
		FgRed = "\x1b[31m",
		FgGreen = "\x1b[32m",
		FgYellow = "\x1b[33m",
		FgBlue = "\x1b[34m",
		FgMagenta = "\x1b[35m",
		FgCyan = "\x1b[36m",
		FgWhite = "\x1b[37m",

		BgBlack = "\x1b[40m",
		BgRed = "\x1b[41m",
		BgGreen = "\x1b[42m",
		BgYellow = "\x1b[43m",
		BgBlue = "\x1b[44m",
		BgMagenta = "\x1b[45m",
		BgCyan = "\x1b[46m",
		BgWhite = "\x1b[47m";

/*fs.removeSync(`start_all_mm.sh`); // Removed existing file mm start file
fs.appendFileSync('start_all_mm.sh', `cd ${mm_data}
`);*/

var pm2_mm_apps = {"apps": []};
var pm2_ac_apps = {"apps": []};

switch (_platform) {
	case 'darwin':
		_defaultUserHome = `${process.env.HOME}/Library/Application Support/`;
		mmPath = path.join(__dirname, '../assets/bin/osx/marketmaker');
		break;
	case 'linux':
		_defaultUserHome = `${process.env.HOME}/`;
		mmPath = path.join(__dirname, '../assets/bin/linux/marketmaker');
		break;
}

console.log('ASSETCHAIN ARRAY RANGE: ' + config.ac_range[0] + ' to ' + config.ac_range[1]);
console.log('ASSETCHAIN RANGE START: ' + chainsinfo[config.ac_range[0]].coin);
console.log('ASSETCHAIN RANGE STOP: ' + chainsinfo[config.ac_range[1]].coin);

//console.log(_defaultUserHome);
//console.log(mmPath);

for (let i=config.ac_range[0]; i<chainsinfo.length; i++) {
	var startmm_script_exists = function() {
		//console.log(chainsinfo[i].coin);
		//console.log(chainsinfo[i].supply);
		//console.log(chainsinfo[i].rpcport);
		//console.log(chainsinfo[i].mmport);

		var _coins = `[{\"coin\":\"${chainsinfo[i].coin}\",\"asset\":\"${chainsinfo[i].coin}\",\"rpcport\":${chainsinfo[i].rpcport}}]`
		//_coins = _coins.replace(/"/g, '\\"');

		//var _coins = `"[{"coin":"${chainsinfo[i].coin}","asset":"${chainsinfo[i].coin}","rpcport":${chainsinfo[i].rpcport}}]"`;
		//console.log(_coins);

		var mm_params = `{\"gui\":\"nogui\",\"client\":1, \"userhome\":\"${_defaultUserHome}\", \"passphrase\":\"${'startup'+config.passphrase}\", \"coins\":${_coins}, \"rpcport\":${chainsinfo[i].mmport}}`;
		mm_params = mm_params.replace(/"/g, '\\"');
		//console.log(mm_params);
		//console.log(mmPath);
		//var mm_process = `${mmPath} "{"gui":"nogui","client":1, "userhome":"${_defaultUserHome}"}", "passphrase":"${'startup'+config.passphrase}", "coins":${_coins}, "rpcport":${chainsinfo[i].mmport}}"`;
		//console.log(mm_process);

		var ac_command = `komodod -ac_name=${chainsinfo[i].coin} -ac_cc=1 -ac_supply=${chainsinfo[i].supply} -ac_end=0 -ac_reward=${chainsinfo[i].reward} -ac_halving=0 -ac_decay=0 -addnode=${config.ac_seed[0]} -addnode=${config.ac_seed[1]} -addnode=${config.ac_seed[2]} -addnode=${config.ac_seed[3]} -addnode=${config.ac_seed[4]} -addnode=${config.ac_seed[5]} -addnode=${config.ac_seed[6]} -addnode=${config.ac_seed[7]} -addnode=${config.ac_seed[8]} -addnode=${config.ac_seed[9]} -addnode=${config.ac_seed[10]} -addnode=${config.ac_seed[11]} -addnode=${config.ac_seed[12]} -addnode=${config.ac_seed[13]} -addnode=${config.ac_seed[14]} -addnode=${config.ac_seed[15]} # rpcport ${chainsinfo[i].rpcport}`
		//console.log(ac_command);
		var ac_script_path = `${ac_data}/ac_${chainsinfo[i].coin}.sh`
		//console.log(ac_script_path);

	    return new Promise(function(resolve, reject) {
	    	fs.pathExists(`${mm_data}/${chainsinfo[i].coin}.sh`, (err, exists) => {
				var result = 'startmm_script_exists is done'
				//console.log(result)
				//resolve(exists);

				if (exists === true) {
					//console.log(`>>>>>>> ${mm_data}/${chainsinfo[i].coin}.sh file exists. DELETEING...`);
					fs.removeSync(`${mm_data}/${chainsinfo[i].coin}.sh`); // Removed existing mm script file.
					fs.removeSync(ac_script_path); // Removed existing ac script file.
					//console.log(`>>>>>>> ${mm_data}/${chainsinfo[i].coin}.sh file DELETED...`);
					var return_data = [mm_params, ac_script_path, ac_command]
					resolve(return_data);
				} else if (exists === false) {
					//console.log(`>>>>>>> ${mm_data}/${chainsinfo[i].coin}.sh file doesn't exists. CREATING...`);
					var return_data = [mm_params, ac_script_path, ac_command]
					resolve(return_data);
	    		}
	    	if (err) { console.error(err);  } // => null
	    	});
	    })
	}

		
	var create_startmm_script = function(ac_script_path, ac_script_data, mm_script_path, mm_script_data, coin_name) {
		
		return new Promise(function(resolve, reject) {
			//console.log('Script Data: '+mm_script_data);
			var result = 'create_startmm_script is done'

			/////////// PM2 MM JSON SCRIPT OBJECTS //////////
			fs.outputFileSync(mm_script_path, mm_script_data, function (err) {
				if (err) throw err;
			});

			_tempMMAppObject = {
				"name": `mm_${coin_name}`,
				"script": `${mm_script_path}`,
				"cwd": path.join(__dirname, '../assets/mmdata')
			}
			//console.log(_tempMMAppObject);
			pm2_mm_apps.apps.push(_tempMMAppObject);
			//////////////////////////////////////////////////


			/////////// PM2 ASSETCHAINS JSON SCRIPT OBJECTS //////////
			fs.outputFileSync(ac_script_path, ac_script_data, function (err) {
				if (err) throw err;
			});

			_tempACAppObject = {
				"name": `ac_${coin_name}`,
				"script": `${ac_script_path}`,
				"cwd": path.join(__dirname, '../assets/ac_data')
			}
			//console.log(_tempACAppObject);
			pm2_ac_apps.apps.push(_tempACAppObject);
			//////////////////////////////////////////////////

			if (chainsinfo[i].coin == coin_name) {
				//console.log(pm2_mm_apps);
				console.log('>>>>>>> marketmaker pm2 starter script created in defined range <<<<<<<');
				console.log('-------------------');
				console.log(`Please use the following commands to start all MarketMakers and ASSETCHAINS:`);
				console.log(`MARKETMAKERS: ${FgGreen}pm2 start pm2_mm_apps.json${Reset}`);
				console.log(`ASSETCHAINS: ${FgGreen}pm2 start pm2_ac_apps.json${Reset}`);
				console.log(`To list all PM2 processes: ${FgBlue}pm2 list${Reset}`);
				console.log(`To monitor all PM2 processes: ${FgBlue}pm2 monit${Reset}`);
				console.log(`To stop all PM2 processes: ${FgRed}pm2 delete all${Reset}`);
				console.log('-------------------');
				console.log(`To restart, reload (Graceful), stop or delete pm2 processs Only MARKETMAKERS or ASSETCHAINS use .json script like this:`)
				console.log(`${FgMagenta}pm2 restart/reload/stop/delete pm2_mm_apps.json${Reset}`)
				console.log(`${FgMagenta}pm2 restart/reload/stop/delete pm2_ac_apps.json${Reset}`)
				console.log('-------------------');
				fs.writeJsonSync('./pm2_mm_apps.json', pm2_mm_apps);
				fs.writeJsonSync('./pm2_ac_apps.json', pm2_ac_apps);
			}

			/*fs.appendFileSync('start_all_mm.sh', `pm2 start ${mm_script_path} --name=${coin_name}
	`);
			fs.chmodSync('start_all_mm.sh', '755');*/

			//console.log(result)
			resolve(result);
		})
	}

	var startmm_pm2 = function(coin_name, script_path) {

		return new Promise(function(resolve, reject) {
			pm2.connect(function(err) {
				if (err) {
					console.error(err);
					process.exit(2);
			}

			pm2.start(script_path, {
				name: coin_name, scriptArgs: [``]
				}, function(err, proc) {
					pm2.disconnect();   // Disconnects from PM2
					if (err) throw err
				})
			});
			var result = 'startmm_pm2 is done'

			//console.log(result)
			resolve(result);
		})
	}


	startmm_script_exists()
	.then(function(data) { 
		//console.log(data);
		//console.log('this is the mm_params: '+ data[0]);
		//console.log('this is the ac_script_path: '+ data[1]);
		//console.log('this is the ac_command: '+ data[2]);
		return create_startmm_script(data[1], data[2], `${mm_data}/${chainsinfo[i].coin}.sh`, `${mmPath} "${data[0]}"`,chainsinfo[i].coin);
	})
	//.then( startmm_pm2(chainsinfo[i].coin, `${mm_data}/${chainsinfo[i].coin}.sh`))


	/*
		function create_startmm_script() {
			fs.outputFileSync(`${mm_data}/${chainsinfo[i].coin}.sh`, `${mmPath} "${mm_params}"`, function (err) {
				if (err) throw err;
			});
			//startmm_pm2(chainsinfo[i].coin, `${mm_data}/${chainsinfo[i].coin}.sh`);
		}

		function startmm_pm2(coin_name, script_path) {
			pm2.connect(function(err) {
				if (err) {
					console.error(err);
					process.exit(2);
			}

			pm2.start(script_path, {
				name: coin_name, scriptArgs: [``]
				}, function(err, proc) {
					pm2.disconnect();   // Disconnects from PM2
					if (err) throw err
				})
			});
		}
	*/	

	
	if (chainsinfo[i].coin == chainsinfo[config.ac_range[1]].coin) {
		break;
	}
}












