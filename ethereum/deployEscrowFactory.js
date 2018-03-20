const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiled = require('./build/EscrowFactory.json');

const provider = new HDWalletProvider(
  'coffee help snack state credit nurse piano impose glue crawl equal eye', // account mnemonic
  'https://rinkeby.infura.io/v3gxKB8rcIJvR5IzMWKd'                          // Test Ethereum Network (Rinkeby)
);

const web3 = new Web3(provider);

const deploy = async () => {                                                // helper to use async-await syntax for deploy
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[0])            // Attempting to deploy from account  0xCB2B908B49bf55E9e7a700d83072C541918e8571

  const result = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({ data: compiled.bytecode })
    .send({
      gas: '1000000',
      from: accounts[0]
    });

  console.log('Escrow contact deployed to ', result.options.address)         // Contact deployed to  0x8d152194fCe2e53fE05E39a3EE090C4416686082
}

deploy()
