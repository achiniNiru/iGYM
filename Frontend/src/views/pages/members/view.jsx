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
import Goals from './Goals';
import Profile from './Profile';
import Search from '../../../components/Search';
import { BACKEND_URL, DATA_GENDERS } from '../../../config/data';
import validator from 'validator';
import { validator_isEmpty } from '../../../utils/validator';
import { AxiosDelete, AxiosGet, AxiosPost } from '../../../config/Axios';
import Members_Edit from './Edit';

function Modal_Edit(props) {
    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Members_Edit data={props.data} packages={props.packages} />
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
            let req = await AxiosDelete("/members", token, request);
            ShowSnakBar("success", "User deleted successfully");
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
                Are you sure you want to delete this member?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a member will result in permanent loss of data about the member, this action cannot be undone.
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

function Modal_Profile(props) {
    const [viewGoals, setViewGoals] = useState(false);

    const handleDelete = () => {
        props.close(false);
        props.delete(true);
    }
    const handleEdit = () => {
        props.close(false);
        props.edit(true)
    }

    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false); }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            {viewGoals ? (
                <Goals
                    switchView={setViewGoals}
                    edit={handleEdit}
                    delete={handleDelete}
                    member={props?.data}
                />
            ) : (
                <Profile
                    switchView={setViewGoals}
                    edit={handleEdit}
                    delete={handleDelete}
                    data={props?.data}
                />
            )}
        </Modal>
    )
}

function Row(props) {
    const { row, packages } = props;
    const [open, setOpen] = useState(false);
    const [action_edit, setAction_edit] = useState(false);
    const [action_delete, setAction_delete] = useState(false);
    const [action_Profile, setAction_Profile] = useState(false);

    return (
        <TableRow sx={{ borderBottom: "unset" }}>
            <TableCell sx={{ borderBottom: "unset" }} component="th">
                <Avatar
                    alt={row?.name}
                    src={`${BACKEND_URL}static/members/${row?.dp}`}
                    onClick={() => { setAction_Profile(true); }}
                    sx={{ cursor: "pointer" }}
                />
            </TableCell>
            <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row?.name}</TableCell>
            <TableCell sx={{ borderBottom: "unset" }} align="right">{row?._id}</TableCell>
            <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.nic}</TableCell>
            <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.email}</TableCell>
            <TableCell sx={{ borderBottom: "unset" }} align="right">
                <Box style={{ display: "flex" }}>
                    <IconButton onClick={() => { setAction_edit(true) }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { setAction_delete(true) }}>
                        <DeleteIcon sx={[{ '&:hover': { color: '#f44336', transition: '1s' } }]} />
                    </IconButton>
                </Box>
            </TableCell>

            <Modal_Edit tabFunction={props.tabFunction} open={action_edit} close={setAction_edit} data={row} packages={packages} />
            <Modal_Delete open={action_delete} close={setAction_delete} data={row} />
            <Modal_Profile open={action_Profile} close={setAction_Profile} edit={setAction_edit} delete={setAction_delete} data={row} />

        </TableRow>
    );
}

function Member_View(props) {
    const [{ token }, dispatch] = useStateValue();
    const [data_members, setData_members] = useState([]);
    const [data_members_store, setData_members_store] = useState([]);
    const [data_packages, setData_packages] = useState([]);
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
                let req = await AxiosGet("/members", token);
                setData_members(req.data.result);
                setData_members_store(req.data.result);

                let req2 = await AxiosGet("/package", token);
                setData_packages(req2.data.result);

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
            <Search label="Search members" storedData={data_members_store} setData={setData_members} />
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                Members
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Admission Number</TableCell>
                            <TableCell align="right">ID Number</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_members.map((row, index) => (
                            <Row tabFunction={props.tabFunction} key={index} row={row} packages={data_packages} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Member_View