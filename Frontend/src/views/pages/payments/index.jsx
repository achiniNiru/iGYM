import React, { useEffect, useRef, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';
import { AxiosGet, AxiosPost } from '../../../config/Axios';
import { Autocomplete, Button, Grid, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { PACKAGE_DURATIONS } from '../../../config/data';

import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

function Modal_Report(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
  });
  const { data, member } = props;
  const [data_duration, setData_duration] = useState("")

  function Signature(props) {
    return (
      <Box sx={{ borderTop: '1px dotted black', width: 'fit-content', px: 2, py: 1, mt: 8 }}>
        <Typography variant="subtitle2" component="p">{props.title}</Typography>
      </Box>
    )
  }

  useEffect(()=>{
    let duration = PACKAGE_DURATIONS.find((item)=>{
      return item.id === data.duration
    }).label;
    setData_duration(duration)
  },[props])

  return (
    <Modal
      open={props.open}
      onClose={() => { props.close(false) }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(3px)" }}
    >
      <Box sx={{ maxWidth: "lg", m: { xs: "0 20px", sm: "0 auto" }, background: "white", p: 5, borderRadius: 3 }}>
        <Paper ref={componentRef} variant="outlined" sx={{ p: 5, maxWidth: "md", m: "3rem auto" }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
              Payment Reciept
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="subtitle2" component="p">Date :&nbsp;</Typography>
            <Typography variant="subtitle2" component="p">{new Date().toLocaleDateString()}</Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="subtitle2" component="p">Customer NIC :&nbsp;</Typography>
            <Typography variant="subtitle2" component="p">{member?.nic}</Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="subtitle2" component="p">Customer Name :&nbsp;</Typography>
            <Typography variant="subtitle2" component="p">{member?.name}</Typography>
          </Box>
          <Box sx={{ p: 5, maxWidth: "sm" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Package</Typography>
              </Grid>
              <Grid item xs={6} align="right">
                <Typography variant="subtitle2">{data?.title}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Package Price</Typography>
              </Grid>
              <Grid item xs={6} align="right">
                <Typography variant="subtitle2">LKR {parseFloat(data?.fee).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Valid Duration</Typography>
              </Grid>
              <Grid item xs={6} align="right">
                <Typography variant="subtitle2">{data_duration}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total</Typography>
              </Grid>
              <Grid item xs={6} align="right">
                <Typography variant="subtitle2">LKR {parseFloat(data?.fee).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Signature title="Customer Signature" />
            <Signature title="Employee Signature" />
          </Box>
        </Paper>
        <Box className="donotprint" sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => { props.close(false); }}
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

function Payments() {
  const [{ token }, dispatch] = useStateValue();
  const [data_members, setData_members] = useState([]);
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

  const [input_member, setInput_member] = useState("");
  const [current_member, setCurrent_member] = useState({
    name: "Unavailable",
    dob: "Unavailable",
    gender: "Unavailable",
    email: "Unavailable",
    phone: "Unavailable"
  })
  const [current_packages, setCurrent_packages] = useState([])

  useEffect(() => {

    async function fetchData() {
      try {
        let req = await AxiosGet("/members", token);
        setData_members(req.data.result);

        let req2 = await AxiosGet("/package", token);
        setData_packages(req2.data.result)

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

  const handleSearchMember = (e, value) => {
    setInput_member(value)
    let currentmember = data_members.find((item)=>{
      return item.name === value
    })
    if(currentmember !== undefined && currentmember !== null) {
      setCurrent_member(currentmember);

      let currentmember_packages = Object.entries(currentmember.packages).map(([key, value]) => ({key,value})).filter((item) => { return item.value }).map((item)=>{ return item.key })
      //console.log(currentmember_packages);
      
      let currentpackages =  data_packages.filter((item) => {
        return currentmember_packages.includes(item._id);
      });

      setCurrent_packages(currentpackages);

    } else {
      setCurrent_member({
        name: "Unavailable",
        dob: "Unavailable",
        gender: "Unavailable",
        email: "Unavailable",
        phone: "Unavailable",
      })
    }
    
  }

  function PackagePayment(props) {
    const { data, member } = props;
    const [data_start, setData_start] = useState(new Date());
    const [data_end, setData_end] = useState(new Date());
    const [action_report, setAction_report] = useState(false);

    useEffect(()=>{
      let duration = PACKAGE_DURATIONS.find((item)=>{
        return item.id === data.duration
      }).days
      let expireDate = new Date( Date.now() + duration*24*60*60*1000 );
      setData_end(expireDate);
    },[props])

    const handlePayment = () => {

    }

    return (
      <Box sx={{ m: 2, mt: 5, p: 2, border: "solid thin gray", borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="p" sx={{ fontWeight: "bold" }}>{data.title}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Registered Date</Typography>
            <Typography variant="subtitle2" component="p">{data_start.toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Expire Date</Typography>
            <Typography variant="subtitle2" component="p">{data_end.toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Package price</Typography>
            <Typography variant="subtitle2" component="p">LKR {parseFloat(data?.fee).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Net Amount</Typography>
            <Typography variant="subtitle2" component="p">LKR {parseFloat(data?.fee).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Paid Amount</Typography>
            <Typography variant="subtitle2" component="p">LKR 0</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" component="p">Due Amount</Typography>
            <Typography variant="subtitle2" component="p">LKR {parseFloat(data?.fee).toFixed(2)}</Typography>
          </Grid>
        </Grid>
        <Modal_Report open={action_report} close={setAction_report} data={data} member={member} />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => { setAction_report(true) }}
            sx={{ mr: 1, color: 'text.secondary' }}
          >
            View Reciept
          </Button>
          <Button
            onClick={handlePayment}
          >
            Pay
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Paper elevation={0} sx={{ maxWidth: "md", m: "0.25rem auto" }}>
      <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
        Payment
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            freeSolo
            disableClearable
            sx={{ width: 300 }}
            options={data_members.map((option) => option.name)}
            value={input_member}
            onChange={handleSearchMember}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by Name"
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Stack>
      </Box>
      {input_member !== "" && (
        <React.Fragment>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Typography variant="caption" component="p">Customer Name</Typography>
              <Typography variant="subtitle2" component="p">{current_member?.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" component="p">Gender</Typography>
              <Typography variant="subtitle2" component="p">{current_member?.gender}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" component="p">Date of Birth</Typography>
              <Typography variant="subtitle2" component="p">{current_member?.dob}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" component="p">Email</Typography>
              <Typography variant="subtitle2" component="p">{current_member?.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" component="p">Contact Number</Typography>
              <Typography variant="subtitle2" component="p">{current_member?.phone}</Typography>
            </Grid>
          </Grid>
          {current_packages.map((data, index) => {
            return <PackagePayment data={data} index={index} member={current_member}/>
          })}
        </React.Fragment>
      )}
    </Paper>
  );

}

export default Payments