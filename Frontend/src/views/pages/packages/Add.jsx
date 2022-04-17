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
import { validator_isEmpty, validator_isFloat } from '../../../utils/validator';
import { AxiosPost } from '../../../config/Axios';

function Package_Add(props) {
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

    useEffect(() => {
        setLoading(false);
    }, [])

    const [input_title, setInput_title] = useState("");
    const [input_duration, setInput_duration] = useState("");
    const [input_fee, setInput_fee] = useState("");
    const [input_access, setInput_access] = useState({});

    const handleSubmit = async () => {
        try {

            if(validator_isEmpty(input_title)){
                ShowSnakBar("warning", "Please enter a valid title for the package.");
            } else if(validator_isEmpty(input_duration)){
                ShowSnakBar("warning", "Please select a valid duration for the package.");
            } else if(validator_isEmpty(input_fee) || !validator_isFloat(parseFloat(input_fee).toFixed(2))){
                ShowSnakBar("warning", "Please enter a valid salary.");
            } else {

                setLoading(true);

                let request = {
                    title: input_title,
                    fee: input_fee,
                    duration: input_duration,
                    access: input_access
                }
                let req = await AxiosPost("/package", token, request);
                ShowSnakBar("success", "New package created successfully");
                window.location.reload();

            }

        } catch (err) {
            if (err.response.data.error) {
                ShowSnakBar("error", err.response.data.error);
            } else {
                ShowSnakBar("error", "Unexpected error occurred.")
            }
        } finally {
            setLoading(false);
        }
    }

    const handleAccessChange = (e) => {
        setInput_access({
            ...input_access,
            [e.target.name]: e.target.checked,
        });
    };

    return (
        <Box sx={{ maxWidth: "md", m: "0 auto" }}>
            <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                    Add a New Package
                </Typography>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_title} onChange={(e) => { setInput_title(e.target.value) }} fullWidth label="Title" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Duration</InputLabel>
                                <Select
                                    label="Duration"
                                    value={input_duration}
                                    onChange={(e) => { setInput_duration(e.target.value) }}
                                >
                                    {PACKAGE_DURATIONS.map((item, index) => {
                                        return <MenuItem key={index} value={item.id}>{item.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ my: 1 }}>
                            <TextField type="number" value={input_fee} onChange={(e) => { setInput_fee(e.target.value) }} fullWidth label="Fee" variant="outlined" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl sx={{ mx: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Access</FormLabel>
                            <FormGroup>
                                {PACKAGE_CLASSES.map((item, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox checked={input_access?.[item.id]} name={item.id} onChange={handleAccessChange} />
                                            }
                                            label={item.label}
                                        />
                                    )
                                })}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Package_Add