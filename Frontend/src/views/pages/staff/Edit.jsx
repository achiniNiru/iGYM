import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import validator from 'validator';
import { validator_isEmpty } from '../../../utils/validator';
import { AxiosGet, AxiosPatch } from '../../../config/Axios';
import { BACKEND_URL } from '../../../config/data';

function Staff_Edit(props) {
    const { data } = props;
    const [{ token }, dispatch] = useStateValue();
    const [data_designations, setData_designations] = useState([]);
    const [data_loaded, setData_loaded] = useState(false)
    function setLoading(state) {
        dispatch({
            type: actionTypes.SET_LOADING,
            loading: state
        });
    }
    function ShowSnakBar(severity, msg) {
        dispatch({
            type: actionTypes.SET_SNACKBAR,
            snackbar: true,
            severity: severity,
            msg: msg
        });
    }

    useEffect(()=>{
        async function fetchData() {
            try {
                let req = await AxiosGet("/designation", token);
                setData_designations(req.data.result);
                setData_loaded(true);
            } catch (err) {
                ShowSnakBar("error", "Unexpected error occurred")
            } finally {
                setLoading(false);
            }
        }
        if (!data_loaded) {
            fetchData()
        }
    },[])

    const inputFileRef = useRef();
    const [input_image, setInput_image] = useState(`${BACKEND_URL}static/staff/${data?.dp}`);
    const [input_new_image, setInput_new_image] = useState('');
    const [input_image_blob, setInput_image_blob] = useState(`${BACKEND_URL}static/staff/${data?.dp}`);
    const [input_firstName, setInput_firstName] = useState(data.fname);
    const [input_lastName, setInput_lastName] = useState(data.lname);
    const [input_birthday, setInput_birthday] = useState(data.dob);
    const [input_address, setInput_address] = useState(data.address);
    const [input_nic, setInput_nic] = useState(data.nic);
    const [input_mobileNo, setInput_mobileNo] = useState(data.phone);
    const [input_mobileNo2, setInput_mobileNo2] = useState(data.phone2);
    const [input_home, setInput_home] = useState(data.home);
    const [input_email, setInput_email] = useState(data.email);
    const [input_gender, setInput_gender] = useState(data.gender);
    const [input_maritialStatus, setInput_maritialStatus] = useState(data.maritial_status);
    const [input_designation, setInput_designation] = useState(data.designation);
    const [input_center, setInput_center] = useState(data.center);

    const handleSubmit = async () => {
        if(validator_isEmpty(input_firstName)){
            ShowSnakBar("warning", "First name is required.");
        } else if(validator_isEmpty(input_lastName)){
            ShowSnakBar("warning", "Last name is required.");
        } else if(validator_isEmpty(input_birthday) || validator.toDate(input_birthday) === null){
            ShowSnakBar("warning", "Please enter a valid Date of Birth.");
        } else if(validator_isEmpty(input_address)) {
            ShowSnakBar("warning", "You must enter a valid address.");
        } else if(validator_isEmpty(input_nic) || !validator.isIdentityCard(input_nic,'any')){
            ShowSnakBar("warning", "Please enter a valid NIC.");
        } else if(validator_isEmpty(input_mobileNo) || !validator.isMobilePhone(input_mobileNo)){
            ShowSnakBar("warning", "Please enter a valid phone number.");
        } else if(validator_isEmpty(input_mobileNo2) || !validator.isMobilePhone(input_mobileNo2)){
            ShowSnakBar("warning", "Please provide a sercondary phone number.");
        } else if(validator_isEmpty(input_home)){
            ShowSnakBar("warning", "Please enter a valid home contact number.");
        } else if(validator_isEmpty(input_email) || !validator.isEmail(input_email)) {
            ShowSnakBar("warning", "Please enter a valid email address.");
        } else if(validator_isEmpty(input_gender)){
            ShowSnakBar("warning", "Please select a valid gender.");
        } else if(validator_isEmpty(input_maritialStatus)){
            ShowSnakBar("warning", "Please select a valid maritial status.");
        } else if(validator_isEmpty(input_designation)){
            ShowSnakBar("warning", "Please select a valid designation.");
        } else if(validator_isEmpty(input_center)){
            ShowSnakBar("warning", "Please select a valid center.");
        } else if (input_new_image !== "" && validator_isEmpty(input_new_image.name)) {
            ShowSnakBar("warning", "Please insert a valid profile image.");
        } else {
            
            let formData = new FormData();
            if (input_new_image !== "" && !validator_isEmpty(input_new_image.name)) {
                formData.append('display_pic', input_new_image);
            }
            formData.append('id', data?._id);
            formData.append('fname', input_firstName);
            formData.append('lname', input_lastName);
            formData.append('dob', input_birthday);
            formData.append('address', input_address);
            formData.append('nic', input_nic);
            formData.append('phone', input_mobileNo);
            formData.append('phone2', input_mobileNo2);
            formData.append('home', input_home);
            formData.append('email', input_email);
            formData.append('gender', input_gender);
            formData.append('maritial_status', input_maritialStatus);
            formData.append('designation', input_designation);
            formData.append('center', input_center);
            formData.append('display_pic', input_image);

            setLoading(true);
            try {
                const req = await AxiosPatch("/staff", token, formData, { formData: true });
                ShowSnakBar("success", "Staff member updated successfully");
                window.location.reload();
            } catch (err) {
                if (err.response.data.error) {
                    ShowSnakBar("error", err.response.data.error);
                } else {
                    ShowSnakBar("error", "Unexpected error occurred while trying to submit")
                }
            } finally {
                setLoading(false);
            }

        }
    }

    const tiggerUpload = () => {
        inputFileRef.current.click();
    };
    const handleFileInput = (e) => {
        setInput_image(e.target.files[0]);
        setInput_image_blob(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <Box sx={{ width: "100%", maxWidth: "md", m: "0 auto", background: "white", p: 5, borderRadius: 3 }}>
            <Paper variant="outlined" sx={{ p: 5, maxWidth: "md" }}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                    Edit staff
                </Typography>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Avatar
                                alt={input_firstName + " " + input_lastName}
                                src={input_image_blob}
                                sx={{ width: 135, height: 135, m: "2rem auto", cursor: "pointer" }}
                                onClick={tiggerUpload}
                            />
                            <input
                                ref={inputFileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChangeCapture={handleFileInput}
                            />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_firstName} onChange={(e) => { setInput_firstName(e.target.value) }} fullWidth label="First Name" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_lastName} onChange={(e) => { setInput_lastName(e.target.value) }} fullWidth label="Last Name" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField type="date" value={input_birthday} onChange={(e) => { setInput_birthday(e.target.value) }} fullWidth label="Birthday" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_address} onChange={(e) => { setInput_address(e.target.value) }} fullWidth label="Address" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_nic} onChange={(e) => { setInput_nic(e.target.value) }} fullWidth label="NIC" variant="outlined" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_mobileNo} onChange={(e) => { setInput_mobileNo(e.target.value) }} fullWidth label="Contact Number 1" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_mobileNo2} onChange={(e) => { setInput_mobileNo2(e.target.value) }} fullWidth label="Contact Number 2" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_home} onChange={(e) => { setInput_home(e.target.value) }} fullWidth label="Home Number" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_email} onChange={(e) => { setInput_email(e.target.value) }} fullWidth label="Email Address" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    value={input_gender}
                                    onChange={(e) => { setInput_gender(e.target.value) }}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Maritial Status</InputLabel>
                                <Select
                                    label="Maritial Status"
                                    value={input_maritialStatus}
                                    onChange={(e) => { setInput_maritialStatus(e.target.value) }}
                                >
                                    <MenuItem value="Unmarried">Unmarried</MenuItem>
                                    <MenuItem value="Married">Married</MenuItem>
                                    <MenuItem value="Devorced">Devorced</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Designation</InputLabel>
                                <Select
                                    label="Designation"
                                    value={input_designation}
                                    onChange={(e) => { setInput_designation(e.target.value) }}
                                >
                                    {data_designations.map((item) => {
                                        return <MenuItem value={item.name}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Center</InputLabel>
                                <Select
                                    label="Center"
                                    value={input_center}
                                    onChange={(e) => { setInput_center(e.target.value) }}
                                >
                                    <MenuItem value="Center 1">Center 1</MenuItem>
                                    <MenuItem value="Center 2">Center 2</MenuItem>
                                    <MenuItem value="Center 3">Center 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
}

export default Staff_Edit