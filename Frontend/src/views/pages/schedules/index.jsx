import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';

import View_Calander from './View_Calander';
import View_Table from './View_Table';

function Schedule() {
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
          <Tab label="Calendar View" />
          <Tab label="Table View" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 1 ? (
          <View_Table tabFunction={setValue}/>
        ) : (
          <View_Calander tabFunction={setValue}/>
        )}
      </Box>
    </Box>
  )
}

export default Schedule