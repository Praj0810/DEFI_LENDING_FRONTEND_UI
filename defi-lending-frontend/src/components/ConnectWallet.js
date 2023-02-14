import { useWeb3React } from "@web3-react/core"
import { injected } from "./connector";
import { useEffect } from "react"
import React from 'react'

const ConnectWallet = () => {

const { active, account, library, connector, activate, deactivate } = useWeb3React()

async function balanceFetch() {
    try {
      if (active) {
        console.log(library);
        const balance = await library.eth.getBalance(account);
        console.log(balance);
        const balancematic = await library.utils.fromWei(balance);
        console.log(balancematic);
      }
    } catch (error) {
      console.log(error);
    }
  }

async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [])

return (
    <div className="flex flex-col items-center justify-center">
        <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
        {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
        <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Disconnect</button>
        <button onClick={balanceFetch} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Balance</button>
    </div>
)
}

export default ConnectWallet