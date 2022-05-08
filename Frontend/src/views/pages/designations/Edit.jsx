import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Grid, Paper, TextField, Typography } from '@mui/material'
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { AxiosPatch, AxiosPost } from '../../../config/Axios';
import { validator_isEmpty, validator_isFloat } from '../../../utils/validator';


function Designation_Edit(props) {
    const { data } = props;
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

    const [input_name, setInput_name] = useState(data?.name);
    const [input_salary, setInput_salary] = useState(data?.salary);

    const handleSubmit = async () => {
        try {

            if(validator_isEmpty(input_name)){
                ShowSnakBar("warning", "Please enter a valid name.");
            } else if(validator_isEmpty(input_salary) || !validator_isFloat(parseFloat(input_salary).toFixed(2))){
                ShowSnakBar("warning", "Please enter a valid salary.");
            } else {

                setLoading(true);

                let request = {
                    id: data?._id,
                    name: input_name,
                    salary: input_salary
                }
                let req = await AxiosPatch("/designation", token, request);
                ShowSnakBar("success", "Designation details edited successfully");
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

    return (
        <Box sx={{ maxWidth: "lg", m: "0 auto", background: "white", p: 5, borderRadius: 3 }}>
            <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                    Add a Designation
                </Typography>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1 }}>
                            <TextField value={input_name} onChange={(e) => { setInput_name(e.target.value) }} fullWidth label="Name" variant="outlined" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1 }}>
                            <TextField type="number" value={input_salary} onChange={(e) => { setInput_salary(e.target.value) }} fullWidth label="Salary" variant="outlined" />
                        </Box>
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

export default Designation_Edit