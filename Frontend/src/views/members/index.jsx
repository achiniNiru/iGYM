import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useStateValue } from '../../../store/StateProvider';
import { actionTypes } from '../../../store/reducer';

import Member_View from './view';
import Member_Add from './Add';

function Members() {
  const [, dispatch] = useStateValue();
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
          <Tab label="View Members" />
          <Tab label="Add Member" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 1 ? (
          <Member_Add tabFunction={setValue} />
        ) : (
          <Member_View tabFunction={setValue} />
        )}
      </Box>
    </Box>
  )
}

export default Members