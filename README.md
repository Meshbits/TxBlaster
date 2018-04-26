# TxBlaster
Komodo Transactions Scalability Test

### Requirements

 - Install `komodod` and run TXSCL assetchain. As of now only assetchains from range TXCSL - TXSCL007 are supported. More will be added soon.
 - Node.js 8.x


## Installation

#### Install node:
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install required global node modules/commands: PM2
```shell
sudo npm install -g pm2
```


#### Install TxBlaster
NOTE: Right now it's only command line and not the full web app is being used. Just few commandl line scripts within this app.

```shell
cd ~
git clone https://github.com/Meshbits/TxBlaster.git
cd TxBlaster

# Make config.json by copying sample file
cp -av sampleconfig.json config.json
```


##### Edit config.json
`config.json` includes your `passphrase` and the range of `marketmaker` daemons you want to run on your machine.

Example if you want to only run the first 5 assetchains to do transaction blasing, then specify the `ac_range` as `0, 4`. (The number starts from 0, instead of 1).
It will select first 5 assetchains from the list and make script to launch only first 5 assetchains.

This option is useful in case you only want to test txblaster for specific assetchains, in case you want to put less load on your machine and setting the txblaster in batches on multiple machines. This assetchain range specification helps.

Default `ac_range` is specified as `0,8` as it's first assetchains TXSCL to TXCSL007. This whole setup depends on Insight Explorers, as soon as other explorers are setup and ready other chains will be enabled, or users/testers will be informed to raise the range above 8 if they wish to.


 - `as_range` - You can leave it's value as is.
 - `passphrase` - Just input your `passphrase` there replacing the default value `testpass`. MAKE SURE YOU CHANGE THE PASSPHRASE, AND DON'T USE `testpass`.



