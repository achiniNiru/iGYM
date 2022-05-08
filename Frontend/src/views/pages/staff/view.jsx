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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import Search from '../../../components/Search';
import { AxiosGet, AxiosDelete } from '../../../config/Axios';
import { BACKEND_URL } from '../../../config/data';
import Staff_Edit from './Edit';

import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

function Modal_Edit(props) {
    const [, dispatch] = useStateValue();
    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Staff_Edit data={props.data}/>
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
            let req = await AxiosDelete("/staff", token, request);
            ShowSnakBar("success", "Staff deleted successfully");
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
                Are you sure you want to delete this staff?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a staff will result in permanent loss of data about the staff and may effect members, this action cannot be undone.
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
    const { data } = props;

    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Box ref={componentRef} sx={{ width: "100%", maxWidth: "sm", m: {xs:"0 20px", sm:"0 auto"}, background: "white", p: 5, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="h6" sx={{textAlign: "center", mb:2, fontWeight: "bold"}}>GYM staff</Typography>
                    <Box className="donotprint">
                        <IconButton onClick={handlePrint}>
                            <PrintIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Avatar
                                alt={data.fname}
                                src={`${BACKEND_URL}static/staff/${data?.dp}`}
                                sx={{ width: 135, height: 135, m:"2rem auto" }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{mt:{xs:2, sm: 0}}}>
                        <Box sx={{ mb:1 }}>
                            <Typography variant="caption" component="span">Name</Typography>
                            <Typography variant="body1" component="h6">{data.fname}&nbsp;{data?.lname}</Typography>
                        </Box>
                        <Box sx={{ mb:1 }}>
                            <Typography variant="caption" component="span">Address</Typography>
                            <Typography variant="body1" component="h6">{data.address}</Typography>
                        </Box>
                        <Box sx={{ mb:1 }}>
                            <Typography variant="caption" component="span">Phone Number</Typography>
                            <Typography variant="body1" component="h6">{data.phone}</Typography>
                            <Typography variant="body1" component="h6">{data.phone2}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box className="donotprint" sx={{ display:"flex", justifyContent: "flex-end", mt:2 }}>
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
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [action_edit, setAction_edit] = useState(false);
    const [action_delete, setAction_delete] = useState(false);
    const [action_report, setAction_report] = useState(false);


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
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">
                    <Avatar alt={row?.name} src={`${BACKEND_URL}static/staff/${row?.dp}`} />
                </TableCell>
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row.fname}&nbsp;{row?.lname}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.center}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.gender}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.designation}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">
                    <DoneIcon color="success" />
                </TableCell>
            </TableRow>
            <TableRow>

                <Modal_Edit tabFunction={props.tabFunction} open={action_edit} close={setAction_edit} data={row}/>
                <Modal_Delete open={action_delete} close={setAction_delete} data={row}/>
                <Modal_Report open={action_report} close={setAction_report} data={row} />

                {open && (
                    <React.Fragment>
                        <TableCell colSpan={1}></TableCell>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Grid container spacing={2} sx={{ pb: 2 }}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" component="p">Mobile Number</Typography>
                                        <Typography variant="subtitle2" component="p">{row?.phone}</Typography>
                                        <Typography variant="subtitle2" component="p">{row?.phone2}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" component="p">Birthday</Typography>
                                        <Typography variant="subtitle2" component="p">{row?.dob}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" component="p">Address</Typography>
                                        <Typography variant="subtitle2" component="p">N{row?.address}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                        <Button
                                            sx={{ color: 'text.secondary' }}
                                            onClick={()=>{setAction_report(true)}}
                                        >View Report</Button>
                                        <Box>
                                            <IconButton onClick={() => { setAction_edit(true) }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => { setAction_delete(true) }}>
                                                <DeleteIcon sx={[{ '&:hover': { color: '#f44336', transition: '1s' } }]} />
                                            </IconButton>
                                        </Box>
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
    const [data_staff, setData_staff] = useState([])
    const [data_staff_store, setData_staff_store] = useState([])
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
                let req = await AxiosGet("/staff", token);
                setData_staff(req.data.result);

                let specialResponse = req.data.result.map((item)=>{
                    return {
                        ...item,
                        name: item.fname+" "+item.lname
                    }
                });
                setData_staff_store(specialResponse);
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
            <Search label="Search members" storedData={data_staff_store} setData={setData_staff}/>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                Staff
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{color:"primary.main"}}>Image</TableCell>
                            <TableCell sx={{color:"primary.main"}}>Full Name</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Center</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Gender</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Designation</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Active</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_staff.map((row) => (
                            <Row tabFunction={props.tabFunction} key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Member_Profile