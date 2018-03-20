const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/DriverFactory.json');

const provider = new HDWalletProvider(
  'coffee help snack state credit nurse piano impose glue crawl equal eye', // account mnemonic
  'https://rinkeby.infura.io/v3gxKB8rcIJvR5IzMWKd'                          // Test Ethereum Network (Rinkeby)
);

const web3 = new Web3(provider);

const deploy = async () => {                                                // helper to use async-await syntax for deploy
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[0])            // Attempting to deploy from account  0xCB2B908B49bf55E9e7a700d83072C541918e8571

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

    console.log('Factory contact deployed to ', result.options.address)     // Contact deployed to  0x5427Fdb903FC380c485657cD6307f5945B9Ba4E5
}

deploy()
