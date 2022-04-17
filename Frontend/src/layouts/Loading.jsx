import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useStateValue } from '../store/StateProvider';
import { actionTypes } from '../store/reducer';

function Loading() {
    const [{ loading }, dispatch] = useStateValue();

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: '3000' }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loading