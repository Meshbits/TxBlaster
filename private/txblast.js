const request = require('request-promise'),
      sha256 = require('sha256'),
      fs = require('fs-extra');

const config = fs.readJsonSync('../config.json');
const chainsinfo = fs.readJsonSync('../chainsinfo.json');

const ac_conf = require("./js/ac_conf.js");

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

function GetAddress(chainsdata,txblast_data) {

  if (txblast_data == undefined) {
    console.log('GetAddress txblast_data not supplied');
  } else {
    console.log('GetAddress txblast_data found. passing it further...');
  }
  
  console.log(chainsdata.coin);
  ac_conf.status(chainsdata.coin, function(err, status) {
    //console.log(status);
    console.log(status[0].rpcuser);
    console.log(status[0].rpcpass);
    console.log(status[0].rpcport);

    var GetInfoOptions = {
      url: `http://${status[0].rpcuser}:${status[0].rpcpass}@127.0.0.1:${status[0].rpcport}`,
      method: 'POST',
      body: JSON.stringify({"jsonrpc": "1.0", "id":"curltest", "method": "getinfo", "params": [] })
    };
    //console.log(GetInfoOptions);

    function GetInfo(error, response, body) {
      if (response &&
          response.statusCode &&
          response.statusCode === 200) {
        //console.log(JSON.parse(body));
        //console.log(JSON.parse(body).result.blocks)
        
        if (JSON.parse(body).result.blocks !== 0) {
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
              ListUnspent(JSON.parse(body).coinaddr, chainsdata, txblast_data);
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

    request(GetInfoOptions, GetInfo);

  });
}


//LIST TRANSACTIONS///////////////////////////////////////////////////


function ListUnspent(coinaddr, chainsdata, txblast_data) {
  

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
          console.log(body[i]);
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

  if (txblast_data == undefined) {
    console.log('ListUnspent txblast_data not supplied');
    request(ListUnspentOptions, listunspent_cb);
  } else {
    //console.log('ListUnspent txblast_data: ' + txblast_data);
    var tx_data = {};
    tx_data.txid = JSON.parse(txblast_data).lastutxo;
    tx_data.vout = JSON.parse(txblast_data).lastutxovout;
    tx_data.satoshis = JSON.parse(txblast_data).lastutxovalue*100000000;
    console.log('ListUnspent tx_data: ' + JSON.stringify(tx_data, null, 2));
    if (tx_data.satoshis >= 1000000) {
      console.log(`RUNNING TX BLASTER FOR ${chainsdata.coin}`);
      console.log(`#########################################################`);
      TxBlaster(tx_data, chainsdata);
    } else {
      console.log(`Looks like there aren't enough good amount utxos to make transactions blast for ${chainsdata.coin}. Please send UTXO bigger than amount 1 to address: ${coinaddr}`);
      console.log(`TRANSACTION BLAST STOPPED FOR COIN: ${chainsdata.coin}`);
      console.log(`WILL TRY THIS CHAIN IN 30 SECONDS AGAIN.`);
      console.log(`#########################################################`);
      setTimeout(function(){ GetAddress(chainsdata) }, 30 * 1000);
    }
    
    
  }
  
}





//TX BLASTER///////////////////////////////////////////////////


function TxBlaster(txdata, chainsdata) {
  var txblastOptions = {
    url: `http://127.0.0.1:${chainsdata.mmport}`,
    method: 'POST',
    body: JSON.stringify({"userpass":userpass,"broadcast":1,"numblast":100000,"password":config.passphrase,"utxotxid":txdata.txid,"utxovout":txdata.vout,"utxovalue":txdata.satoshis,"txfee":50000,"method":"txblast","coin":chainsdata.coin,"outputs":config.addresslist})
  };

  //console.log(txblastOptions.body);

  function blasttransactions(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      console.log(body);
      console.log(`#########################################################`);
      GetAddress(chainsdata, body);
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












