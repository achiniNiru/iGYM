import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SummarizeIcon from '@mui/icons-material/Summarize';

import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import Search from '../../../components/Search';
import { AxiosDelete, AxiosGet, AxiosPatch } from '../../../config/Axios';
import { validator_isEmpty } from '../../../utils/validator';

import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

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

    const [data_start, setData_start] = useState(new Date(data.start));
    const [data_end, setData_end] = useState(new Date());
    const [input_title, setInput_title] = useState(data.title);
    const [input_capacity, setInput_capacity] = useState(data.capacity);

    useEffect(() => {
        if(data.allDay){
            let data_end_time = new Date(data.start).getTime() + 86400000;
            setData_end(data_end_time);
        } else {
            let data_end_time = new Date(data.start).getTime() + 3600000;
            setData_end(new Date(data_end_time));
        }
    },[])
  

    const handleSubmit = async () => {
      try {
        if (validator_isEmpty(input_title)) {
          ShowSnakBar("warning", "Please enter a valid title for the event.");
        } else if (!Number.isInteger(parseInt(input_capacity))) {
          ShowSnakBar("warning", "Please enter a valid capacity for the event.");
        } else {
  
          setLoading(true);
  
          let request = {
            id: data.id,
            allDay: data.allDay,
            start: data_start,
            end: data_end,
            title: input_title,
            capacity: input_capacity
          }
  
          let req = await AxiosPatch("/schedule", token, request);
          ShowSnakBar("success", "Event details updated successfully");
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
        <Box sx={{ maxWidth: "lg", m: "0 auto", mx: { xs: 3, sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
            Edit Schedule
          </Typography>
          <Grid container spacing={{ xs: 0, md: 2 }} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" component="span">Start</Typography>
                <Typography variant="body1" component="h6">3/3/2022, 11:27:30 PM</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" component="span">End</Typography>
                <Typography variant="body1" component="h6">3/4/2022, 11:27:30 PM</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 0, md: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ my: 1 }}>
                <TextField value={input_title} onChange={(e) => { setInput_title(e.target.value) }} fullWidth label="Event Title" aria-label="Event Name" variant="outlined" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ my: 1 }}>
                <TextField value={input_capacity} onChange={(e) => { setInput_capacity(e.target.value) }} fullWidth label="Assessment Capacity" aria-label="Assessment Capacity" variant="outlined" />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button sx={{ color: 'text.secondary' }} onClick={() => { props.close(false) }}>Close</Button>
            <Button sx={{ color: 'primary.main' }} onClick={handleSubmit}>Save</Button>
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
            id: data.id
        }
        let req = await AxiosDelete("/schedule", token, request);
        ShowSnakBar("success", "Event deleted successfully");
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
                Are you sure you want to delete this schedule?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Deleting a schedule will result in permanent loss of data about the schedule and may effect members, this action cannot be undone.
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

    const [data_start, setData_start] = useState(new Date(data.start));
    const [data_end, setData_end] = useState(new Date());

    useEffect(() => {
        if(data.allDay){
            let data_end_time = new Date(data.start).getTime() + 86400000;
            setData_end(data_end_time);
        } else {
            let data_end_time = new Date(data.start).getTime() + 3600000;
            setData_end(new Date(data_end_time));
        }
    },[])

    return (
        <Modal
            open={props.open}
            onClose={() => { props.close(false) }}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
        >
            <Box ref={componentRef} sx={{ width: "100%", maxWidth: "sm", m: {xs:"0 20px", sm:"0 auto"}, background: "white", p: 5, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="h6" sx={{textAlign: "center", mb:2, fontWeight: "bold"}}>Schedule Report</Typography>
                    <Box className="donotprint">
                        <IconButton onClick={handlePrint}>
                            <PrintIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Grid container spacing={{xs:0, md:2}} sx={{mb:2}}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mt:1.5 }}>
                            <Typography variant="caption" component="span">Start</Typography>
                            <Typography variant="body1" component="h6">{data_start.toLocaleString()}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mt:1.5 }}>
                            <Typography variant="caption" component="span">End</Typography>
                            <Typography variant="body1" component="h6">
                                {data.allDay ? "All Day" : data_end.toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={{xs:0, md:2}}>
                    <Grid item xs={12} md={6} sx={{my:1}}>
                        <Typography variant="caption" component="span">Title</Typography>
                        <Typography variant="body1" component="h6">{data.title}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{my:1}}>
                        <Typography variant="caption" component="span">Assessment Capacity</Typography>
                        <Typography variant="body1" component="h6">{data.capacity}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{my:1}}>
                        <Typography variant="caption" component="span">Date</Typography>
                        <Typography variant="body1" component="h6">{new Date(data.timestamp).toLocaleDateString()}</Typography>
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
    const [action_report, setAction_report] = useState(false);
    const [action_edit, setAction_edit] = useState(false);
    const [action_delete, setAction_delete] = useState(false);

    const [data_start, setData_start] = useState(new Date(row.start));
    const [data_end, setData_end] = useState(new Date());

    useEffect(() => {
        if(row.allDay){
            let data_end_time = new Date(row.start).getTime() + 86400000;
            setData_end(data_end_time);
        } else {
            let data_end_time = new Date(row.start).getTime() + 3600000;
            setData_end(new Date(data_end_time));
        }
    },[])

    return (
        <React.Fragment>
            <TableRow sx={{ borderBottom: "unset" }}>
                <TableCell sx={{ borderBottom: "unset" }} component="th" scope="row">{row.title}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }}>{row.capacity}</TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">
                    {row.allDay ? (
                        <Box>{data_start.toLocaleDateString()}</Box>
                    ) : (
                        <React.Fragment>
                            <Box>{data_start.toLocaleDateString()}</Box>
                            <Box>{data_start.toLocaleTimeString()}</Box>
                        </React.Fragment>
                    )}
                </TableCell>
                <TableCell sx={{ borderBottom: "unset" }} align="right">
                    {row.allDay ? (
                        <Box sx={{ color: 'primary.main' }}>All Day</Box>
                    ) : (
                        <React.Fragment>
                            <Box>{data_end.toLocaleDateString()}</Box>
                            <Box>{data_end.toLocaleTimeString()}</Box>
                        </React.Fragment>
                    )}
                </TableCell>
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
                
                {action_report && (
                    <Modal_Report open={action_report} close={setAction_report} data={row} />
                )}
                {action_edit && (
                    <Modal_Edit tabFunction={props.tabFunction} open={action_edit} close={setAction_edit} data={row} />
                )}
                {action_delete && (
                    <Modal_Delete open={action_delete} close={setAction_delete} data={row} />
                )}

            </TableRow>
        </React.Fragment>
    );
}

function View_Table(props) {
    const [{ token }, dispatch] = useStateValue();
    const [data_loaded, setData_loaded] = useState(false)
    const [data_events, setData_events] = useState([]);
    const [data_events_store, setData_events_store] = useState([]);
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
            let req = await AxiosGet("/schedule", token);
            let result = req.data.result.map((item) => {
              let response = {
                id: item._id,
                title: item.title,
                start: item.start,
                capacity: item.capacity,
                allDay: item.allDay,
                timestamp: item.timestamp
              }
              if(!item.allDay){
                response = {
                  ...response,
                  end: item.end,
                }
              }
              return response;
            })
            setData_events(result);
            setData_events_store(result);
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
            <Search label="Search members" storedData={data_events_store} setData={setData_events} searchname="title" />
            <Typography variant="h6" sx={{ textAlign: "center", my: 4 }} component="h4">
                Schedules - Table View
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{color:"primary.main"}}>Name</TableCell>
                            <TableCell sx={{color:"primary.main"}}>Capacity</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Start</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">End</TableCell>
                            <TableCell sx={{color:"primary.main"}} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data_events.map((row, index) => (
                            <Row tabFunction={props.tabFunction} key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export default View_Table