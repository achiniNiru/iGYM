import React from 'react'

import { actionTypes } from '../store/reducer';
import { useStateValue } from '../store/StateProvider';

import { Alert, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

function SnackBar() {
    const [{ snackbar, msg, severity }, dispatch] = useStateValue();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        dispatch({
          type: actionTypes.SET_SNACKBAR,
          snackbar: false,
          msg: ""
        });
    };

    const snackbarAction = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbar}
          autoHideDuration={5000}
          onClose={handleClose}
          action={snackbarAction}
        >
            <Alert variant="filled" onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {msg}
            </Alert>
        </Snackbar>
    )
}

export default SnackBar