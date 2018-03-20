const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/DriverFactory.json');
const compiledDriver = require('../ethereum/build/Driver.json');

let accounts;
let factory;
let driverAddress;
let driver;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createDriver('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [driverAddress] = await factory.methods.getdriverDb().call();
  driver = await new web3.eth.Contract(
    JSON.parse(compiledDriver.interface),
    driverAddress
  );
});

describe('Drivers', () => {
  it('deploys a factory and a driver', () => {
    assert.ok(factory.options.address);
    assert.ok(driver.options.address);
  });

  it('marks caller as the driver manager', async () => {
    const manager = await driver.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await driver.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await driver.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await driver.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

});
