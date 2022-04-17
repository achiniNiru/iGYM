import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useStateValue } from '../../store/StateProvider';
import { actionTypes } from '../../store/reducer';
import { AxiosGet } from '../../config/Axios';


function Dashboard() {
  const [{ token }, dispatch] = useStateValue();
  const [data_counts, setData_counts] = useState([]);
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

  const DashboardCard = (props) => {
    return (
      <Card sx={{ cursor:"pointer", px:{xs:2, lg:3}, pt:{xs:2, sm:3, lg:4}, pb:{xs:0.5, sm:1.5, lg:2.5}, '&:hover': { bgcolor: '#e3f2fd', transition: '1s' }}}>
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

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Member Count" count={data_counts?.member} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Coach Count" count={data_counts?.staff} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Schedules" count={data_counts?.schedule} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Equipment Count" count={data_counts?.equipment} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard