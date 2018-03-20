pragma solidity ^0.4.17;

contract EscrowFactory {
    address[] public escrowDb;

    function createEscrow(uint amount, address buyer_adress) public {
        address newEscrow = new Escrow(amount, msg.sender, buyer_adress);
        escrowDb.push(newEscrow);
    }

    function getEscrowDb() public view returns (address[]) {
        return escrowDb;
    }
}

contract Escrow {
  uint public value;
  address public seller;
  address public buyer;
  enum State { Created, Locked, Inactive }
  State public state;

  function Escrow(uint amount, address seller, address buyer) public payable {
      seller = msg.sender;
      value = msg.value;
      buyer = buyer;
  }

  modifier onlyBuyer() {
      require(msg.sender == buyer);
      _;
  }

  modifier onlySeller() {
      require(msg.sender == seller);
      _;
  }

  modifier inState(State _state) {
      require(state == _state);
      _;
  }

  event Aborted();
  event PurchaseConfirmed();
  event ItemReceived();
  event Refunded();

  /// Abort the purchase and reclaim the ether.
  /// Can only be called by the seller before the contract is locked.
  function abort() public onlySeller inState(State.Created) {
      seller.transfer(this.balance);
      state = State.Inactive;
      Aborted();
  }

  /// Confirm the purchase as buyer.
  /// The ether will be locked until either
  /// confirmReceived is called by the buyer
  /// or refund is called by the seller.
  function confirmPurchase() public inState(State.Created) {
      buyer = msg.sender;
      state = State.Locked;
      PurchaseConfirmed();
  }

  /// Confirm that the buyer received the item.
  function confirmReceived() public onlyBuyer inState(State.Locked) {
      buyer.transfer(value);
      seller.transfer(this.balance);
      state = State.Inactive;
      ItemReceived();
  }

  /// Fully refund the buyer
  function refund() public onlySeller inState(State.Locked) payable {
      buyer.transfer(2 * value); // We ignore the return value on purpose
      seller.transfer(this.balance);
      state = State.Inactive;
      Refunded();
  }

  function () public {
      revert();
  }
}
