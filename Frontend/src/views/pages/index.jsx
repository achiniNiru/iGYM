import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useStateValue } from '../../store/StateProvider';
import { actionTypes } from '../../store/reducer';
import { AxiosGet, AxiosPost } from '../../config/Axios';
import DigitalClock from 'react-live-clock';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { BACKEND_URL } from '../../config/data';

import LockIcon from '@mui/icons-material/Lock';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    label: 'Image title',
    image: 'slider-image-1.jpg',
  },
  {
    label: 'Image title',
    image: 'slider-image-2.jpg',
  },
  {
    label: 'Image title',
    image: 'slider-image-3.jpg',
  },
  {
    label: 'Image title',
    image: 'slider-image-4.jpg',
  },
];

function Dashboard() {
  const [{ token }, dispatch] = useStateValue();
  const [data_counts, setData_counts] = useState([]);
  const [data_loaded, setData_loaded] = useState(false)
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

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
        let req = await AxiosGet("/dashboard/count", token);
        console.log(req.data.result)
        setData_counts(req.data.result);
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


  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function DashboardCard(props) {
    return (
      <Card sx={{ cursor: "pointer", px: { xs: 2, lg: 3 }, pt: { xs: 2, sm: 3, lg: 4 }, pb: { xs: 0.5, sm: 1.5, lg: 2.5 }, bgcolor: "primary.dark", color: "#ffffff", '&:hover': { bgcolor: "primary.dark2", transition: '1s' } }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }}>
            {props.title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
            {props.count}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleLogOut = async () => {
    AxiosPost("/logout",token).then((response) => {
      dispatch({
        type: actionTypes.SET_SNACKBAR,
        snackbar: true,
        severity: "success",
        msg: 'Logged out successfully'
      });
    })
    localStorage.removeItem('gym_user');
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
      token: null,
      role: null,
      expire: null,
      name : ""
    });
  }

  return (
    <Box sx={{ mb:{xs:5, sm:0} }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display:{ md:"none"}, textAlign:"right" }}>
          <Button onClick={handleLogOut} variant="contained" sx={{py:2, px:4, maxHeight: 50}}>
            <LockIcon />&nbsp;
            <Typography variant="Button">Lock System</Typography>
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={8} container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard title="Member Count" count={data_counts?.member} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard title="Coach Count" count={data_counts?.staff} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard title="Schedules" count={data_counts?.schedule} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <DashboardCard title="Equipment Count" count={data_counts?.equipment} />
          </Grid>
          <Grid item xs={12}>
            <AutoPlaySwipeableViews
              axis="x"
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {images.map((step, index) => (
                <div key={step.label}>
                  {Math.abs(activeStep - index) <= 2 ? (
                    <Box
                      sx={{
                        overflow: 'hidden',
                        maxHeight: "60vh",
                        objectFit:"cover"
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit:"cover"
                        }}
                        src={`${BACKEND_URL}static/slider/${step.image}`}
                        alt={step.label}
                      />
                    </Box>
                  ) : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={4} container spacing={2}>
          <Grid item xs={12} sx={{ display:{ xs:"none", md:"block"}, textAlign:"center" }}>
            <Box>
              <Button onClick={handleLogOut} variant="contained" sx={{py:2, px:4, maxHeight: 50}}>
                <LockIcon />&nbsp;
                <Typography variant="Button">Lock System</Typography>
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={12} container spacing={2} sx={{justifyContent: 'center'}}>
            <Grid item xs={12}>
              <Typography variant="h3" textAlign="center" sx={{m:0}}>
                <DigitalClock format={'HH:mm:ss'} interval={1000} ticking={true} />
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <Clock value={time} />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Calendar onChange={setDate} value={date} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard