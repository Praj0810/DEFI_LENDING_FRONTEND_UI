// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import "../styles/Deposit.css";
import Borrow from "./Borrow";
import SupplyModel from "./SupplyModel";
import Button from "react-bootstrap/Button";

const Deposit = () => {
  const [show, setShow] = useState(false);
  // const [value, setValue] = useState();
  const { account, library } = useWeb3React();
  const EINRABI = useSelector((state) => state.token.EINRAbi);

  const LendingPoolABI = useSelector((state) => state.token.LendingPoolAbi);
  const EGoldABI = useSelector((state) => state.token.EGoldAbi);
  // const KYCSTATUS = useSelector((state) => state.token.isKycStatusUpdated);
  // let [isApproveSupply, setIsApproveSupply] = useState(false);
  // let [kycBool, setKycBool] = useState(false);
  // const [valWithInt, setValueWithInterest] = useState(null);
  const [formatBalEGold, setFormatEGold] = useState(null);

  const [formatBalEINR, setFormatBalEINR] = useState(null);
  const [totalSupply, setTotalSupply] = useState();
  const [einrDeposit, setEinrDeposited] = useState(null);
  const [valWithInt, setValueWithInterest] = useState(null);

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

  const getTotalSupplyBalance = async () => {
    const totalBalanceEINRToken = await LendingPoolABI.methods
      .getTotalOfSupplyEINRPool()
      .call({
        from: account,
      });
    console.log(totalBalanceEINRToken, "Total Supply");
    setTotalSupply(library.utils.fromWei(totalBalanceEINRToken));
  };

  // get balance of User Depositing EINR token:
  const getEINRDeposited = async () => {
    const einrDeposited = await LendingPoolABI.methods
      .getOwnerDepositEINRBalance(account)
      .call({
        from: account,
      });
    setEinrDeposited(library.utils.fromWei(einrDeposited));
  };

  //withdraw amount with Interest function
  const AmountWithdrawInterest = async () => {
    const updateWithdrawInt = await LendingPoolABI.methods
      .getAmountWithInterest()
      .call({
        from: account,
      });
    setValueWithInterest(library.utils.fromWei(updateWithdrawInt));
    console.log(updateWithdrawInt);
  };

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

  useEffect(() => {
    if (account && EINRABI && EGoldABI && LendingPoolABI) {
      getBalanceEINR();
      getBalancEGold();
      getTotalSupplyBalance();
      getEINRDeposited();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, EINRABI, EGoldABI, LendingPoolABI]);

  return (
    <>
      <div className="headDetails">Total Supply of EINR : {totalSupply}</div>
      <div style={{ display: "flex", justifyContent: "space-evenly", marginTop:"-85px"}}>
        <div className="card-parent-container" style={{ display: "flex", flexDirection: "column" }}>
        <>
        <div style={{marginLeft: "-235px", marginBottom: "10px"}}>
          <div
            className="textDetails"
            style={{ color: "cyan", marginLeft: "200px" }}
          >
            Balance EINR Deposited : {einrDeposit}{" "}
          </div>
          <div
            className="textDetails"
            style={{ color: "cyan", marginLeft: "200px" }}
          >
            Withdraw Amount With Interest : {valWithInt}
          </div>
        </div>
        </>
          <div className="cardContainer">
            <div className="card">
              <div className="card-header" style={{ fontWeight: "bold" }}>
                Supply Market
              </div>
              <div className="card-body">
                <div className="asset-list">
                  <div className="card-labels">
                    <table class="table table-striped table-hover">
                      <thead>
                        <tr style={{ opacity: "0.6" }}>
                          <th scope="col">Asset</th>
                          <th scope="col">APY</th>
                          <th scope="col">Wallet</th>
                          <th scope="col">Collateral</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">EINR</th>
                          <td>8%</td>
                          <td>
                            {" "}
                            <div className="text">{formatBalEINR}</div>
                          </td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                              />
                            </div>
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              onClick={() => setShow(true)}
                              style={{ marginTop: "-2px" }}
                            >
                              Supply
                            </Button>
                            <SupplyModel
                              show={show}
                              onHide={() => setShow(false)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">EGold</th>
                          <td>8%</td>
                          <td>{formatBalEGold}</td>
                          <td>
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Borrow />
      </div>
    </>
  );
};

export default Deposit;
