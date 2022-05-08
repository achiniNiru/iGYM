import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SummarizeIcon from '@mui/icons-material/Summarize';

import { DATA_GOALS } from '../../../config/data';
import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from '../../../config/Axios';
import { actionTypes } from '../../../store/reducer';
import { useStateValue } from '../../../store/StateProvider';
import { validator_isEmpty } from '../../../utils/validator';
import getAge from '../../../utils/GetAge';

import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

function Goals_Add(props) {
    const { member } = props;
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

    const [input_goal, setInput_goal] = useState(0);
    const [input_height, setInput_height] = useState("");
    const [input_weight, setInput_weight] = useState("");

    const handleSubmit = async () => {
        try {

            let valid_goal = DATA_GOALS.find((item) => {
                return parseInt(item.id) === parseInt(input_goal)
            })

            if (valid_goal === undefined || valid_goal === null) {
                ShowSnakBar("warning", "Please select a valid goal.");
            } else if (validator_isEmpty(input_height)) {
                ShowSnakBar("warning", "Please select a valid height.");
            } else if (validator_isEmpty(input_weight)) {
                ShowSnakBar("warning", "Please enter a valid weight.");
            } else {

                setLoading(true);

                let request = {
                    user: member?._id,
                    goal: valid_goal.id,
                    height: input_height,
                    weight: input_weight
                }
                let req = await AxiosPost("/goals", token, request);
                ShowSnakBar("success", "New goal created successfully");
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
        <React.Fragment>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                <Typography variant="h6" component="h4">
                    Add New Goal
                </Typography>
            </Box>
            <Grid container spacing={{ xs: 0, md: 2 }}>
                <Grid item xs={12} md={6}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Goal</FormLabel>
                        <RadioGroup value={input_goal} onChange={(e) => { setInput_goal(e.target.value) }}
                        >
                            {DATA_GOALS.map((item) => {
                                return <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.label} />
                            })}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ my: 2 }}>
                        <TextField type="number" fullWidth value={input_height} onChange={(e) => { setInput_height(e.target.value) }} label="Height (cm)" variant="outlined" />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <TextField type="number" fullWidth value={input_weight} onChange={(e) => { setInput_weight(e.target.value) }} label="Weight (kg)" variant="outlined" />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 5 }}>
                <Button
                    onClick={() => { props.setAdd_goals(false) }}
                    sx={{ mr: 1, color: 'text.secondary' }}
                >
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </React.Fragment>
    )
}

function Modal_Edit(props) {
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
    const [input_goal, setInput_goal] = useState(data.goal);
    const [input_height, setInput_height] = useState(data.height);
    const [input_weight, setInput_weight] = useState(data.weight);

    const handleSubmit = async () => {
        try {

            let valid_goal = DATA_GOALS.find((item) => {
                return parseInt(item.id) === parseInt(input_goal)
            })

            if (valid_goal === undefined || valid_goal === null) {
                ShowSnakBar("warning", "Please select a valid goal.");
            } else if (validator_isEmpty(input_height)) {
                ShowSnakBar("warning", "Please select a valid height.");
            } else if (validator_isEmpty(input_weight)) {
                ShowSnakBar("warning", "Please enter a valid weight.");
            } else {

                setLoading(true);

                let request = {
                    id: data._id,
                    goal: valid_goal.id,
                    height: input_height,
                    weight: input_weight
                }
                let req = await AxiosPatch("/goals", token, request);
                ShowSnakBar("success", "Goal details edited successfully");
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
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Box sx={{ maxWidth: "lg", m: "0 auto", background: "white", p: 5, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
                    <Typography variant="h6" component="h4">
                        Edit Goal
                    </Typography>
                </Box>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Goal</FormLabel>
                            <RadioGroup value={input_goal} onChange={(e) => { setInput_goal(e.target.value) }}
                            >
                                {DATA_GOALS.map((item) => {
                                    return <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.label} />
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 2 }}>
                            <TextField fullWidth value={input_height} onChange={(e) => { setInput_height(e.target.value) }} label="Height (cm)" variant="outlined" />
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <TextField fullWidth value={input_weight} onChange={(e) => { setInput_weight(e.target.value) }} label="Weight (kg)" variant="outlined" />
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", my: 5 }}>
                    <Button
                        onClick={() => { props.close(false) }}
                        sx={{ mr: 1, color: 'text.secondary' }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

function Modal_Delete(props) {
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

    const handleDelete = async () => {
        try {
            setLoading(true);
            let request = {
                id: data._id
            }
            let req = await AxiosDelete("/goals", token, request);
            ShowSnakBar("success", "Goal deleted successfully");
            window.location.reload();

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
        <Dialog
            open={props.open}
            onClose={() => { props.close(false) }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure you want to delete this goal?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a goal will result in permanent loss of data about the member's goal. this action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Cancel</Button>
                <Button sx={{ color: 'error.main' }} onClick={handleDelete} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function Modal_Report(props) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    
    const { data, member } = props;
    const [{ token }, dispatch] = useStateValue();
    const [data_loaded, setData_loaded] = useState(false);
    const [data_member, setData_member] = useState([]);
    const [data_height, setData_height] = useState(0);
    const [data_bmi, setData_bmi] = useState(0);

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
        if(member){
            setData_member(member);
        }
        let height = parseFloat(data?.height).toFixed(2)/100;
        setData_height(height);
        let bmi = parseFloat(parseFloat(data?.weight)/(data_height*data_height)).toFixed(3)
        setData_bmi(bmi);

    },[props])

    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Box ref={componentRef} sx={{ width: "100%", maxWidth: "sm", m: { xs: "0 20px", sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="h6" sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>Goal Report</Typography>
                    <Box className="donotprint">
                        <IconButton onClick={handlePrint}>
                            <PrintIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" component="span">Goal</Typography>
                        <Typography variant="h5" component="h4" sx={{ fontWeight: "bold" }}>{DATA_GOALS[data?.goal]?.label}</Typography>
                        <Typography variant="subtitle2" component="span">Created on {new Date(data?.timestamp).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" component="span">Name</Typography>
                            <Typography variant="body1" component="h6">{member?.name}</Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" component="span">Age</Typography>
                            <Typography variant="body1" component="h6">{getAge(data_member?.dob)}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mt: 1.5 }}>
                            <Typography variant="caption" component="span">Height</Typography>
                            <Typography variant="body1" component="h6">{data_height} m</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mt: 1.5 }}>
                            <Typography variant="caption" component="span">Weight</Typography>
                            <Typography variant="body1" component="h6">{data?.weight} kg</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mt: 1.5 }}>
                            <Typography variant="caption" component="span">BMI</Typography>
                            <Typography variant="body1" component="h6">{data_bmi}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box className="donotprint" sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button
                        onClick={() => { props.close(false) }}
                        sx={{ mr: 1, color: 'text.secondary' }}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

function Row(props) {
    const { row, member } = props;
    const [action_report, setAction_report] = useState(false);
    const [action_edit, setAction_edit] = useState(false);
    const [action_delete, setAction_delete] = useState(false);

    let data_height = parseFloat(row.height).toFixed(2)/100
    let data_bmi = parseFloat(parseFloat(row.weight)/(data_height*data_height)).toFixed(3)

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: "unset" }}>

                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{DATA_GOALS[row.goal].label}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{data_height}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row.weight}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{data_bmi}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{new Date(row.timestamp).toLocaleDateString()}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">
                    <IconButton onClick={() => { setAction_report(true) }}>
                        <SummarizeIcon />
                    </IconButton>
                    <IconButton onClick={() => { setAction_edit(true) }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { setAction_delete(true) }}>
                        <DeleteIcon sx={[{ '&:hover': { color: '#f44336', transition: '1s' } }]} />
                    </IconButton>
                </TableCell>

                <Modal_Report open={action_report} close={setAction_report} data={row} member={member} />
                <Modal_Edit open={action_edit} close={setAction_edit} data={row} />
                <Modal_Delete open={action_delete} close={setAction_delete} data={row} />
                <Modal_Report />
            </TableRow>
        </React.Fragment>
    );
}

function Goals_View(props) {
    const { member } = props;
    const [{ token }, dispatch] = useStateValue();
    const [data_goals, setData_goals] = useState([]);
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
    useEffect(() => {
        async function fetchData() {
            try {
                let req = await AxiosGet(`/goals?user=${member?._id}`, token);
                setData_goals(req.data.result);
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
    }, [])

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" component="h4">
                    Goals
                </Typography>
                <Button onClick={() => { props.setAdd_goals(true) }}>
                    <AddCircleOutlineIcon />&nbsp;Add New Goal
                </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Goal</TableCell>
                            <TableCell align="right">Height(m)</TableCell>
                            <TableCell align="right">Weight(kg)</TableCell>
                            <TableCell align="right">BMI(kg m<sup>-2</sup>)</TableCell>
                            <TableCell align="right">Created on</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_goals.map((row) => (
                            <Row key={row.name} row={row} member={member} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

function Goals(props) {
    const { member } = props;
    const [{ token }, dispatch] = useStateValue();
    function setLoading(state) {
        dispatch({
            type: actionTypes.SET_LOADING,
            loading: state
        });
    }
    const [add_goals, setAdd_goals] = useState(false);

    return (
        <Paper elevation={0} sx={{ width: '100%', maxWidth: "md", background: "white", p: 5, borderRadius: 3, m: { xs: "3rem 20px", md: "3rem auto" }, height: "70vh" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }} component="h6">{member.name}</Typography>
                <Button sx={{ color: 'text.secondary' }} onClick={() => { setLoading(true); props.switchView(false) }}>Back to profile</Button>
            </Box>

            {add_goals ? (
                <Goals_Add setAdd_goals={setAdd_goals} member={member} />
            ) : (
                <Goals_View setAdd_goals={setAdd_goals} member={member} />
            )}
        </Paper>
    )
}

export default Goals