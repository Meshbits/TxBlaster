const request = require('request-promise'),
	  sha256 = require('sha256'),
	  fs = require('fs-extra'),
	  path = require('path'),
	  os = require('os'),
	  pm2 = require('pm2'),
	  exec = require('child_process').exec,
	  _platform = os.platform();

const config = fs.readJsonSync('../config.json');

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
	//console.log(config.chainsinfo[i].coin);
	//console.log(config.chainsinfo[i].supply);
	//console.log(config.chainsinfo[i].rpcport);
	//console.log(config.chainsinfo[i].mmport);

	var _coins = `[{\"coin\":\"${config.chainsinfo[i].coin}\",\"asset\":\"${config.chainsinfo[i].coin}\",\"rpcport\":${config.chainsinfo[i].rpcport}}]`
	//_coins = _coins.replace(/"/g, '\\"');

	//var _coins = `"[{"coin":"${config.chainsinfo[i].coin}","asset":"${config.chainsinfo[i].coin}","rpcport":${config.chainsinfo[i].rpcport}}]"`;
	console.log(_coins);

	var mm_params = `{\"gui\":\"nogui\",\"client\":1, \"userhome\":\"${_defaultUserHome}\", \"passphrase\":\"${'startup'+config.passphrase}\", \"coins\":${_coins}, \"rpcport\":${config.chainsinfo[i].mmport}}`;
	mm_params = mm_params.replace(/"/g, '\\"');
	console.log(mm_params);
	//console.log(mmPath);
	//var mm_process = `${mmPath} "{"gui":"nogui","client":1, "userhome":"${_defaultUserHome}"}", "passphrase":"${'startup'+config.passphrase}", "coins":${_coins}, "rpcport":${config.chainsinfo[i].mmport}}"`;
	//console.log(mm_process);

	let mmid;
	var mm_data = path.join(__dirname, '../assets/mmdata/');
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

/*
	pm2.connect(function(err) {
		if (err) {
			console.error(err);
			process.exit(2);
	}

	pm2.start(mmPath, {
		name: 'test', scriptArgs: [`"${mm_params}"`]
	}, function(err, proc) {
		pm2.disconnect();   // Disconnects from PM2
    	if (err) throw err
	})
	});
*/
	
	if (config.chainsinfo[i].coin == 'TXSCL000') {
		break;
	}
}