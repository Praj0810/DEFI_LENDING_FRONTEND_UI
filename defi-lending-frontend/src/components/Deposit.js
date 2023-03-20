// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Deposit.css";
import Borrow from "./Borrow";
import UserKYC from './UserKYC'
import { Link } from "react-router-dom";

const Deposit = () => {
  const [value, setValue] = useState();
  const { account, library } = useWeb3React();
  const EINRABI = useSelector((state) => state.token.EINRAbi);
  const LendingPoolABI = useSelector((state) => state.token.LendingPoolAbi);
  const EGoldABI = useSelector((state) => state.token.EGoldAbi);
  const lendingPoolContractAddress = useSelector(
    (state) => state.token.LendingContractAddress
  );
  let [isApproveSupply, setIsApproveSupply] = useState(false);
  let [kycBool, setKycBool] = useState(false);
  

  const handleInputSupply = (e) => {
    setValue(e.target.value);
  };

  const [formatBalEINR, setFormatBalEINR] = useState(null);
  const [totalSupply, setTotalSupply] = useState();
  
  const [einrDeposit, setEinrDeposited] = useState(null);

  const getBalanceEINR = async () => {
    const balanceOfEINR = await EINRABI.methods.balanceOf(account).call({
      from: account,
    });
    setFormatBalEINR(library.utils.fromWei(balanceOfEINR));
  };
  
  const getTotalSupplyBalance = async () => {
    const totalBalanceEINRToken = await LendingPoolABI.methods
      .getTotalOfSupplyEINRPool()
      .call({
        from: account,
      });
    console.log(totalBalanceEINRToken, "Total Supply");
    setTotalSupply(totalBalanceEINRToken);
  };

  //deposit approval function
  const approveEINRAmount = async () => {
    const einrtokenApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, library.utils.toWei(value, "ether"))
      .send({
        from: account,
      });
    setIsApproveSupply(true);
    console.log(einrtokenApproval)
  };

  //deposit EINR token
  const supplyEINRAmount = async () => {
    const depositAmount = await LendingPoolABI.methods
      .depositeINRToken(library.utils.toWei(value, "ether"))
      .send({
        from: account,
      });
    console.log(depositAmount);
  };

  //get balance of User Depositing EINR token:
  const getEINRDeposited = async () => {
    const einrDeposited = await LendingPoolABI.methods
      .getOwnerDepositEINRBalance(account)
      .call({
        from: account,
      });
    setEinrDeposited(library.utils.fromWei(einrDeposited));
  };

  const [valWithInt, setValueWithInterest] = useState(null);
  

  //withdraw amount with Interest function
  const AmountWithdrawInterest = async () => {
    const updateWithdrawInt = await LendingPoolABI.methods
      .getAmountWithInterest()
      .call({
        from: account,
      });
    setValueWithInterest(updateWithdrawInt);
    console.log(updateWithdrawInt);
  };
  useEffect(() => {
    if (account && LendingPoolABI) {
      AmountWithdrawInterest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, LendingPoolABI]);

  useEffect(() => {
    let interval;
    if (account !== null) {
      interval = setInterval(() => {
        AmountWithdrawInterest();
      }, 60000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, LendingPoolABI]);

  //withdraw
  const withDrawEINRAmount = async () => {
    const withDrawAmount = await LendingPoolABI.methods
      .withDrawEINRToken(value)
      .send({
        from: account,
      });
    console.log(withDrawAmount);
  };

  useEffect(() => {
    if (account && EINRABI && EGoldABI && LendingPoolABI) {
      getBalanceEINR();
      getTotalSupplyBalance();
      getEINRDeposited();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, EINRABI, EGoldABI, LendingPoolABI]);

  return (
    <>
      <div className="headDetails">Total Supply of EINR : {totalSupply}</div>

      <div className="card-parent-container">
        <div className="cardContainer">
        <div className="card">
          <div className="card-header">Supply Market</div>
          <div className="card-body">
            <div className="text">EINR Balance of User: {formatBalEINR}</div>
            <h5>APY : 8%</h5>
            {value > 1000 && (
              <Link onClick={() => setKycBool(true)} style={{color:"red"}}>Please Do your Kyc</Link>
            )}
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter EINR Amount"
              onChange={handleInputSupply}
            ></input> 
            {kycBool && <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={()=>setKycBool(false)} style = {{background:"red"}}>Click here for KYC Form!!</button>}
                             {/* kyc form */}
                             <UserKYC/>
            <button
              type="button"
              className="btn btn-primary"
              onClick={withDrawEINRAmount}
            >
              Withdraw
            </button>

            <div>
              {isApproveSupply ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={supplyEINRAmount}
                >
                  Supply
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={approveEINRAmount}
                >
                  Approve
                </button>
              )}
            </div>
            <div>
              <div className="repayAmount">
                Withdraw Amount With Interest : {valWithInt}
              </div>
              <div className="textDetails">
                Balance EINR Deposited : {einrDeposit}{" "}
              </div>
            </div>
          </div>
        </div>
      
      </div>


      <Borrow/>


      </div>
      
    </>
  );
};

export default Deposit;
