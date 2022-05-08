import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import { Avatar, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { PACKAGE_CLASSES, PACKAGE_DURATIONS } from '../../../config/data';
import { validator_isEmpty } from '../../../utils/validator';
import { AxiosPost } from '../../../config/Axios';

function Equipment_Add(props) {
    const [{ token }, dispatch] = useStateValue();
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

    const inputFileRef = useRef();
    const [input_image, setInput_image] = useState("");
    const [input_image_blob, setInput_image_blob] = useState("");
    const [input_name, setInput_name] = useState("");
    const [input_eqCode, setInput_eqCode] = useState("");
    const [input_type, setInput_type] = useState("");
    const [input_weight, setInput_weight] = useState("");

    useEffect(() => {
        setLoading(false);
    }, [])

    const handleSubmit = async () => {
        if(validator_isEmpty(input_name)){
            ShowSnakBar("warning", "Equipment name is required.");
        } else if(validator_isEmpty(input_type)){
            ShowSnakBar("warning", "Equipment type is required.");
        } else if(validator_isEmpty(input_eqCode)){
            ShowSnakBar("warning", "Please enter a code number for equipment.");
        } else if(validator_isEmpty(input_weight)) {
            ShowSnakBar("warning", "You must enter a weight for the equipment.");
        } else if (validator_isEmpty(input_image.name)) {
            ShowSnakBar("warning", "Please insert a valid profile image.");
        } else {
            
            let formData = new FormData();
            formData.append('name', input_name);
            formData.append('type', input_type);
            formData.append('code', input_eqCode);
            formData.append('weight', input_weight);
            formData.append('display_pic', input_image);

            setLoading(true);
            try {
                const req = await AxiosPost("/equipment", token, formData, { formData: true });
                ShowSnakBar("success", "Successfully added a new equipment");
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
        <Box sx={{maxWidth:"md", m:"0 auto"}}>
            <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                    Add a New Equipment
                </Typography>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Avatar
                                alt={input_name}
                                src={input_image_blob}
                                sx={{ width: 135, height: 135, m:"2rem auto", cursor:"pointer" }}
                                onClick={tiggerUpload}
                            />
                            <input
                                ref={inputFileRef}
                                type="file"
                                accept="image/*"
                                style={{display: "none"}}
                                onChangeCapture={handleFileInput}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_name} onChange={(e) => { setInput_name(e.target.value) }} fullWidth label="Equipment Name" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_type} onChange={(e) => { setInput_type(e.target.value) }} fullWidth label="Equipment Type" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_eqCode} onChange={(e) => { setInput_eqCode(e.target.value) }} fullWidth label="Equipment Code Number" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_weight} onChange={(e) => { setInput_weight(e.target.value) }} fullWidth label="Weight of Equipment (kg)" variant="outlined" />
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
    );
}

export default Equipment_Add