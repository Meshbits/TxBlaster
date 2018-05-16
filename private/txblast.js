const request = require('request-promise'),
      sha256 = require('sha256'),
      fs = require('fs-extra');

const config = fs.readJsonSync('../config.json');
const chainsinfo = fs.readJsonSync('../chainsinfo.json');

//console.log(config.passphrase);
//console.log(config.addresslist);

//console.log('startup'+config.passphrase);

const userpass = sha256('startup'+config.passphrase);
console.log(userpass);

//console.log(chainsinfo);

console.log('ASSETCHAIN ARRAY RANGE: ' + config.ac_range[0] + ' to ' + config.ac_range[1]);
console.log('TX BLASTING ASSETCHAIN RANGE START: ' + chainsinfo[config.ac_range[0]].coin);
console.log('TX BLASTING ASSETCHAIN RANGE STOP: ' + chainsinfo[config.ac_range[1]].coin);


//INITIALISE///////////////////////////////////////////////////

function Init() {
  for (let i=config.ac_range[0]; i<chainsinfo.length; i++) {
    //console.log(chainsinfo[i].coin);
    //console.log(chainsinfo[i].mmport);
    GetAddress(chainsinfo[i]);
    if (chainsinfo[i].coin == chainsinfo[config.ac_range[1]].coin) {
      break;
    }
  }
  //GetAddress(chainsinfo[1]);
}

Init();

//CALCULATE ADDRESS///////////////////////////////////////////////////

function GetAddress(chainsdata) {
  console.log('EXECUTING >>>>>> '+chainsdata.coin);
  var CalcAddrOptions = {
    url: `http://127.0.0.1:${chainsdata.mmport}`,
    method: 'POST',
    body: JSON.stringify({"userpass":userpass,"passphrase":config.passphrase,"method":"calcaddress","coin":chainsdata.coin})
  };
  //console.log(CalcAddrOptions);


  function CalcAddress(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      //console.log(JSON.parse(body));
      
      //console.log(JSON.parse(body).coinaddr);
      ListUnspent(JSON.parse(body).coinaddr, chainsdata);
      //console.log(response);
    } else {
      console.log(error);
      /*res.end(body ? body : JSON.stringify({
        result: 'error',
        error: {
          code: -777,
          message: `unable to call method ${_cmd} at port ${shepherd.rpcConf[req.body.payload.chain].port}`,
        },
      }));*/
    }
  }

  request(CalcAddrOptions, CalcAddress);
}


//LIST TRANSACTIONS///////////////////////////////////////////////////


function ListUnspent(coinaddr, chainsdata) {
  var ListUnspentOptions = {
    url: `http://${chainsdata.coin}.meshbits.io/insight-api/addr/${coinaddr}/utxo`,
    method: 'GET',
    json: true
  };

  //console.log(ListUnspentOptions);


  function listunspent_cb(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      
      console.log(chainsdata.coin);
      //console.log(body);

      if (body.length == 0) {
        console.log(`${chainsdata.coin}:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO ${coinaddr}`)
      }

      for (let i=0; i<body.length; i++) {
        console.log(`${chainsdata.coin} amount: ${body[i].amount}`);
        console.log(`${chainsdata.coin} satoshis(sats): ${body[i].satoshis}`);
        if (body[i].satoshis >= 1000000) {
          console.log(body[i].txid);
          console.log(body[i].vout);
          console.log(body[i].satoshis);
          console.log(`RUNNING TX BLASTER FOR ${chainsdata.coin}`);
          console.log(`#########################################################`);
          TxBlaster(body[i], chainsdata);
          break;
        } else {
          console.log(`Looks like there aren't enough good amount utxos to make transactions blast for ${chainsdata.coin}. Please send UTXO bigger than amount 1 to address: ${coinaddr}`);
          console.log(`TRANSACTION BLAST STOPPED FOR COIN: ${chainsdata.coin}`);
          console.log(`WILL TRY THIS CHAIN IN 30 SECONDS AGAIN.`);
          console.log(`#########################################################`);
          setTimeout(function(){ GetAddress(chainsdata) }, 30 * 1000);
          break;
        }
      }
    } else if (response &&
        response.statusCode &&
        response.statusCode === 400) {
          console.log(body);
          if (body == 'No information available for address. Code:-5') {
            console.log(`${chainsdata.coin}:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO ${coinaddr}`)
          }
    } else {
      console.log(error);
    }
  }


  request(ListUnspentOptions, listunspent_cb);
}





//TX BLASTER///////////////////////////////////////////////////


function TxBlaster(txdata, chainsdata) {
  var txblastOptions = {
    url: `http://127.0.0.1:${chainsdata.mmport}`,
    method: 'POST',
    body: JSON.stringify({"userpass":userpass,"broadcast":1,"numblast":100000,"password":config.passphrase,"utxotxid":txdata.txid,"utxovout":txdata.vout,"utxovalue":txdata.satoshis,"txfee":50000,"method":"txblast","coin":chainsdata.coin,"outputs":config.addresslist})
  };


  function blasttransactions(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      console.log(body);
      console.log(`#########################################################`);
      GetAddress(chainsdata);
      //console.log(response);
    } else {
      console.log(error);
      /*res.end(body ? body : JSON.stringify({
        result: 'error',
        error: {
          code: -777,
          message: `unable to call method ${_cmd} at port ${shepherd.rpcConf[req.body.payload.chain].port}`,
        },
      }));*/
    }
  }


  request(txblastOptions, blasttransactions);

}












