import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Deposit.css";

const Deposit = () => {
  const [value, setValue] = useState();
  const { account } = useWeb3React();
  const EINRABI = useSelector((state) => state.token.EINRAbi);
  const LendingPoolABI = useSelector((state) => state.token.LendingPoolAbi);
  const EGoldABI = useSelector((state) => state.token.EGoldAbi);
  const lendingPoolContractAddress = useSelector(
    (state) => state.token.LendingContractAddress
  );
  console.log(EINRABI);
  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const [formatBalEINR, setFormatBalEINR] = useState(null);
  const [totalSupply, setTotalSupply] = useState();
  const [formatBalEGold, setFormatEGold] = useState(null);
  const [einrDeposit, setEinrDeposited] = useState(null);
  const [egoldDeposit, setEgoldDeposited] = useState(null);
  const [einrBorrow, setEINRBorrow] = useState(null);

  const getBalanceEINR = async () => {
    //console.log(EINRABI);
    const balanceOfEINR = await EINRABI.methods.balanceOf(account).call({
      from: account,
    });
    setFormatBalEINR(balanceOfEINR);
    //console.log(formatBalEINR, "EINR user balance");
  };
  const getBalancEGold = async () => {
    const balanceOfEGold = await EGoldABI.methods.balanceOf(account).call({
      from: account,
    });
    setFormatEGold(balanceOfEGold);
  };

  const getTotalSupplyBalance = async () => {
    //console.log(LendingPoolABI)
    const totalBalanceEINRToken = await LendingPoolABI.methods.getTotalOfSupplyEINRPool().call({
      from : account
    });
    console.log(totalBalanceEINRToken, "Total Supply");
    setTotalSupply(totalBalanceEINRToken);
  }

  //deposit function
  const supplyEINRAmount = async () => {
    const einrtokenApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, value)
      .send({
        from: account,
      });
    const depositAmount = await LendingPoolABI.methods
      .depositeINRToken(value)
      .send({
        from: account,
      });
    console.log(depositAmount);
    console.log(einrtokenApproval);
  };

  //get balance of User Depositing EINR token:
  const getEINRDeposited = async() => {
    const einrDeposited = await LendingPoolABI.methods.getOwnerDepositEINRBalance(account).call({
      from: account
    })
    setEinrDeposited(einrDeposited);  
  }
  
   

  //borrow function
  const borrowEINRAmount = async () => {
    const egoldTokenApproval = await EGoldABI.methods
      .approve(lendingPoolContractAddress, value)
      .send({
        from: account,
      });
    const depositEgoldAmount = await LendingPoolABI.methods
      .borrowEINRLoan(value)
      .send({
        from: account,
      });
    console.log(egoldTokenApproval);
    console.log(depositEgoldAmount);
  };

  // get balance of user Depositing EGold Tokens
  const getGoldDeposited = async() => {
    const egoldDeposited = await LendingPoolABI.methods.getOwnerEGoldBalance(account).call({
      from: account
    })
    setEgoldDeposited(egoldDeposited);  
  }

  // get balance of user Borrowing EInr Tokens
  const getEINRBorrowed = async() => {
    const einrBorrowed = await LendingPoolABI.methods.getBorrowEINRAmount(account).call({
      from: account
    })
    setEINRBorrow(einrBorrowed);  
  }



  //repay with interest amount function
  const [valueInterest, setValueInterest] = useState(null);
  const AmountRepayInterest =  async() =>{
    await LendingPoolABI.methods.getborrowerRepayAmount(value).call({
      from: account,
    }).then(e => setValueInterest(e)).catch(err => console.log(err));
  }

  //withdraw amount with Interest function
  const [valWithInt, setValueWithInterest] = useState(null);
  const AmountWithdrawInterest = async () =>{
    await LendingPoolABI.methods.getAmountWithInterest(value).call({
      from: account,
    }).then(e => setValueWithInterest(e)).catch(err => console.log(err));
  }

  //repay function
  const repayEINRAmount = async () => {
    const repayAmountApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, value)
      .send({
        from: account,
      });
    const repayAmount = await LendingPoolABI.methods.repayEINRLoan(value).send({
      from: account,
    });
    console.log(repayAmountApproval);
    console.log(repayAmount);
  };

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
     getBalancEGold();
     getTotalSupplyBalance();
     getEINRDeposited();
     getGoldDeposited();
     getEINRBorrowed();
    }
  }, [account , EINRABI, EGoldABI, LendingPoolABI]);

  return (
    <>
      <div className="headDetails">Total Supply of EINR : {totalSupply}</div>

      <div className="cardContainer">
        <div className="card">
          <div class="card-header">Supply Market</div>
          <div className="card-body">
            <div className="text">EINR Balance of User: {formatBalEINR}</div>
            <h5>APY : 8%</h5>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter EINR Amount"
              onChange={handleInput}
            ></input>
            <button
              type="button"
              class="btn btn-primary"
              onClick={supplyEINRAmount}
            >
              Supply
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={withDrawEINRAmount}
            >
              Withdraw
            </button>
            <button type="button" class="btn btn-primary" onClick={AmountWithdrawInterest}>
              Amount Withdraw Interest
            </button>
            <div>
              <div className ="repayAmount">Withdraw Amount With Interest : {valWithInt}</div>
              <div className="textDetails">Balance EINR Deposited : {einrDeposit} </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div class="card-header">Borrow Market</div>
          <div className="card-body">
            <div>EGold Balance of User: {formatBalEGold}</div>
            <h5>APY : 10%</h5>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter EGold Amount"
              onChange={handleInput}
            ></input>
            <button
              type="button"
              class="btn btn-primary"
              onClick={borrowEINRAmount}
            >
              Borrow
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={repayEINRAmount}
            >
              Repay
            </button>
            <button type="button" class="btn btn-primary"onClick={AmountRepayInterest}>
              Amount Repay Interest
            </button>
            <div>
              <div className ="repayAmount">Repay Amount With Interest : {valueInterest} </div>
              <div className="textDetails">Balance EINR Borrowed : {einrBorrow}</div>
              <div className="textDetails">Balance EGold Deposited : {egoldDeposit} </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposit;
