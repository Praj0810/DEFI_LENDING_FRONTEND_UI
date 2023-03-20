import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FormData from "form-data";
import { kycDetails } from "../reducers/stateReducer";
import { useDispatch } from "react-redux";

const KYCUserForm = () => {
  const dispatch = useDispatch();
  const account_address = useSelector((state) => state.token);
  const formData = new FormData();
  const [name, setName] = useState("");
  const [userNameTouch, setUserNameTouch] = useState("");
  const [panDetails, setPanDetails] = useState("");
  const [panNumberTouch, setPanNumberTouch] = useState("");
  const [filePath, setFilePath] = useState("");
  const [fileTouch, setFileTouch] = useState("");

  let formIsValid = false;

  const userNameIsValid = name.trim() !== "";
  const userNameIsInvalid = !userNameIsValid && userNameTouch;
  const panNumberIsValid = name.trim() !== "";
  const panNumberIsInvalid = !panNumberIsValid && panNumberTouch;
  const filePathIsValid = filePath !== "";
  const fileIsInvalid = !filePathIsValid && fileTouch;

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handlePanDetails = (event) => {
    setPanDetails(event.target.value);
  };

  const handleFile = (event) => {
    setFilePath(event.target.files[0]);
  };

  const touchHandleName = (event) => {
    setUserNameTouch(true);
  };

  const touchHandlePanDetails = (event) => {
    setPanNumberTouch(true);
  };

  const touchHandleFile = (event) => {
    setFileTouch(true);
  };

  if (userNameIsValid && panNumberIsValid && filePathIsValid) {
    formIsValid = true;
  }

  const urlPost = `${process.env.REACT_APP_API_HOST}/api/addKYCDetails`;
  console.log(urlPost);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  const handleUserKYCDetail = async (event) => {
    event.preventDefault();
    // formData.append("account", account_address.UserAddress);
    // formData.append("userName", name);
    // formData.append("panDetails", panDetails);
    // formData.append("img", filePath);

    formData.append('User_Account_Address', account_address.UserAddress);
    formData.append('UserName',name);
    formData.append('PanCard_Number', panDetails);
    formData.append('kycDocs', filePath);
    setUserNameTouch(true);
    setPanNumberTouch(true);
    setFileTouch(true);
    if (userNameIsInvalid && panNumberIsInvalid && fileIsInvalid) {
      return;
    }
    try {
      const response = await Axios.post(urlPost, formData, config);
      alert("KYC done successfully");
      dispatch(kycDetails({
        isKycStatusUpdated: true,
      }))

      console.log(response, "get new response here");
    } catch (error) {
      console.log(error);
      alert("Please enter the Details");
    }
    setUserNameTouch(false);
    setPanNumberTouch(false);
    setFileTouch(false);
    setName("");
    setPanDetails("");
    setFilePath("");
    
    
  };

  return (
    <div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Fill your KYC details Here!!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUserKYCDetail} className="modal-form">
                <div className="modal_form_inner">
                  <div>
                    <label className="label">Name :</label>
                    <input
                      type="text"
                      className="form-control form-control-input "
                      placeholder="Enter Name"
                      onChange={handleName}
                      onBlur={touchHandleName}
                    />
                    {userNameIsInvalid && (
                      <p className="error-text">Name should not be empty</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Pan Card Number : </label>
                    <input
                      type="text"
                      className="form-control form-control-input "
                      placeholder="Enter Pan Card Number"
                      onChange={handlePanDetails}
                      onBlur={touchHandlePanDetails}
                    />
                    {userNameIsInvalid && (
                      <p className="error-text">
                        Please Enter Pan Card Details
                      </p>
                    )}
                  </div>
                  
                    <div className="form-group">
                      <input
                        type="file"
                        name="img"
                        id="file"
                        className="form-control form-control-input"
                        placeholder="Upload Documents"
                        onChange={handleFile}
                        onBlur={touchHandleFile}
                      />
                      {fileIsInvalid && (
                        <p className="error-text">File is Not Uploaded</p>
                      )}
                    </div>
                    <div className="text-center">
                        <button
                    disabled={!formIsValid}
                    className="btn btn-primary"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              
                
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCUserForm;
