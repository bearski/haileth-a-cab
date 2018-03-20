import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Driver from '../../../ethereum/driver';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {
  state = {
    distance: '',
    passenger: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    const driver = Driver(this.props.address);
    const { distance, passenger } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await driver.methods
        .createRequest(distance, passenger)
        .send({ from: accounts[0] });

      Router.pushRoute(`/drivers/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/drivers/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Request a Trip</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>distance</label>
            <Input
              value={this.state.distance}
              onChange={event =>
                this.setState({ distance: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>passenger</label>
            <Input
              value={this.state.passenger}
              onChange={event =>
                this.setState({ passenger: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Request Trip!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
