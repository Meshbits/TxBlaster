const request = require('request-promise');

var options = {
  url: `http://txscl.meshbits.io/insight-api/addr/RYC2nyQTxndiwWVmHXapccSMGSw7NNre77/utxo`,
  method: 'GET',
  json: true
};


function getutxoinfo(error, response, body) {
  if (response &&
      response.statusCode &&
      response.statusCode === 200) {
    console.log(body);

    for (let i=0; i<body.length; i++) {
      console.log(body[i].satoshis);
      if (body[i].satoshis >= 100000000) {
        console.log(body[i].txid);
        console.log(body[i].vout);
        console.log(body[i].satoshis);
        break;
      }
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





request(options, getutxoinfo);