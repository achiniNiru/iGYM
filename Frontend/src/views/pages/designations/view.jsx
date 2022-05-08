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
import { Box, Button, Grid, Modal } from '@mui/material';
import { TextField } from '@mui/material'
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
import { AxiosDelete, AxiosGet } from '../../../config/Axios';
import Designation_Edit from './Edit';

function Modal_Edit(props) {
    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Designation_Edit data={props.data} />
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
            let req = await AxiosDelete("/designation", token, request);
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
                Are you sure you want to delete this designation?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a designation will result in permanent loss of data about the designation and may effect members, this action cannot be undone.
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
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row?.name}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">{row?.salary}</TableCell>
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

function Designation_View(props) {
    const [{ token }, dispatch] = useStateValue();
    const [data_designations, setData_designations] = useState([]);
    const [data_designations_store, setData_designations_store] = useState([]);
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
                let req = await AxiosGet("/designation", token);
                setData_designations(req.data.result);
                setData_designations_store(req.data.result);
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
            <Search label="Search designations" storedData={data_designations_store} setData={setData_designations} />
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                Designations
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color:"primary.main"}}>Designation</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Salary</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_designations.map((row, index) => (
                            <Row tabFunction={props.tabFunction} key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default Designation_View