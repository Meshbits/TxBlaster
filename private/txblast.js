const request = require('request-promise'),
      sha256 = require('sha256'),
      fs = require('fs-extra');

const config = fs.readJsonSync('../config.json');

//console.log(config.passphrase);
//console.log(config.addresslist);

//console.log('startup'+config.passphrase);

const userpass = sha256('startup'+config.passphrase);
console.log(userpass);

//console.log(config.chainsinfo);



//INITIALISE///////////////////////////////////////////////////

function Init() {
  for (let i=0; i<config.chainsinfo.length; i++) {
    //console.log(config.chainsinfo[i].coin);
    //console.log(config.chainsinfo[i].mmport);
    GetAddress(config.chainsinfo[i]);
    if (config.chainsinfo[i].coin == 'TXSCL007') {
      break;
    }
  }
  //GetAddress(config.chainsinfo[1]);
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
    body: JSON.stringify({"userpass":userpass,"broadcast":1,"numblast":1000,"password":config.passphrase,"utxotxid":txdata.txid,"utxovout":txdata.vout,"utxovalue":txdata.satoshis,"txfee":50000,"method":"txblast","coin":chainsdata.coin,"outputs":config.addresslist})
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












