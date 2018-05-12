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
whitelist=127.0.0.1
txindex=1
addressindex=1
timestampindex=1
spentindex=1
zmqpubrawtx=tcp://127.0.0.1:${chainsinfo[i].zmqport}
zmqpubhashblock=tcp://127.0.0.1:${chainsinfo[i].zmqport}
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
#cp -av ${os.homedir()}/explorers/TXSCL ${os.homedir()}/explorers/${chainsinfo[i].coin}
mkdir -p ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules
cp -av ${os.homedir()}/explorers/TXSCL/txscl* ${os.homedir()}/explorers/${chainsinfo[i].coin}/
cp -av ${os.homedir()}/explorers/TXSCL/bitcore-node.json ${os.homedir()}/explorers/${chainsinfo[i].coin}/
cp -av ${os.homedir()}/explorers/TXSCL/package.json ${os.homedir()}/explorers/${chainsinfo[i].coin}/
cp -av ${os.homedir()}/explorers/TXSCL/start.sh ${os.homedir()}/explorers/${chainsinfo[i].coin}/

ln -s ${os.homedir()}/explorers/TXSCL/node_modules/.bin ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/accepts ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/after ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ajv ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/arr-diff ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/arr-flatten ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/arr-union ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/array-each ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/array-flatten ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/array-slice ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/array-unique ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/arraybuffer.slice ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/asn1 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/assert-plus ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/assign-symbols ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/async ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/asynckit ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/atob ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/aws-sign2 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/aws4 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/backo2 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/base ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/base64-arraybuffer ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/base64id ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/basic-auth ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bcrypt-pbkdf ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/better-assert ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bindings ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bitcoind-rpc ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bitcore-lib ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bitcore-message ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bitcore-node ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/blob ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/body-parser ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/boom ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/braces ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bufferutil ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/bytes ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/cache-base ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/callsite ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/camel-case ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/caseless ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/checkup ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/class-utils ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/clean-css ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/co ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/collection-visit ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/colors ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/combined-stream ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/commander ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/component-bind ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/component-emitter ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/component-inherit ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/compressible ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/compression ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/content-disposition ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/content-type ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/cookie ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/cookie-signature ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/copy-descriptor ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/core-util-is ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/cryptiles ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/css-b64-images ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/dashdash ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/debug ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/decode-uri-component ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/define-property ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/delayed-stream ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/depd ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/destroy ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/detect-file ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ecc-jsbn ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ee-first ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/encodeurl ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/engine.io ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/engine.io-client ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/engine.io-parser ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/errno ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/escape-html ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/etag ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/execon ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/expand-brackets ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/expand-tilde ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/express ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/extend ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/extend-shallow ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/extglob ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/extsprintf ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fast-deep-equal ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fast-json-stable-stringify ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fill-range ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/finalhandler ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/findup-sync ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fined ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/flagged-respawn ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/for-in ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/for-own ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/forever-agent ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/form-data ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/forwarded ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fragment-cache ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/fresh ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/get-value ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/getpass ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/global-modules ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/global-prefix ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/har-schema ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/har-validator ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/has-binary ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/has-cors ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/has-value ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/has-values ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/hawk ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/he ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/hoek ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/homedir-polyfill ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/html-minifier ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/http-errors ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/http-signature ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/iconv-lite ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/indexof ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/inherits ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ini ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/insight-api ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ipaddr.js ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-absolute ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-accessor-descriptor ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-buffer ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-data-descriptor ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-descriptor ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-extendable ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-extglob ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-glob ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-number ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-odd ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-plain-object ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-relative ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-typedarray ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-unc-path ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/is-windows ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/isarray ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ischanged ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/isexe ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/isobject ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/isstream ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/jsbn ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/json-schema ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/json-schema-traverse ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/json-stringify-safe ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/json3 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/jsprim ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/kind-of ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/liftoff ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/lodash ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/lower-case ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/lru-cache ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/make-iterator ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/map-cache ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/map-visit ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/media-typer ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/merge-descriptors ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/methods ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/micromatch ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/mime ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/mime-db ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/mime-types ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/minify ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/minimist ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/mixin-deep ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/mkdirp ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/morgan ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ms ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/nan ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/nanomatch ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/negotiator ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/no-case ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/oauth-sign ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object-assign ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object-component ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object-copy ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object-visit ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object.defaults ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object.map ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/object.pick ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/on-finished ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/on-headers ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/options ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/param-case ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parse-filepath ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parse-passwd ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parsejson ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parseqs ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parseuri ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/parseurl ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/pascalcase ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/path-is-absolute ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/path-parse ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/path-root ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/path-root-regex ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/path-to-regexp ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/performance-now ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/posix-character-classes ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/proxy-addr ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/prr ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/pseudomap ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/punycode ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/qs ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/range-parser ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/raw-body ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/readjson ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/rechoir ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/regex-not ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/relateurl ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/repeat-element ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/repeat-string ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/request ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/resolve ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/resolve-dir ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/resolve-url ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ret ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/safe-buffer ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/safe-regex ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/semver ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/send ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/serve-static ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/set-value ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/setprototypeof ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/snapdragon ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/snapdragon-node ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/snapdragon-util ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/sntp ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/socket.io ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/socket.io-adapter ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/socket.io-client ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/socket.io-parser ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/source-map ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/source-map-resolve ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/source-map-url ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/split-string ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/sshpk ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/static-extend ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/statuses ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/stringstream ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/timem ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/to-array ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/to-object-path ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/to-regex ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/to-regex-range ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/tomas ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/tough-cookie ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/try-catch ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/tunnel-agent ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/tweetnacl ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/type-is ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/uglify-js ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ultron ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/unc-path-regex ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/union-value ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/unpipe ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/unset-value ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/upper-case ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/urix ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/use ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/utf-8-validate ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/utils-merge ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/uuid ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/vary ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/verror ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/which ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/writejson ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/ws ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/wtf-8 ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/xmlhttprequest-ssl ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/yallist ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/yeast ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
ln -s ${os.homedir()}/explorers/TXSCL/node_modules/zmq ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
cp -av ${os.homedir()}/explorers/TXSCL/node_modules/insight-ui ${os.homedir()}/explorers/${chainsinfo[i].coin}/node_modules/
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
				"rpchost": "127.0.0.1",
				"rpcport": ${chainsinfo[i].rpcport},
				"rpcuser": "${config.insight_setup.rpcuser}",
				"rpcpassword": "${config.insight_setup.rpcpassword}",
				"zmqpubrawtx": "tcp://127.0.0.1:${chainsinfo[i].zmqport}"
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
				"script": `${os.homedir()}/explorers/${chainsinfo[i].coin}/start.sh`,
				"cwd": `${os.homedir()}/explorers/${chainsinfo[i].coin}/`
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
				fs.outputFileSync(`./pm2_insight_apps_${config.ac_range[0]}_${config.ac_range[1]}.json`, JSON.stringify(pm2_insight_apps, null, 2));
			}
			break;
		}
	}

}

