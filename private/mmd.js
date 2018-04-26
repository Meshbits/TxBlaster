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
const mm_data = path.join(__dirname, '../assets/mmdata');

fs.removeSync(`start_all_mm.sh`); // Removed existing file mm start file
fs.appendFileSync('start_all_mm.sh', `cd ${mm_data}
`);

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

//console.log(_defaultUserHome);
//console.log(mmPath);

for (let i=0; i<config.chainsinfo.length; i++) {
/*	console.log(config.chainsinfo[i].coin);
	//console.log(config.chainsinfo[i].supply);
	//console.log(config.chainsinfo[i].rpcport);
	//console.log(config.chainsinfo[i].mmport);

	var _coins = `[{\"coin\":\"${config.chainsinfo[i].coin}\",\"asset\":\"${config.chainsinfo[i].coin}\",\"rpcport\":${config.chainsinfo[i].rpcport}}]`
	//_coins = _coins.replace(/"/g, '\\"');

	//var _coins = `"[{"coin":"${config.chainsinfo[i].coin}","asset":"${config.chainsinfo[i].coin}","rpcport":${config.chainsinfo[i].rpcport}}]"`;
	//console.log(_coins);

	var mm_params = `{\"gui\":\"nogui\",\"client\":1, \"userhome\":\"${_defaultUserHome}\", \"passphrase\":\"${'startup'+config.passphrase}\", \"coins\":${_coins}, \"rpcport\":${config.chainsinfo[i].mmport}}`;
	mm_params = mm_params.replace(/"/g, '\\"');
	//console.log(mm_params);
	//console.log(mmPath);
	//var mm_process = `${mmPath} "{"gui":"nogui","client":1, "userhome":"${_defaultUserHome}"}", "passphrase":"${'startup'+config.passphrase}", "coins":${_coins}, "rpcport":${config.chainsinfo[i].mmport}}"`;
	//console.log(mm_process);


	

	fs.pathExists(`${mm_data}/${config.chainsinfo[i].coin}.sh`, (err, exists) => {
		if (exists === true) {
			console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file exists. DELETEING...`);
			fs.removeSync(`${mm_data}/${config.chainsinfo[i].coin}.sh`); // Removed existing file.
			console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file DELETED...`);
			console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh CREATING FRESH...`);
			//create_startmm();

			console.log(mm_params);
			create_startmm_script(`${mm_data}/${config.chainsinfo[i].coin}.sh`, `${mmPath} "${mm_params}"`)
			.then(function(result) { 
				return startmm_pm2(config.chainsinfo[i].coin, `${mm_data}/${config.chainsinfo[i].coin}.sh`);
			})
		} else if (exists === false) {
			console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file doesn't exists. CREATING...`);

			// Write shell script to start the marketmaker with specific coin and settings
			//console.log(`${mmPath} "${mm_params}"`);
			//create_startmm();

			create_startmm_script(`${mm_data}/${config.chainsinfo[i].coin}.sh`, `${mmPath} "${mm_params}"`)
			.then(function(result) { 
				return startmm_pm2(config.chainsinfo[i].coin, `${mm_data}/${config.chainsinfo[i].coin}.sh`);
			})
		}
		if (err) { console.error(err) } // => null
	});
*/
	
/*
	let mmid;
	var logStream = fs.createWriteStream(`${mm_data}/logFile.log`, { flags: 'a' });
	console.log('mm start\n' + `${mmPath} "${mm_params}"`)
	

	mmid = exec(`${mmPath} "${mm_params}"`, {
		cwd: mm_data,
		maxBuffer: 1024 * 50000 // 50 mb
	}, function (error, stdout, stderr) {
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
		if (error !== null) { console.error(`exec error: ${error}`); }
	});

	mmid.stdout.on('data', (data) => { console.log(`child stdout:\n${data}`); }).pipe(logStream);
	mmid.stderr.on('data', (data) => { console.error(`child stderr:\n${data}`); }).pipe(logStream);
*/

var startmm_script_exists = function() {
	console.log(config.chainsinfo[i].coin);
	//console.log(config.chainsinfo[i].supply);
	//console.log(config.chainsinfo[i].rpcport);
	//console.log(config.chainsinfo[i].mmport);

	var _coins = `[{\"coin\":\"${config.chainsinfo[i].coin}\",\"asset\":\"${config.chainsinfo[i].coin}\",\"rpcport\":${config.chainsinfo[i].rpcport}}]`
	//_coins = _coins.replace(/"/g, '\\"');

	//var _coins = `"[{"coin":"${config.chainsinfo[i].coin}","asset":"${config.chainsinfo[i].coin}","rpcport":${config.chainsinfo[i].rpcport}}]"`;
	//console.log(_coins);

	var mm_params = `{\"gui\":\"nogui\",\"client\":1, \"userhome\":\"${_defaultUserHome}\", \"passphrase\":\"${'startup'+config.passphrase}\", \"coins\":${_coins}, \"rpcport\":${config.chainsinfo[i].mmport}}`;
	mm_params = mm_params.replace(/"/g, '\\"');
	//console.log(mm_params);
	//console.log(mmPath);
	//var mm_process = `${mmPath} "{"gui":"nogui","client":1, "userhome":"${_defaultUserHome}"}", "passphrase":"${'startup'+config.passphrase}", "coins":${_coins}, "rpcport":${config.chainsinfo[i].mmport}}"`;
	//console.log(mm_process);

    return new Promise(function(resolve, reject) {
    	fs.pathExists(`${mm_data}/${config.chainsinfo[i].coin}.sh`, (err, exists) => {
			var result = 'startmm_script_exists is done'
			console.log(result)
			//resolve(exists);

			if (exists === true) {
				console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file exists. DELETEING...`);
				fs.removeSync(`${mm_data}/${config.chainsinfo[i].coin}.sh`); // Removed existing file.
				console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file DELETED...`);
				resolve(mm_params);
			} else if (exists === false) {
				console.log(`>>>>>>> ${mm_data}/${config.chainsinfo[i].coin}.sh file doesn't exists. CREATING...`);
				resolve(mm_params);
    		}
    	if (err) { console.error(err);  } // => null
    	});
    })
}

	
var create_startmm_script = function(script_path, script_data, coin_name) {
	
	return new Promise(function(resolve, reject) {
		//console.log('Script Data: '+script_data);
		fs.outputFileSync(script_path, script_data, function (err) {
			if (err) throw err;
		});
		var result = 'create_startmm_script is done'

		fs.appendFileSync('start_all_mm.sh', `pm2 start ${script_path} --name=${coin_name}
`);
		fs.chmodSync('start_all_mm.sh', '755');

		console.log(result)
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

		console.log(result)
		resolve(result);
	})
}


startmm_script_exists()
.then(function(mm_params) { 
	console.log('this is the '+ mm_params);
	return create_startmm_script(`${mm_data}/${config.chainsinfo[i].coin}.sh`, `${mmPath} "${mm_params}"`,config.chainsinfo[i].coin);
})
//.then( startmm_pm2(config.chainsinfo[i].coin, `${mm_data}/${config.chainsinfo[i].coin}.sh`))


/*
	function create_startmm_script() {
		fs.outputFileSync(`${mm_data}/${config.chainsinfo[i].coin}.sh`, `${mmPath} "${mm_params}"`, function (err) {
			if (err) throw err;
		});
		//startmm_pm2(config.chainsinfo[i].coin, `${mm_data}/${config.chainsinfo[i].coin}.sh`);
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

	
	if (config.chainsinfo[i].coin == 'TXSCL007') {
		break;
	}
}












