import React, { useEffect, useRef, useState } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Grid, Modal } from '@mui/material';
import { Avatar, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import Search from '../../../components/Search';
import { AxiosDelete, AxiosGet, AxiosPatch } from '../../../config/Axios';
import { BACKEND_URL } from '../../../config/data';
import { validator_isEmpty } from '../../../utils/validator';

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

    const inputFileRef = useRef();
    const [input_image, setInput_image] = useState(`${BACKEND_URL}static/equipment/${data?.dp}`);
    const [input_new_image, setInput_new_image] = useState('');
    const [input_image_blob, setInput_image_blob] = useState(`${BACKEND_URL}static/equipment/${data?.dp}`);
    const [input_name, setInput_name] = useState(data?.name);
    const [input_eqCode, setInput_eqCode] = useState(data?.code);
    const [input_type, setInput_type] = useState(data?.type);
    const [input_weight, setInput_weight] = useState(data?.weight);

    useEffect(() => {
        setLoading(false);
    }, [])

    const handleSubmit = async () => {
        if (validator_isEmpty(input_name)) {
            ShowSnakBar("warning", "Equipment name is required.");
        } else if (validator_isEmpty(input_type)) {
            ShowSnakBar("warning", "Equipment type is required.");
        } else if (validator_isEmpty(input_eqCode)) {
            ShowSnakBar("warning", "Please enter a code number for equipment.");
        } else if (validator_isEmpty(input_weight)) {
            ShowSnakBar("warning", "You must enter a weight for the equipment.");
        } else if (input_new_image !== "" && validator_isEmpty(input_new_image.name)) {
            ShowSnakBar("warning", "Please insert a valid profile image.");
        } else {

            let formData = new FormData();
            if (input_new_image !== "" && !validator_isEmpty(input_new_image.name)) {
                formData.append('display_pic', input_new_image);
            }
            formData.append('id', data?._id);
            formData.append('name', input_name);
            formData.append('type', input_type);
            formData.append('code', input_eqCode);
            formData.append('weight', input_weight);
            formData.append('display_pic', input_image);

            setLoading(true);
            try {
                const req = await AxiosPatch("/equipment", token, formData, { formData: true });
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
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Box sx={{ maxWidth: "lg", m: "0 auto", background: "white", p: 5, borderRadius: 3 }}>
                <Paper variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
                    <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                        Update Equipment
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
        </Modal>
    )
}

function Modal_Delete(props) {
    let { data } = props;
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
            let req = await AxiosDelete("/equipment", token, request);
            ShowSnakBar("success", "Equipment deleted successfully");
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
                Are you sure you want to delete this equipment?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a equipment will result in permanent loss of data about the equipment and may effect members, this action cannot be undone.
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

function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [action_edit, setAction_edit] = useState(false);
    const [action_delete, setAction_delete] = useState(false);
    const [action_Profile, setAction_Profile] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: "unset" }}>
                <TableCell sx={{ borderBottom: "unset" }} component="th">
                    <Avatar alt={row?.name} src={`${BACKEND_URL}static/equipment/${row?.dp}`} />
                </TableCell>
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row.code}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }}>{row.name}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row.type}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row.weight}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">
                    <IconButton onClick={() => { setAction_edit(true) }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { setAction_delete(true) }}>
                        <DeleteIcon sx={[{ '&:hover': { color: '#f44336', transition: '1s' } }]} />
                    </IconButton>
                </TableCell>

                <Modal_Edit tabFunction={props.tabFunction} open={action_edit} close={setAction_edit} data={row} />
                <Modal_Delete open={action_delete} close={setAction_delete} data={row} />

            </TableRow>
        </React.Fragment>
    );
}

function Member_Profile(props) {
    const [{ token }, dispatch] = useStateValue();
    const [data_equipment, setData_equipment] = useState([]);
    const [data_equipment_store, setData_equipment_store] = useState([]);
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
                let req = await AxiosGet("/equipment", token);
                setData_equipment(req.data.result);
                setData_equipment_store(req.data.result);
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
        <Paper elevation={0} sx={{ maxWidth: "md", m: "0.25rem auto" }}>
            <Search label="Search equipment" storedData={data_equipment_store} setData={setData_equipment} />
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                Equipment
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{color:"primary.main"}}>Code</TableCell>
                            <TableCell sx={{color:"primary.main"}}>Name</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Type</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Weight(kg)</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_equipment.map((row) => (
                            <Row tabFunction={props.tabFunction} key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Member_Profile