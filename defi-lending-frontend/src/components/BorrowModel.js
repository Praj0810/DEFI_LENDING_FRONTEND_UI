import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Deposit.css";
import UserKYC from "./UserKYC";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const BorrowModel = (props) => {
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
  console.log(KYCSTATUS, "get status");
  const [formatBalEGold, setFormatEGold] = useState(null);
  let [isApproveBorrow, setIsApproveBorrow] = useState(false);
  let [isApproveRepay, setIsApproveRepay] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(null);

  const handleInputBorrow = async (e) => {
    const calculatedEINR = await LendingPoolABI.methods
      .calculatedEINRloan(library.utils.toWei(e.target.value, "ether"))
      .call();
    setOnChangeValue(library.utils.fromWei(calculatedEINR, "ether"));
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
    console.log(egoldTokenApproval);
  };
  const borrowEINRAmount = async () => {
    const depositEgoldAmount = await LendingPoolABI.methods
      .borrowEINRLoan(library.utils.toWei((value), "ether"))
      .send({
        from: account,
      });
    console.log(depositEgoldAmount);
  };

  //repay EINR function
  const repayEINRApproval = async () => {
    const repayAmountApproval = await EINRABI.methods
      .approve(lendingPoolContractAddress, library.utils.toWei(value))
      .send({
        from: account,
      });
    setIsApproveRepay(true);
    console.log(repayAmountApproval);
  };
  const repayEINRAmount = async () => {
    const repayAmount = await LendingPoolABI.methods.repayEINRLoan(library.utils.toWei(parseInt(value, "ether").toString())).send({
      from: account,
    });
  };

  useEffect(() => {
    if (account && EINRABI && EGoldABI && LendingPoolABI) {
      getBalancEGold();

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
          Borrow Asset EINR
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text">EGold Balance of User: {formatBalEGold}</div>
        <h5>APY : 10%</h5>
        {value > 1500 && !KYCSTATUS && (
          <Link onClick={() => setKycBool(true)} style={{ color: "red" }}>
            Please Do your Kyc
          </Link>
        )}
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="Enter Collateral Amount"
          onChange={handleInputBorrow}
        ></input>
        <div>EINR you can borrow:{onChangeValue}</div>
        <UserKYC  kycBool={kycBool} />

        <div>
              {isApproveBorrow ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={borrowEINRAmount}
                  style={{marginLeft:"10px", marginTop:"32px"}}
                  >
                Borrow
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={approveEgoldAmount}
                  style={{marginLeft:"10px", marginTop:"32px"}}
                  >
                  Approve Borrow
                </button>
              )}
        </div>
        <div>
              {isApproveRepay ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={repayEINRAmount}
                  style={{marginLeft:"169px", marginTop:"-64px"}}
                  >
                  Repay
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={repayEINRApproval}
                  style={{marginLeft:"169px", marginTop:"-64px"}}
                  >
                  Approve Repay
                </button>
              )}
            </div>

       
      </Modal.Body>
    </Modal>
  );
};

export default BorrowModel;
