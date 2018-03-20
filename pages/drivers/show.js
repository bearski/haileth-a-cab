import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Driver from '../../ethereum/driver';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class DriverShow extends Component {
  static async getInitialProps(props) {
    const driver = Driver(props.query.address);

    const summary = await driver.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      approversCount: summary[2],
      manager: summary[3]
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The account which added the driver',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'Minimum payment to become an approver'
      },
      // {
      //   header: requestsCount,
      //   meta: 'Number of Requests',
      //   description:
      //     'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      // },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of approvers'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Balance (ether)',
        description: 'Account Balance'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Driver Dashboard</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default DriverShow;
