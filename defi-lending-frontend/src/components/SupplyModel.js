import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Deposit.css";
// import Borrow from "./Borrow"
import UserKYC from "./UserKYC";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const SupplyModel = (props) => {
  // const {show, onHide} = props;
  let [kycBool, setKycBool] = useState(false);
  const [shows, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [value, setValue] = useState();
  const { account, library } = useWeb3React();
  const EINRABI = useSelector((state) => state.token.EINRAbi);

  const LendingPoolABI = useSelector((state) => state.token.LendingPoolAbi);
  const EGoldABI = useSelector((state) => state.token.EGoldAbi);
  const lendingPoolContractAddress = useSelector(
    (state) => state.token.LendingContractAddress
  );
  const KYCSTATUS = useSelector((state) => state.token.isKycStatusUpdated);
  console.log(KYCSTATUS, "get status")
  let [isApproveSupply, setIsApproveSupply] = useState(false);
  
  
  const [formatBalEGold, setFormatEGold] = useState(null);

  const handleInputSupply = (e) => {
    setValue(e.target.value);
  };

  const [formatBalEINR, setFormatBalEINR] = useState(null);

  

  const getBalanceEINR = async () => {
    const balanceOfEINR = await EINRABI.methods.balanceOf(account).call({
      from: account,
    });
    setFormatBalEINR(library.utils.fromWei(balanceOfEINR));
  };

  const getBalancEGold = async () => {
    const balanceOfEGold = await EGoldABI.methods.balanceOf(account).call({
      from: account,
    });
    setFormatEGold(library.utils.fromWei(balanceOfEGold));
  };

  //deposit approval function
  const approveEINRAmount = async () => {
    const einrtokenApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, library.utils.toWei(value, "ether"))
      .send({
        from: account,
      });
    setIsApproveSupply(true);
    console.log(einrtokenApproval);
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

  // //get balance of User Depositing EINR token:
  // const getEINRDeposited = async () => {
  //   const einrDeposited = await LendingPoolABI.methods
  //     .getOwnerDepositEINRBalance(account)
  //     .call({
  //       from: account,
  //     });
  //   setEinrDeposited(library.utils.fromWei(einrDeposited));
  // };

  // //withdraw amount with Interest function
  // const AmountWithdrawInterest = async () => {
  //   const updateWithdrawInt = await LendingPoolABI.methods
  //     .getAmountWithInterest()
  //     .call({
  //       from: account,
  //     });
  //   setValueWithInterest(updateWithdrawInt);
  //   console.log(updateWithdrawInt);
  // };

  
  //withdraw
  const withDrawEINRAmount = async () => {
    const withDrawAmount = await LendingPoolABI.methods
      .withDrawEINRToken(value)
      .send({
        from: account,
      });
    console.log(withDrawAmount);
  };
 // const [thresholdLimitLender, setthresholdLimitLender] = useState(null);

  useEffect(() => {
    if (account && EINRABI && EGoldABI && LendingPoolABI) {
      getBalanceEINR();
      getBalancEGold();
     
    //   setthresholdLimitLender(5000);
    //   console.log(thresholdLimitLender, "thresholdLimitLender");
        // setTimeout(async () => {
        //   await LendingPoolABI.methods
        //     .thresholdLimitLender()
        //     .call({
        //       from: account,
        //     })
        //     .then((e) => {
        //       setthresholdLimitLender(library.utils.fromWei(e, "ether"));
        //       console.log(thresholdLimitLender, "thresholdLimitLender");
        //     })
        //     .catch(err => console.log(err));
        // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, EINRABI, EGoldABI, LendingPoolABI]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Supply Asset EINR
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text">EINR Balance of User: {formatBalEINR}</div>
        <h5>APY : 8%</h5>
        {value > 1000 && !KYCSTATUS && (
          <Link onClick={() => setKycBool(true)} style={{ color: "red" }}>
            Please Do your Kyc
          </Link>
        )}
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Enter EINR Amount"
          onChange={handleInputSupply}
        ></input>
        {/* {kycBool && (<Button variant="primary" onClick={handleShow} style={{ background: "red" }}>
    Click here for KYC Form hello
    </Button> 
    )} */}
        <UserKYC  kycBool={kycBool} />

        <div>
          {isApproveSupply ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={supplyEINRAmount}
              style={{marginLeft:"10px", marginTop:"32px"}}
        >
              Supply
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={approveEINRAmount}
              style={{marginLeft:"10px", marginTop:"32px"}}
        >
              Approve Supply
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={withDrawEINRAmount}
          style={{marginLeft:"169px", marginTop:"-64px"}}
          >
          Withdraw
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default SupplyModel;
