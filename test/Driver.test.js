const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/DriverFactory.json');
const compiledDriver = require('../ethereum/build/Driver.json');
const compiledEscrow = require('../ethereum/build/Escrow.json');

let accounts;
let factory;
let driverAddress;
let driver;
let escrow;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode})
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  await factory.methods.createDriver()
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    [driverAddress] = await factory.methods.getdriverDb().call();

    driver = await new web3.eth.Contract(                                       // contract already deployed.
      JSON.parse(compiledDriver.interface),                                     // send interface
      driverAddress                                                             // and address
    );
      
});

describe('Drivers', () => {
  it('deploys a factory and a driver', () => {
    assert.ok(factory.options.address);
    assert.ok(driver.options.address);
  });

  it('marks caller as the driver', async () => {
    const d = await driver.methods.driver().call();
    assert.equal(accounts[0], d);
  });

  it('creates a trip request', async () => {
    await driver.methods
      .createTrip('10', accounts[1])
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    const trip = await driver.methods.trips(0).call();

    // console.log(trip.cost)
    assert.equal(10, trip.distance)
    assert.equal(accounts[1], trip.passenger)
  });

  it('prevents the driver from creating a trip', async () => {
    try {
      await driver.methods
        .createTrip('100', accounts[0])
        .send({
          from: accounts[0],
          gas: '1000000'
        });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('prevents the driver from marking a trip as completed', async () => {
      try {
        await driver.methods
          .completeTrip('0','5')
          .send({
            from: accounts[0],
            gas: '1000000'
          });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });

  it('process a trip', async () => {
    await driver.methods
      .createTrip('10', accounts[1])
      .send({
        from: accounts[1],
        gas: '1000000'
      });

    await driver.methods
        .completeTrip('0','5')
        .send({
          from: accounts[1],
          gas: '1000000'
        });

    const trip = await driver.methods.trips(0).call();
    assert.equal(trip.complete, true)
  });

  // it('processes requests', async () => {
  //   await campaign.methods.contribute().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei('10', 'ether')
  //   });
  //
  //   await campaign.methods
  //     .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
  //     .send({
  //       from: accounts[0],
  //       gas: '1000000'
  //     });
  //
  //   await campaign.methods.approveRequest(0).send({
  //     from: accounts[0],
  //     gas: '1000000'
  //   });
  //
  //   await campaign.methods.finalizeRequest(0).send({
  //     from: accounts[0],
  //     gas: '1000000'
  //   });
  //
  //   let balance = await web3.eth.getBalance(accounts[1]);
  //   balance = web3.utils.fromWei(balance, 'ether');
  //   balance = parseFloat(balance);
  //
  //   assert(balance > 103);
  // });
});
