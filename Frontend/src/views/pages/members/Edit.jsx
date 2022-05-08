import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { Avatar, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { BACKEND_URL, DATA_GENDERS } from '../../../config/data';
import validator from 'validator'
import { validator_isEmpty } from '../../../utils/validator';
import { AxiosGet, AxiosPatch, AxiosPost } from '../../../config/Axios';


function Members_Edit(props) {
    const { data, packages } = props;
    const [{ token }, dispatch] = useStateValue();
    function ShowSnakBar(severity, msg) {
        dispatch({
            type: actionTypes.SET_SNACKBAR,
            snackbar: true,
            severity: severity,
            msg: msg
        });
    }
    function setLoading(state) {
        dispatch({
            type: actionTypes.SET_LOADING,
            loading: state
        });
    }

    const [assignPackages, setAssignPackages] = useState(false);

    const inputFileRef = useRef();
    const [input_image, setInput_image] = useState(`${BACKEND_URL}static/members/${data?.dp}`);
    const [input_new_image, setInput_new_image] = useState('');
    const [input_image_blob, setInput_image_blob] = useState(`${BACKEND_URL}static/members/${data?.dp}`);
    const [input_name, setInput_name] = useState(data?.name);
    const [input_birthday, setInput_birthday] = useState(data?.dob);
    const [input_mobileNo, setInput_mobileNo] = useState(data?.phone);
    const [input_email, setInput_email] = useState(data?.email);
    const [input_nic, setInput_nic] = useState(data?.nic);
    const [input_gender, setInput_gender] = useState(data?.gender);
    const [input_address, setInput_address] = useState(data?.address);
    const [input_packages, setInput_packages] = useState(data?.packages);

    const handleSubmit = async (e) => {

        if (validator_isEmpty(input_name)) {
            ShowSnakBar("warning", "Please enter a valid name.");
        } else if (validator_isEmpty(input_birthday) || validator.toDate(input_birthday) === null) {
            ShowSnakBar("warning", "Please enter a valid Date of Birth.");
        } else if (validator_isEmpty(input_mobileNo) || !validator.isMobilePhone(input_mobileNo)) {
            ShowSnakBar("warning", "Please enter a valid phone number.");
        } else if (validator_isEmpty(input_email) || !validator.isEmail(input_email)) {
            ShowSnakBar("warning", "Please enter a valid email address.");
        } else if (validator_isEmpty(input_nic) || !validator.isIdentityCard(input_nic, 'any')) {
            ShowSnakBar("warning", "Please enter a valid NIC.");
        } else if (validator_isEmpty(input_gender)) {
            ShowSnakBar("warning", "Please select a valid gender.");
        } else if (validator_isEmpty(input_address)) {
            ShowSnakBar("warning", "You must enter a valid address.");
        } else if (input_new_image !== "" && validator_isEmpty(input_new_image.name)) {
            ShowSnakBar("warning", "Please insert a valid profile image.");
        } else {

            let formData = new FormData();
            if (input_new_image !== "" && !validator_isEmpty(input_new_image.name)) {
                formData.append('display_pic', input_new_image);
            }
            formData.append('id', data?._id);
            formData.append('name', input_name);
            formData.append('dob', input_birthday);
            formData.append('phone', input_mobileNo);
            formData.append('email', input_email);
            formData.append('nic', input_nic);
            formData.append('gender', input_gender);
            formData.append('address', input_address);

            formData.append('packages', JSON.stringify(input_packages));

            setLoading(true);
            try {
                const req = await AxiosPatch("/members", token, formData, { formData: true });
                ShowSnakBar("success", "Successfully edited member details");
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
        setInput_new_image(e.target.files[0])
        setInput_image_blob(URL.createObjectURL(e.target.files[0]));
    };

    const handleChangePackage = (e) => {
        setInput_packages({
            ...input_packages,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <Box sx={{ maxWidth: "lg", m: "0 auto", background: "white", p: 5, borderRadius: 3 }}>
            {assignPackages ? (
                <React.Fragment>
                    <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                            Assign Packages to member
                        </Typography>
                        <FormGroup>
                            {packages.map((item, index) => {
                                return <FormControlLabel control={<Checkbox checked={input_packages[item._id]} onChange={handleChangePackage} name={item._id} />} label={item.title} />
                            })}
                        </FormGroup>
                    </Paper>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={false}
                            onClick={() => setAssignPackages(false)}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                            Update member details
                        </Typography>
                        <Grid container spacing={{ xs: 0, md: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Avatar
                                        alt={input_name}
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
                                    <TextField value={input_name} onChange={(e) => { setInput_name(e.target.value) }} fullWidth label="Name" variant="outlined" />
                                </Box>
                                <Box sx={{ my: 1 }}>
                                    <TextField value={input_birthday} onChange={(e) => { setInput_birthday(e.target.value) }} fullWidth label="Birthday" variant="outlined" type="date" />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ my: 1 }}>
                                    <TextField value={input_mobileNo} onChange={(e) => { setInput_mobileNo(e.target.value) }} fullWidth label="Mobile Number" variant="outlined" />
                                </Box>
                                <Box sx={{ my: 1 }}>
                                    <TextField value={input_email} onChange={(e) => { setInput_email(e.target.value) }} fullWidth label="Email Address" variant="outlined" />
                                </Box>
                                <Box sx={{ my: 1 }}>
                                    <TextField value={input_nic} onChange={(e) => { setInput_nic(e.target.value) }} fullWidth label="NIC" variant="outlined" />
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
                                    <TextField value={input_address} onChange={(e) => { setInput_address(e.target.value) }} fullWidth label="Address" variant="outlined" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={true}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button
                            onClick={() => { setAssignPackages(true) }}
                        >
                            Next
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    )
}

export default Members_Edit