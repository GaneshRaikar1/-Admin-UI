import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Stack, Table } from "react-bootstrap";
import Button from '@mui/material/Button';
import SearchBar from "./SearchBar";
import EditUser from "./EditUser";
import CustomPagination from "./CustomPagination";
import { useSnackbar } from "notistack";

export const AdminScreen = () => {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchText, setSearchText] = useState("");
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedUsers, setCheckedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateUserId, setUpdateUserId] = useState(null);
  
  const API_URL = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  const rowsPerPage = 10;

  const updateUser = (userId) => {
    setUpdateUserId(userId);
    setModal(true);
  };

  const handleSelectAll = (event) => {
    let newList = [...selectedUsers];
    if (event.target.checked) {
      setIsAllChecked(true);
      newList = currentUsers.map((user) => user.id);
    } else {
      setIsAllChecked(false);
      newList = [];
    }
    setCheckedUsers(newList);
  };

  const handleDeleteSelected = () => {
    const newList = users.filter( (user) => !selectedUsers.includes(user.id) );
    const newFilteredList = filteredUsers.filter( (user) => !selectedUsers.includes(user.id) ); 
    setUsers(newList);
    setFilteredUsers(newFilteredList);
    setIsAllChecked(false);
    if (selectedUsers.length ){ enqueueSnackbar("Data deleted successfully ", { variant: "success" }); }
    else{ enqueueSnackbar("No data selected to delete ", { variant: "warning" }); }
  };

  const handleSelect = (event) => {
    const userId = event.target.value;
    let newList = [...selectedUsers];
    if (event.target.checked) { newList = [...selectedUsers, userId]; } 
    else {
      setIsAllChecked(false);
      newList.splice(selectedUsers.indexOf(userId), 1);
    }
    setCheckedUsers(newList);
  };

  const handleDelete = (userId) => {
    const newList  = users.filter((user) => user.id !== userId);
    enqueueSnackbar("Data deleted successfully ", { variant: "success" });
    setUsers(newList );
  };

  const onSearch = (event) => { setSearchText(event.target.value); };

  const filter = useCallback(() => {
    if (searchText !== "") {
      const result = users.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(searchText))
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(users);
    }
  },[users, searchText])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.log("Error in getting users", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filter();
  }, [users, searchText,filter]);


  const lastUserIndex = currentPage * rowsPerPage;
  const firstUserIndex = lastUserIndex - rowsPerPage;
  const currentUsers = filteredUsers.length ? filteredUsers.slice(firstUserIndex, lastUserIndex) : users.slice(firstUserIndex, lastUserIndex);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const paginate = (pageNumber) => {
   if(!isAllChecked){ setIsAllChecked(false) }
    setCurrentPage(pageNumber)
  };


  return (
    <Container >
      <Row>
        <Col>
          <SearchBar onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col >
          <Table hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check type="checkbox" onChange={handleSelectAll} checked={isAllChecked} />
                </th>
                <th>Name</th> <th>Email</th> <th>Role</th> <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers.map((user) => {
                  return (
                    <tr key={user.id} >
                      <td>
                        <Form.Check type="checkbox" value={user.id} onChange={handleSelect} 
                         checked={selectedUsers.includes(user.id)} />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Stack direction="horizontal" >
                          <Button variant="link" size="sm" onClick={() => updateUser(user.id)} >
                            <i className="bi bi-pencil-square text-primary"></i>
                          </Button>

                          <Button variant="link" size="sm" onClick={() => handleDelete(user.id)} >
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
   {
    <Row className="pt-2 pt-md-0">
    <Col xs="12" md="4" sm="6">
    <Button variant="outlined" color="error" onClick={handleDeleteSelected}>
        Delete Selected
      </Button>
    </Col>

    <Col xs="12" md="8" sm="6">
      <CustomPagination currentPage={currentPage} checked={isAllChecked} 
        totalPages={totalPages} paginate={paginate}
        disabled={selectedUsers.length > 0 ? false : true} />
    </Col>
  </Row>
   }
      {modal ? (
        <EditUser setUsers={setUsers} users={users}
          setModal={setModal} userId={updateUserId}
          onHide={() => setModal(false)}
          show={modal} />
      ) : ( null )}
    </Container>
  );
};
