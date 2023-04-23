// register the plugin on vue
import ABI from '@/assets/abi/defi.json'
import store from '../store'
const Contract = require('web3-eth-contract');

export default class EgtDefi {
  constructor() {
    Contract.setProvider(store.state.rpcUrl);
    this.contract = new Contract(ABI, store.state.defiAddress);
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

  // async setMonthPercent(month, rate){
  //   rate = rate * 10 ** 18
  //   const rateString = rate.toLocaleString('fullwide', {useGrouping:false})
  //   let extraData = await this.contract.methods.setMonthPercent(month, rateString)
  //   let data = extraData.encodeABI()
  //   return this.sendTransaction(data)
  // }

  // async getRound() {
  //   let result = await this.contract.methods.Round().call()
  //   return result
  // }

  async sendTransaction(data){
    const transactionParameters = {
      to: store.state.defiAddress,
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