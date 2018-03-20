import web3 from './web3';
import Driver from './build/Driver.json';

export default address => {
  return new web3.eth.Contract(
    JSON.parse(Driver.interface),
    address
  );
};
