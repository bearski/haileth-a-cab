import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Driver from '../ethereum/driver';

class RequestRow extends Component {
  onApprove = async () => {
    const driver = Driver(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await driver.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  onFinalize = async () => {
    const driver = Driver(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await driver.methods.completeRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.cost}</Cell>
        <Cell>{request.distance}</Cell>
        <Cell>{request.passenger}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Complete
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
