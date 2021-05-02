import Web3 from 'web3';

//we are using our own version of web3 but stripping out the provider provided by Metamask
//deprecated version: const web3 = new Web3(window.web3.currentProvider);
const web3 = new Web3(window.ethereum);

export default web3;