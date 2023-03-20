/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./Connector";
import { useEffect } from "react";
import EINRAbi from "../contracts/EINRToken.json";
import EGoldAbi from "../contracts/EGoldToken.json";
import LendingPoolABI from "../contracts/LendingPool.json";
import LPTokenABI from "../contracts/LPToken.json"
import { useDispatch} from "react-redux";
import { updateABI, kycDetails } from "../reducers/stateReducer";
import Axios from 'axios';


const Navbar = () => {
  const dispatch = useDispatch();
  
  // const isKycStatusUpdated = useSelector((state) => state.token.isKycStatusUpdated);
  // const UserAddress = useSelector((state) => state.token.UserAddress);
  
  const { active, account, library, activate, deactivate } =
    useWeb3React();


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
          //api
          if(active){
        const response = await Axios.get(`${process.env.REACT_APP_API_HOST}/api/getDetails/${account}}`,
        )
          console.log(response, "Hello user");
          }
          
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [active]);


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
   
    //lending Pool Instance 
    const networkLendingPool = LendingPoolABI.networks[networkID];
    console.log(networkLendingPool);
    const LendingPoolInstance = await new library.eth.Contract(LendingPoolABI.abi, networkLendingPool.address);
    console.log(LendingPoolInstance);
    
    // LP token instance 
    const networkLPToken = LPTokenABI.networks[networkID];
    console.log(networkLPToken);
    const LPTokenInstance = await new library.eth.Contract(LPTokenABI.abi, networkLPToken.address);
    console.log(LPTokenInstance);
    
    dispatch(updateABI({
      EINRAbi:EINRInstance,
      EGoldAbi:EGoldInstance,
      LendingPoolAbi: LendingPoolInstance, 
      LPTokenAbi:LPTokenInstance,
      EINRContractAddress:networkDataEINR.address,
      EGOLDContractAddress:networkDataEGold.address,
      LendingContractAddress: networkLendingPool.address,
      LPTokenAddress: networkLPToken.address,
     
    }))
    
    dispatch(kycDetails({
      isKycStatusUpdated: false,
      UserAddress:account,
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
              className="btn btn-primary"
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
              className="btn btn-primary"
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
