import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';

import Package_View from './view';
import Package_Add from './Add';

function Packages() {
  const [{token}, dispatch] = useStateValue();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    dispatch({
      type: actionTypes.SET_LOADING,
      loading: true
    });
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="View Packages" />
          <Tab label="Add New Package" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 1 ? (
          <Package_Add tabFunction={setValue}/>
        ) : (
          <Package_View tabFunction={setValue}/>
        )}
      </Box>
    </Box>
  )
}

export default Packages