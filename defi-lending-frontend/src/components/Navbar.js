import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./Connector";
import { useEffect } from "react";
import EINRAbi from "../contracts/EINRToken.json";
import EGoldAbi from "../contracts/EGoldToken.json";
import LendingPoolABI from "../contracts/LendingPool.json";
import LPTokenABI from "../contracts/LPToken.json"


const Navbar = () => {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

  async function balanceFetch() {
    try {
      if (active) {
        console.log(library);
        const balance = await library.eth.getBalance(account);
        console.log(balance);
        const balanceToken = await library.utils.fromWei(balance);
        console.log(balanceToken);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", true);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const Connectinstance = async () => {
    console.log(library);
    const networkID = await library.eth.net.getId();
    //EINR Instance 
    const networkDataEINR = EINRAbi.networks[networkID];
    console.log(networkDataEINR);
    const EINRInstance = await new library.eth.Contract(EINRAbi.abi,networkDataEINR.address);
    console.log(EINRInstance);
    const balanceOfEINR = await EINRInstance.methods.balanceOf(account).call();
    const formatBalEINR = library.utils.fromWei(balanceOfEINR)
    console.log(formatBalEINR);
    
    //EGold Instance
    const networkDataEGold = EGoldAbi.networks[networkID];
    console.log(networkDataEGold);
    const EGoldInstance = await new library.eth.Contract(EGoldAbi.abi, networkDataEGold.address);
    console.log(EGoldInstance);
    const balanceOfEGold = await EGoldInstance.methods.balanceOf(account).call();
    const formatBalEGold = library.utils.fromWei(balanceOfEGold);
    console.log(formatBalEGold);
    
    //lending Pool Instance 
    const networkLendingPool = LendingPoolABI.networks[networkID];
    console.log(networkLendingPool);
    const LendingPoolInstance = await new library.eth.Contract(LendingPoolABI.abi, networkLendingPool.address);
    console.log(LendingPoolInstance);
    const totalBalanceEINRToken = await LendingPoolInstance.methods.getTotalOfSupplyEINRPool().call();
    console.log(totalBalanceEINRToken);
   
    // LP token instance 
    const networkLPToken = LPTokenABI.networks[networkID];
    console.log(networkLPToken);
    const LPTokenInstance = await new library.eth.Contract(LPTokenABI.abi, networkLPToken.address);
    console.log(LPTokenInstance);
    // const balanceOfLPToken = await LPTokenInstance.eth.getBalanceOfLPtoken().call();
    // console.log(balanceOfLPToken);
    
  };

  useEffect(() => {
    if (active) {
      Connectinstance();
    }
  }, [active]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href=" # ">
            DeFi Lending App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href=" # ">
                  Home
                </a>
              </li>
            </ul>
            <button
              onClick={connect}
              className="py-2 mt-20 mb-4 text-lg font-bold text-black rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
              Connect to MetaMask
            </button>
            {active ? (
              <span>
                Connected with <b>{account}</b>
              </span>
            ) : (
              <span>Not connected</span>
            )}
            <button
              onClick={disconnect}
              className="py-2 mt-40 mb-4 text-lg font-bold text-black rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
              Disconnect
            </button>
            <button
              onClick={balanceFetch}
              className="py-2 mt-20 mb-4 text-lg font-bold text-black rounded-lg w-56 bg-blue-600 hover:bg-blue-800"
            >
              Balance
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
