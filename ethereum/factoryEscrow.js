import web3 from './web3';
import EscrowFactory from './build/EscrowFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(EscrowFactory.interface),
  '0xFd1FA8f5bAb829C7e21cadFF8837153f9ca0BeEc'
);

export default instance;
