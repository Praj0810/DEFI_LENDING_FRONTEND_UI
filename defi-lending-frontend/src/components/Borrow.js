import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Borrow.css";
import UserKYC from './UserKYC'
import { Link } from "react-router-dom";


const Borrow = () => {
    const { account , library } = useWeb3React();
    const [value, setValue] = useState();
    const [formatBalEGold, setFormatEGold] = useState(null);
    const EINRABI = useSelector((state) => state.token.EINRAbi);
    const LendingPoolABI = useSelector((state) => state.token.LendingPoolAbi);
    const EGoldABI = useSelector((state) => state.token.EGoldAbi);
    const lendingPoolContractAddress = useSelector((state) => state.token.LendingContractAddress);
    let [isApproveBorrow, setIsApproveBorrow] = useState(false);
    let [isApproveRepay, setIsApproveRepay] = useState(false);
    const [onChangeValue, setOnChangeValue] = useState(null);
    const [egoldDeposit, setEgoldDeposited] = useState(null);
    const [einrBorrow, setEINRBorrow] = useState(null);
    const [valueInterest, setValueInterest] = useState(null);
    const KYCSTATUS = useSelector((state) => state.token.isKycStatusUpdated);
    let [kycBool, setKycBool] = useState(false);

    const handleInputBorrow = async (e) => {
        const calculatedEINR = await LendingPoolABI.methods
          .calculatedEINRloan(library.utils.toWei(e.target.value, "ether"))
          .call();
        setOnChangeValue(calculatedEINR);
        setValue(e.target.value);
      };

    
    const getBalancEGold = async () => {
        const balanceOfEGold = await EGoldABI.methods.balanceOf(account).call({
          from: account,
        });
        setFormatEGold(library.utils.fromWei(balanceOfEGold));
      };

    //borrow function
  const approveEgoldAmount = async () => {
    const egoldTokenApproval = await EGoldABI.methods
      .approve(lendingPoolContractAddress, library.utils.toWei(value, "ether"))
      .send({
        from: account,
      });
    setIsApproveBorrow(true);
    console.log(egoldTokenApproval)
  };
  const borrowEINRAmount = async () => {
    const depositEgoldAmount = await LendingPoolABI.methods
      .borrowEINRLoan(library.utils.toWei(value, "ether"))
      .send({
        from: account,
      });
    console.log(depositEgoldAmount);
  };

  // get balance of user Depositing EGold Tokens
  const getGoldDeposited = async () => {
    const egoldDeposited = await LendingPoolABI.methods
      .getOwnerEGoldBalance(account)
      .call({
        from: account,
      });
    setEgoldDeposited(library.utils.fromWei(egoldDeposited));
  };

  // get balance of user Borrowing EInr Tokens
  const getEINRBorrowed = async () => {
    const einrBorrowed = await LendingPoolABI.methods
      .getBorrowEINRAmount(account)
      .call({
        from: account,
      });
    setEINRBorrow(library.utils.fromWei(einrBorrowed));
  };

  //repay with interest amount function
  const AmountRepayInterest = async () => {
    const updateRepayInt = await LendingPoolABI.methods
      .getborrowerRepayAmount()
      .call({
        from: account,
      })
      .then((e) => setValueInterest(e))
      .catch((err) => console.log(err));
    console.log(updateRepayInt);
    
  };

  useEffect(() => {
    if (account && LendingPoolABI) {
      AmountRepayInterest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, LendingPoolABI]);

  useEffect(() => {
    let interval;
    if (account !== null) {
      interval = setInterval(() => {
        AmountRepayInterest();
      }, 60000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, LendingPoolABI]);

  //repay function
  const repayEINRApproval = async () => {
    const repayAmountApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, value)
      .send({
        from: account,
      });
    setIsApproveRepay(true);
    console.log(repayAmountApproval);
  };
  const repayEINRAmount = async () => {
    const repayAmount = await LendingPoolABI.methods.repayEINRLoan(value).send({
      from: account,
    });
    console.log(repayAmount);
  };

  useEffect(() => {
    if (account && EINRABI && EGoldABI && LendingPoolABI) {
      getBalancEGold();
      getGoldDeposited();
      getEINRBorrowed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, EINRABI, EGoldABI, LendingPoolABI]);



return(
    <>
      <div className="card-parent-container">
        <div className="cardContainer">
        <div className="card">
        <div className="card-header" style={{fontWeight:"bold"}}>Borrow Market</div>
          <div className="card-body">
            <div className = "asset-list">
               <table class="table table-striped table-hover">
                 <thead> 
                  <tr style={{opacity:"0.6"}}>
                    <th scope="col">Asset</th>
                    <th scope="col">APY</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Liquidity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">EINR</th>
                    <td>8%</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th scope="row">EGold</th>
                    <td>8%</td>
                    <td>{formatBalEGold}</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
          </div>  
        </div>
    </div>
</>
)
}







export default Borrow;
