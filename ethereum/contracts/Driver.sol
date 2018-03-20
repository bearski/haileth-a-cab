pragma solidity ^0.4.17;

contract DriverFactory {
    address[] public driverDb;

    function createDriver(uint minimum) public {
        address newDriver = new Driver(minimum, msg.sender);
        driverDb.push(newDriver);
    }

    function getdriverDb() public view returns (address[]) {
        return driverDb;
    }
}

contract Driver {
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Driver(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function getSummary() public view returns (uint, uint, uint, address) {
        return (
          minimumContribution,
          this.balance,
          approversCount,
          manager
        );
    }
}
