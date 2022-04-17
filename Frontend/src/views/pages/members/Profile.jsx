import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { BACKEND_URL } from '../../../config/data'
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';

function Member_Profile(props) {
    const { data } = props
    const [{ token }, dispatch] = useStateValue();
    function setLoading(state) {
        dispatch({
            type: actionTypes.SET_LOADING,
            loading: state
        });
    }

    useEffect(() => {
        setLoading(false);
    }, [])

    return (
        <Paper elevation={0} sx={{ width: '100%', maxWidth: "md", background: "white", p: 5, borderRadius: 3, m: { xs: "3rem 20px", md: "3rem auto" }, height: "70vh" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }} component="h6">{data?.name}</Typography>
                <Button onClick={() => { setLoading(true); props.switchView(true) }}>View Goals</Button>
            </Box>
            <Box sx={{mt:2}}>
                <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }} component="h4">
                    Memeber Profile
                </Typography>
                <Grid container spacing={{ xs: 0, md: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Avatar
                                alt={data?.name}
                                src={`${BACKEND_URL}static/members/${data?.dp}`}
                                sx={{ width: 135, height: 135, m: "2rem auto" }}
                            />
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Name</Typography>
                            <Typography variant="body1" component="h6">{data?.name}</Typography>
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Birth Day</Typography>
                            <Typography variant="body1" component="h6">{data?.dob}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Mobile Number</Typography>
                            <Typography variant="body1" component="h6">{data?.phone}</Typography>
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Email</Typography>
                            <Typography variant="body1" component="h6">{data?.email}</Typography>
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">NIC</Typography>
                            <Typography variant="body1" component="h6">{data?.nic}</Typography>
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Gender</Typography>
                            <Typography variant="body1" component="h6">{data?.gender}</Typography>
                        </Box>
                        <Box sx={{ my: 1.5 }}>
                            <Typography variant="caption" component="span">Address</Typography>
                            <Typography variant="body1" component="h6">{data?.address}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt:3 }}>
                <Button sx={{ color: 'primary.secondary' }} onClick={()=>{props.edit();}}>Edit</Button>
                <Button sx={{ color: 'error.main' }} onClick={()=>{props.delete();}}>Delete</Button>
            </Box>
        </Paper>
    )
}

export default Member_Profile
