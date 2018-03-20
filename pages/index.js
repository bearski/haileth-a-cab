import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class DriverIndex extends Component {
  static async getInitialProps() {
    const drivers = await factory.methods.getdriverDb().call();

    return { drivers };
  }

  renderDrivers() {
    const items = this.props.drivers.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/drivers/${address}`}>
            <a>View Dashboard</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: 'break-word' }
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Drivers</h3>

          <Link route="/drivers/new">
            <a>
              <Button
                floated="right"
                content="Add Driver"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderDrivers()}
        </div>
      </Layout>
    );
  }
}

export default DriverIndex;
