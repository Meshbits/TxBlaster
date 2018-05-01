# TxBlaster
Komodo Transactions Scalability Test

## Requirements

 - Install `komodod` and run TXSCL assetchain. As of now only assetchains from range TXCSL - TXSCL007 are supported. More will be added soon.
 - Node.js 8.x
 - Operating Systems: MacOS or Ubuntu 16.04


## Installation

### Komodo setup
To setup Komodo on your machine you can use this repo, which will auto setup Komodo on your linux machine:

https://github.com/Meshbits/komodo_scripts

### Install node.js:
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install requires global node modules/commands: PM2
```shell
sudo npm install -g pm2
```


### Install TxBlaster
NOTE: Right now it's only command line and not the full web app is being used. Just few command line scripts within this app.

```shell
cd ~
git clone https://github.com/Meshbits/TxBlaster.git
cd TxBlaster

# Make config.json by copying sample file
cp -av sampleconfig.json config.json

# Complete installation with this
npm install
```


### Edit config.json
`config.json` includes your `passphrase` and the range of `marketmaker` daemons you want to run on your machine.

Example if you want to only run the first 5 assetchains to do transaction blasing, then specify the `ac_range` as `0, 4`. (The number starts from 0, instead of 1).
It will select first 5 assetchains from the list and make script to launch only first 5 assetchains.

This option is useful in case you only want to test txblaster for specific assetchains, in case you want to put less load on your machine and setting the txblaster in batches on multiple machines. This assetchain range specification helps.

Default `ac_range` is specified as `0,8` as it's first assetchains TXSCL to TXCSL007. This whole setup depends on Insight Explorers, as soon as other explorers are setup and ready other chains will be enabled, or users/testers will be informed to raise the range above 8 if they wish to.


 - `as_range` - You can leave it's value as is or just change it between the ranges 0 to 4097.
 - `passphrase` - Just input your `passphrase` there replacing the default value `testpass`.

 MAKE SURE YOU CHANGE THE PASSPHRASE, AND DON'T USE `testpass`.



### Start `marketmaker` daemons
To start the `marketmaker` daemons you need to execute the following command, which will generate the launch script.

```shell
cd ~/TxBlaster/private/
node mmd.js
```

Executing the above command will give the output like this:
```shell
$ node mmd.js 
ASSETCHAIN ARRAY RANGE: 2220 to 2221
ASSETCHAIN RANGE START: TXSCL8ab
ASSETCHAIN RANGE STOP: TXSCL8ac
>>>>>>> marketmaker pm2 starter script created in defined range <<<<<<<
-------------------
Please use the following commands to start all MarketMakers and ASSETCHAINS:
MARKETMAKERS: pm2 start pm2_mm_apps.json
ASSETCHAINS: pm2 start pm2_ac_apps.json
To list all PM2 processes: pm2 list
To monitor all PM2 processes: pm2 monit
To stop all PM2 processes: pm2 delete all
-------------------
To restart, reload (Graceful), stop or delete pm2 processs Only MARKETMAKERS or ASSETCHAINS use .json script like this:
pm2 restart/reload/stop/delete pm2_mm_apps.json
pm2 restart/reload/stop/delete pm2_ac_apps.json
-------------------
```


If you see this output, everything is good.


NOTE 1: Before you start the `marketmaker` daemons for txblasting make sure all the assetchains (From TXCSL to TXCSL007) are up and running and are in full sync with the network.
NOTE 2: Make sure the assetchains are from Komodo branch `jl777`.


To start `marketmaker` daemons execute this command:
```shell
cd ~/TxBlaster/assets/mmdata/
pm2 start ~/TxBlaster/private/pm2apps.json
```

You can igore any messages about the daemons saying stopped and some saying online. They may take some time to come online. You can keep track of these with commands:
```shell
# To list all processes with pm2
pm2 list

# To see more detailed monitoring of the processes and their console outputs
pm2 monit
```

If you want to stop the `marketmaker` daemons, please use this command instead of `pkill`:
```shell
pm2 delete all
```



### Fire the Transaction Blaster command
To this point it's expected that your assetchains and `marketmaker` daemons are all setup and ready.

Execute the transaction blaster command:
```shell
cd ~/TxBlaster/private/
node txblast.js
```

If you get the output like this and get back to the command prompt, you need to send some funds the assetchain and address you get in this output:
```shell
$ node txblast.js 
71d10f908429f567e652aa5e6408c9a0df52f485efc9fc4d026a17ce606ce0f7
ASSETCHAIN ARRAY RANGE: 0 to 8
TX BLASTING ASSETCHAIN RANGE START: TXSCL
TX BLASTING ASSETCHAIN RANGE STOP: TXSCL007
EXECUTING >>>>>> TXSCL
EXECUTING >>>>>> TXSCL000
EXECUTING >>>>>> TXSCL001
EXECUTING >>>>>> TXSCL002
EXECUTING >>>>>> TXSCL003
EXECUTING >>>>>> TXSCL004
EXECUTING >>>>>> TXSCL005
EXECUTING >>>>>> TXSCL006
EXECUTING >>>>>> TXSCL007
TXSCL007
TXSCL007:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL003
TXSCL003:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL001
TXSCL001:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL006
TXSCL006:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL
TXSCL:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL004
TXSCL004:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL005
TXSCL005:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL002
TXSCL002:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
TXSCL000
TXSCL000:>>> EMPTY ADDRESS. TO GET STARTED, PLEASE SEND SOME COINS TO RWCNCMiaAjz8DcfrX8n1Fqi2FXr7j88QkQ
```


Once you have sent the funds to the assetchains/address mentioned in this output, run the txblast script again.

You should see the output like this.
```shell
$ node txblast.js 
30c72242c58f29513f7d0d512ac15bc35a32595491dad02c46fbf55c729ba688
ASSETCHAIN ARRAY RANGE: 0 to 8
TX BLASTING ASSETCHAIN RANGE START: TXSCL
TX BLASTING ASSETCHAIN RANGE STOP: TXSCL007
EXECUTING >>>>>> TXSCL
EXECUTING >>>>>> TXSCL000
EXECUTING >>>>>> TXSCL001
EXECUTING >>>>>> TXSCL002
EXECUTING >>>>>> TXSCL003
EXECUTING >>>>>> TXSCL004
EXECUTING >>>>>> TXSCL005
EXECUTING >>>>>> TXSCL006
EXECUTING >>>>>> TXSCL007
TXSCL006
TXSCL006 amount: 50
TXSCL006 satoshis(sats): 5000000000
ad0bdef658f96cb816d9c722d498720ae0a510295889dc14bd11b6fcdfa11884
1
5000000000
RUNNING TX BLASTER FOR TXSCL006
#########################################################
TXSCL005
TXSCL005 amount: 50
TXSCL005 satoshis(sats): 5000000000
f0d2b41efe0da971504c9f598fe1893c668e4589f08299547e72c480fcdaa667
1
5000000000
RUNNING TX BLASTER FOR TXSCL005
#########################################################
TXSCL002
TXSCL002 amount: 50
TXSCL002 satoshis(sats): 5000000000
11fb0b04976260246b2651412c691ed86e38d2dedb25eed50e9eb84387adec07
1
5000000000
RUNNING TX BLASTER FOR TXSCL002
#########################################################
....
....

```


To this point your txblaster is running in loop for ALL assetchains.


### Notes for Transaction Blaster script
In case the funds are emptied from the address, you don't need to kill the `txblast.js` command/script. It'll be displaying the message that the required size of UTXO is not found, means the amount in your address left isn't much enought to make further txblasts.
Just send more amount/funds to the same address you sent before and it will pickup the updates in next retry which happens every 30 seconds for all assetchains asynchronously.

The txblast script is set to send 1000 transaction blasts in one attempt.

You'll keep getting the output of the txblast command as it completes or fails.

You can monitor the output of txblast command on txblast screen output, and the view all console output of the `marketmaker` use `pm2 monit` command. Explorer `pm2 monit` to find out how to see the console outputs of specific `marketmaker`. I don't know much about `pm2 monit` yet. :)


## Enjoy Transaction Blasting and Thank you for participating in Komodo Scalability test.