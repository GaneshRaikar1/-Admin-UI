import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Modal } from "react-bootstrap";
import { useSnackbar } from "notistack";
import TextField from "@mui/material/TextField";


const EditUser = ({ users, setUsers, userId, setModalShow, ...props }) => {
  const userToUpdate = users.find((user) => user.id === userId);
  const { enqueueSnackbar } = useSnackbar();

  const [formValue, setFormValue] = useState({
    email: userToUpdate.email,
    name: userToUpdate.name,
    role: userToUpdate.role,
  });

  const handleChange = (event) => {
    let { id, value } = event.target;
    if (value.trim().length === 0) { value = formValue[name]; }
    setFormValue((values) => {
      return { ...values, [id]: value.trim() };
    });
  };
  const { email, name, role } = formValue;

  const submitHandler = () => {
    const newList = users.map((item) => {
      if (item.id === userId) { return { ...item, ...formValue }; }
      return item;
    });
    enqueueSnackbar("Data Updated successfully ", { variant: "success" });
    setUsers(newList);
    setModalShow(false);
  };

  return (
    <Modal {...props} size="sm" centered>

      <Modal.Header closeButton>
        <Modal.Title>Update user</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <TextField type="email" id="email" placeholder={email} onChange={handleChange} variant="standard" />

        <TextField type="text" id="name" placeholder={name} onChange={handleChange} variant="standard" />

        <TextField type="text" id="role" placeholder={role} onChange={handleChange} variant="standard" />
      </Modal.Body>
      <Modal.Footer gap={2}>

        <Button variant="outlined" color="error" onClick={() => setModalShow(false)} >
          Cancel
        </Button>

        <Button variant="outlined" color="success" onClick={submitHandler}>
          Confirm
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default EditUser;
