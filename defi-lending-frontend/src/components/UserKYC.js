import Axios from "axios";
import React, { useState } from "react";
import FormData from "form-data";
import { kycDetails } from "../reducers/stateReducer";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const KYCUserForm = (props) => {
  const {show, onHide, kycBool} = props;
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const formData = new FormData();
  const [name, setName] = useState("");
  // const [userNameTouch, setUserNameTouch] = useState("");
  const [panDetails, setPanDetails] = useState("");
  // const [panNumberTouch, setPanNumberTouch] = useState("");
  const [filePath, setFilePath] = useState("");
  // const [fileTouch, setFileTouch] = useState("");
  const [shows, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // let formIsValid = false;
  // let [kycBool, setKycBool] = useState(false);


  const handleName = (event) => {
    setName(event.target.value);
  };

  const handlePanDetails = (event) => {
    setPanDetails(event.target.value);
  };

  const handleFile = (event) => {
    setFilePath(event.target.files[0]);
  };

  // const touchHandleName = (event) => {
  //   setUserNameTouch(true);
  // };

  // const touchHandlePanDetails = (event) => {
  //   setPanNumberTouch(true);
  // };

  // const touchHandleFile = (event) => {
  //   setFileTouch(true);
  // };

  // if (userNameIsValid && panNumberIsValid && filePathIsValid) {
  //   formIsValid = true;
  // }

  const urlPost = `${process.env.REACT_APP_API_HOST}/api/addKYCDetails`;
  console.log(urlPost, "here");

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  const handleUserKYCDetail = async (event) => {
    event.preventDefault();

    formData.append("userAccountAddress", account);
    formData.append("userName", name);
    formData.append("panCardNumber", panDetails);
    formData.append("kycDocs", filePath);
    // setUserNameTouch(true);
    // setPanNumberTouch(true);
    // setFileTouch(true);
    // if (userNameIsInvalid && panNumberIsInvalid && fileIsInvalid) {
    //   return;
    // }
    try {
      const response = await Axios.post(urlPost, formData, config);
      alert("KYC done successfully");
      dispatch(
        kycDetails({
          isKycStatusUpdated: true,
        })
      );

      console.log(response, "get new response here");
    } catch (error) {
      console.log(error);
      alert("Please enter the Details");
    }
    // setUserNameTouch(false);
    // setPanNumberTouch(false);
    // setFileTouch(false);
    setName("");
    setPanDetails("");
    setFilePath("");
  };

  return(
    <>
    {kycBool && (<Button variant="primary" onClick={handleShow} style={{ background: "red" , marginLeft:"550px", marginTop:"10px"}}>
    Click here for KYC Form!!
    </Button>)}
      <Modal show={shows} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Fill your KYC details Here!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUserKYCDetail}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name :</Form.Label>
              <Form.Control 
                type="text"
                placeholder="Enter Name"
                autoFocus
                onChange={handleName}
                />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Pan Card Number : </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                autoFocus
                onChange={handlePanDetails}
                
              />
            </Form.Group>
            <Form.Group  className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Control  type="file" name="img" id="file" placeholder="Upload Documents" onChange={handleFile} />
            </Form.Group>
            <Button variant="primary" type="Submit">
            Save  & Submit
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </>

    )
  }
export default KYCUserForm;
