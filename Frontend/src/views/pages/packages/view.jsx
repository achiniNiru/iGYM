import React, { useRef, useState, useEffect } from 'react';
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
import FormLabel from '@mui/material/FormLabel';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { PACKAGE_CLASSES, PACKAGE_DURATIONS } from '../../../config/data';
import Search from '../../../components/Search';
import { AxiosDelete, AxiosGet, AxiosPost } from '../../../config/Axios';
import Packages_Edit from './Edit';

function Modal_Edit(props) {
    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Packages_Edit data={props.data} />
        </Modal>
    )
}

function Modal_Delete(props) {
    let { data } = props;
    const [{token}, dispatch] = useStateValue();
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
            let req = await AxiosDelete("/package", token, request);
            ShowSnakBar("success", "Package deleted successfully");
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
                Are you sure you want to delete this package?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a package will result in permanent loss of data about the package and may effect members, this action cannot be undone.
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

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: "unset" }}>
                <TableCell sx={{ borderBottom: "unset", width: "20px" }}>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row.title}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{PACKAGE_DURATIONS.find((item)=>item.id === row.duration).label}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row.fee}</TableCell>
            </TableRow>
            <TableRow>

                <Modal_Edit tabFunction={props.tabFunction} open={action_edit} close={setAction_edit} data={row} />
                <Modal_Delete open={action_delete} close={setAction_delete} data={row} />

                {open && (
                    <React.Fragment>
                        <TableCell colSpan={1}></TableCell>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Grid container spacing={2} sx={{ pb: 2 }}>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" component="p">Access</Typography>
                                        {Object.keys(row.access).map((key)=>{
                                            let label = PACKAGE_CLASSES.find((item)=>item.id === key).label;
                                            return <Typography key={key} variant="subtitle2" component="p" sx={{ml:1}}>{label}</Typography>
                                        })}
                                    </Grid>
                                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                                        <IconButton onClick={() => { setAction_edit(true) }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => { setAction_delete(true) }}>
                                            <DeleteIcon sx={[{ '&:hover': { color: '#f44336', transition: '1s' } }]} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </TableCell>
                    </React.Fragment>
                )}
            </TableRow>
        </React.Fragment>
    );
}

function Member_Profile(props) {
    const [{ token }, dispatch] = useStateValue();
    const [data_packages, setData_packages] = useState([]);
    const [data_packages_store, setData_packages_store] = useState([]);
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
                let req = await AxiosGet("/package", token);
                setData_packages(req.data.result);
                setData_packages_store(req.data.result);
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
            <Search label="Search members" storedData={data_packages_store} setData={setData_packages} searchname="title"/>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                Packages
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Duration</TableCell>
                            <TableCell align="right">Fee</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_packages.map((row, index) => (
                            <Row tabFunction={props.tabFunction} key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Member_Profile