import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./Connector";
import { useEffect } from "react";
import EINRAbi from "../contracts/EINRToken.json";
import EGoldAbi from "../contracts/EGoldToken.json";
import LendingPoolABI from "../contracts/LendingPool.json";
import LPTokenABI from "../contracts/LPToken.json"
import { useDispatch } from "react-redux";
import { updateABI } from "../reducers/stateReducer";




const Navbar = () => {
  const dispatch = useDispatch();

  const { active, account, library, activate, deactivate } =
    useWeb3React();

  // async function balanceFetch() {
  //   try {
  //     if (active) {
  //       console.log(library);
  //       const balance = await library.eth.getBalance(account);
  //       console.log(balance);
  //       const balanceToken = await library.utils.fromWei(balance);
  //       console.log(balanceToken);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

  const ConnectInstance = async () => {
    console.log(library);
    const networkID = await library.eth.net.getId();
    const networkDataEINR = EINRAbi.networks[networkID];
    console.log(networkDataEINR);
    const EINRInstance = await new library.eth.Contract(EINRAbi.abi,networkDataEINR.address);
    console.log(EINRInstance);
    
    
    //EGold Instance
    const networkDataEGold = EGoldAbi.networks[networkID];
    console.log(networkDataEGold);
    const EGoldInstance = await new library.eth.Contract(EGoldAbi.abi, networkDataEGold.address);
    console.log(EGoldInstance);
    // const balanceOfEGold = await EGoldInstance.methods.balanceOf(account).call();
    // const formatBalEGold = library.utils.fromWei(balanceOfEGold);
    // console.log(formatBalEGold, "eGold Balance");
    
    //lending Pool Instance 
    const networkLendingPool = LendingPoolABI.networks[networkID];
    console.log(networkLendingPool);
    const LendingPoolInstance = await new library.eth.Contract(LendingPoolABI.abi, networkLendingPool.address);
    console.log(LendingPoolInstance);
    // const totalBalanceEINRToken = await LendingPoolInstance.methods.getTotalOfSupplyEINRPool().call();
    // console.log(totalBalanceEINRToken, "Total Supply");
   
    // LP token instance 
    const networkLPToken = LPTokenABI.networks[networkID];
    console.log(networkLPToken);
    const LPTokenInstance = await new library.eth.Contract(LPTokenABI.abi, networkLPToken.address);
    console.log(LPTokenInstance);
    // const balanceOfLPToken = await LPTokenInstance.eth.getBalanceOfLPtoken().call();
    // console.log(balanceOfLPToken); 

    dispatch(updateABI({
      EINRAbi:EINRInstance,
      EGoldAbi:EGoldInstance,
      LendingPoolAbi: LendingPoolInstance, 
      LPTokenAbi:LPTokenInstance,
      EINRContractAddress:networkDataEINR.address,
      EGOLDContractAddress:networkDataEGold.address,
      LendingContractAddress: networkLendingPool.address,
      LPTokenAddress: networkLPToken.address
    }))  
  };

  useEffect(() => {
    if (active) {
      ConnectInstance();
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
              type="button"
              class="btn btn-primary"
              onClick={connect}
            >
              Connect MetaMask
            </button>
            {active ? (
              <span>
              <b>{account}</b>
              </span>
            ) : (
              <span>Not connected</span>
            )}
             <button
              type="button"
              class="btn btn-primary"
              onClick={disconnect}
            >
            Disconnect
            </button>  
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
