const request = require('request-promise'),
      sha256 = require('sha256'),
      fs = require('fs-extra');

const config = fs.readJsonSync('../config.json');

//console.log(config.passphrase);
//console.log(config.addresslist);

//console.log('startup'+config.passphrase);

const userpass = sha256('startup'+config.passphrase);
console.log(userpass);


//INITIALISE///////////////////////////////////////////////////

function Init() {
  GetAddress();
}

Init();

//CALCULATE ADDRESS///////////////////////////////////////////////////

function GetAddress() {
  var CalcAddrOptions = {
    url: `http://127.0.0.1:7783`,
    method: 'POST',
    body: JSON.stringify({"userpass":userpass,"passphrase":config.passphrase,"method":"calcaddress","coin":"TXSCL"})
  };


  function CalcAddress(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      //console.log(JSON.parse(body));
      console.log(JSON.parse(body).coinaddr);
      ListUnspent(JSON.parse(body).coinaddr);
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


function ListUnspent(coinaddr) {
  var ListUnspentOptions = {
    url: `http://txscl.meshbits.io/insight-api/addr/${coinaddr}/utxo`,
    method: 'GET',
    json: true
  };


  function listunspent(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      console.log(body);

      for (let i=0; i<body.length; i++) {
        console.log(body[i].satoshis);
        if (body[i].satoshis >= 1000000) {
          console.log(body[i].txid);
          console.log(body[i].vout);
          console.log(body[i].satoshis);
          TxBlaster(body[i]);
          break;
        } else {
          console.log(`Looks like there aren't enough good amount utxos to make transactions blast. Please send UTXO bigger than amount 1 to address: ${coinaddr}`);
        }
      }
    } else {
      console.log(error);
    }
  }


  request(ListUnspentOptions, listunspent);
}





//TX BLASTER///////////////////////////////////////////////////


function TxBlaster(txdata) {
  var txblastOptions = {
    url: `http://127.0.0.1:7783`,
    method: 'POST',
    body: JSON.stringify({"userpass":userpass,"broadcast":1,"numblast":100000,"password":config.passphrase,"utxotxid":txdata.txid,"utxovout":txdata.vout,"utxovalue":txdata.satoshis,"txfee":50000,"method":"txblast","coin":"TXSCL","outputs":config.addresslist})
  };


  function blasttransactions(error, response, body) {
    if (response &&
        response.statusCode &&
        response.statusCode === 200) {
      console.log(body);
      GetAddress();
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












