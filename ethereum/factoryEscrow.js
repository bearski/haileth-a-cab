import web3 from './web3';
import EscrowFactory from './build/EscrowFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(EscrowFactory.interface),
  '0x0C3c141E8999d3E329551E5FbF200D2F137BC4cc'
);

export default instance;
