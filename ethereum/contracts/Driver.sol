pragma solidity ^0.4.19;

/*
  contract DriverFactory
  contract Driver
  contract EscrowFactory
  contract Escrow
*/

contract DriverFactory {                            // factory to be create driver while providing an account
                                                    // users add themselves to driverDb
    address[] public driverDb;
    mapping(address => bool) public driverExists;

    function createDriver(string _name) public {
        require(!driverExists[msg.sender]);         // create driver once only

        address newDriver = new Driver(msg.sender, _name);
        driverDb.push(newDriver);

        driverExists[msg.sender] = true;
    }

    function getdriverDb() public view returns (address[]) {
        return driverDb;
    }

    function getDriverCount() public view returns (uint) {
        return driverDb.length;
    }
}


contract Driver {
    uint constant RATE_PER_KM = 10;
    address public driver;
    string public name;

    struct Trip {
        uint distance;
        uint cost;
        address passenger;
        bool complete;
        uint date;
    }

    Trip[] public trips;

    modifier notDriver() {
      require(msg.sender != driver);
      _;
    }

    function Driver(address _driver, string _name) public payable {
        driver = _driver;
        name = _name;
    }

    function createTrip(uint _distance, address _passenger) notDriver public {
        Trip memory newTrip = Trip({
           distance: _distance,
           cost: _distance * RATE_PER_KM,
           passenger: _passenger,
           complete: false,
           date: now
        });

        trips.push(newTrip);
    }

    function completeTrip(uint _index, uint _distance) notDriver public payable {
        Trip storage trip = trips[_index];
        trip.distance = _distance;
        trip.cost = _distance * RATE_PER_KM;
        trip.complete = true;

        Escrow escrow = new Escrow(driver);
        escrow.payoutToSeller();

    }
}


/*
  contract EscrowFactory
*/

contract EscrowFactory {
    address[] public deployedEscrows;

    function createEscrow(address _seller) public {
        address newEscrow = new Escrow(msg.sender);
        deployedEscrows.push(newEscrow);
    }

    function getDeployedEscrows() public view returns (address[]){
        return deployedEscrows;
    }
}

/*
  contract Escrow
*/

contract Escrow {

  address public buyer;
  address public seller;
  uint public amount;

  function Escrow (address _seller) public payable {
    buyer = msg.sender;
    seller = _seller;
  }

  function payoutToSeller () public {
    require(msg.sender == buyer);
    seller.transfer(this.balance);
  }

  function refundToBuyer () public {
    require(msg.sender == seller);
    buyer.transfer(this.balance);
  }

  function getBalance() public constant returns (uint) {
    return this.balance;
  }
}
