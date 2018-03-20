import web3 from './web3';
import EscrowFactory from './build/EscrowFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(EscrowFactory.interface),
  '0x8d152194fCe2e53fE05E39a3EE090C4416686082'
);

export default instance;
