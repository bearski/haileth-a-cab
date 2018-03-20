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
    struct TripRequest {
        uint distance;
        address passenger;
        bool complete;
        uint approvalCount;
        uint cost;
        mapping(address => bool) approvals;
    }

    TripRequest[] public requests;
    uint constant RATE_PER_KM = 10;
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

    function createRequest(uint estimatedDistance, address passenger) public restricted {
        TripRequest memory newRequest = TripRequest({
           distance: estimatedDistance,
           passenger: passenger,
           complete: false,
           approvalCount: 0,
           cost: estimatedDistance * RATE_PER_KM
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        TripRequest storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function completeRequest(uint index, uint actualDistance) public restricted {
        uint returnToPassenger;

        TripRequest storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        returnToPassenger = request.cost - (actualDistance * RATE_PER_KM);

        request.distance = actualDistance;
        request.cost = actualDistance * RATE_PER_KM;

        // escrow!!!!
        // request.passenger.transfer(returnToPassenger);
        // request.passenger.transfer(request.cost);

        request.complete = true;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
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
