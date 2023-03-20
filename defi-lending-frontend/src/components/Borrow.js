import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Borrow.css";


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
    // const formattedRepayInt = library.utils.fromWei(updateRepayInt);
    // console.log(formattedRepayInt);
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
     <div className="cardContainer">
        <div className="card">
          <div className="card-header">Borrow Market</div>
          <div className="card-body">
            <div>EGold Balance of User: {formatBalEGold}</div>
            <h5>APY : 10%</h5>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter EGold Amount"
              onChange={handleInputBorrow}
            ></input>
            <div>EINR you can borrow:{onChangeValue}</div>

            <div>
              {isApproveRepay ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={repayEINRAmount}
                >
                  Repay
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={repayEINRApproval}
                >
                  Approve
                </button>
              )}
            </div>

            <div>
              {isApproveBorrow ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={borrowEINRAmount}
                >
                  Borrow
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={approveEgoldAmount}
                >
                  Approve
                </button>
              )}
            </div>

            <div>
              <div className="repayAmount">
                Repay Amount With Interest : {valueInterest}{" "}
              </div>
              <div className="textDetails">
                Balance EINR Borrowed : {einrBorrow}
              </div>
              <div className="textDetails">
                Balance EGold Deposited : {egoldDeposit}{" "}
              </div>
            </div>
          </div>
        </div>
    </div>  
    </>
)
}







export default Borrow;
