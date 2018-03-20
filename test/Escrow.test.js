const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/EscrowFactory.json');
const compiledEscrow = require('../ethereum/build/Escrow.json');

let accounts;
let factory;
let escrowAddress;
let escrow;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createEscrow('100', accounts[1])
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  [escrowAddress] = await factory.methods.getEscrowDb().call();
  
  escrow = await new web3.eth.Contract(
    JSON.parse(compiledEscrow.interface),
    escrowAddress
  );
});

describe('Escrow', () => {
  it('deploys a factory and an escrow', () => {
    assert.ok(factory.options.address);
    assert.ok(escrow.options.address);
  });

  it('identifies the seller and buyer correctly', async () => {
    const seller = await escrow.methods.seller().call();
    console.log(seller);
    console.log(accounts[0]);

    assert.equal(accounts[0], seller);
  });

  // it('allows people to contribute money and marks them as approvers', async () => {
  //   await driver.methods.contribute().send({
  //     value: '200',
  //     from: accounts[1]
  //   });
  //   const isContributor = await driver.methods.approvers(accounts[1]).call();
  //   assert(isContributor);
  // });

  // it('requires a minimum contribution', async () => {
  //   try {
  //     await driver.methods.contribute().send({
  //       value: '5',
  //       from: accounts[1]
  //     });
  //     assert(false);
  //   } catch (err) {
  //     assert(err);
  //   }
  // });

});
