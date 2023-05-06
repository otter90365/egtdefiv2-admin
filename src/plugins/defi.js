// register the plugin on vue
import ABI from '@/assets/abi/defi.json'
import store from '../store'
const Contract = require('web3-eth-contract');

export default class EgtDefi {
  constructor(address) {
    Contract.setProvider(store.state.rpcUrl);
    this.address = address
    this.contract = new Contract(ABI, address);
  }

  async getIsWhitelist(address) {
    let result = await this.contract.methods.whiteList(address).call()
    return result
  }

  async setWhitelist(address){
    let extraData = await this.contract.methods.whiteListUser(address)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }
  
  async getIsAdmin(address) {
    let result = await this.contract.methods.isController(address).call()
    return result
  }

  async setAdmin(address){
    let extraData = await this.contract.methods.setController(address)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: this.address,
      from: window.ethereum.selectedAddress,
      data: data,
    };
    
    try{
      let txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })
      return {txHash: txHash}
    }catch(error){
      // console.log('error', error)
      return error
    }
  }
}