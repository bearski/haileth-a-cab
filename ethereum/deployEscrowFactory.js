const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/EscrowFactory.json');

const provider = new HDWalletProvider(
  'coffee help snack state credit nurse piano impose glue crawl equal eye', // account mnemonic
  'https://rinkeby.infura.io/v3gxKB8rcIJvR5IzMWKd'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '5000000', from: accounts[0] });

  console.log('EscrowFactory deployed to', result.options.address);
};
deploy();
