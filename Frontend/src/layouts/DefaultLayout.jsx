import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import SnackBar from './SnackBar';
import { useLocation } from 'react-router-dom';
import { useStateValue } from '../store/StateProvider';
import { actionTypes } from '../store/reducer';
import { AxiosPost } from '../config/Axios';
import Loading from './Loading';
import DrawerExport from '../components/Drawer';
import Appbar from '../components/Appbar';

const drawerWidth = 300;

function DefaultLayout({children}) {
  const [{token}, dispatch] = useStateValue();
  const location = useLocation();
  const [page_title, setPage_title] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = [
    {
      link:"/",
      title:"Dashboard"
    },
    {
      link:"/member",
      title:"Member"
    },
    {
      link:"/staff",
      title:"Staff"
    },
    {
      link:"/packages",
      title:"Packages"
    },
    {
      link:"/schedules",
      title:"Schedules"
    },
    {
      link:"/equipments",
      title:"Equipments"
    },
    {
      link:"/designations",
      title:"Designations"
    },
    {
      link:"/payments",
      title:"Payments"
    }
  ];

  useEffect(()=>{

    let definedLink = NavLinks.find((item) => {
      return item.link === location.pathname
    })

    if(definedLink === undefined || definedLink === null){
      setPage_title("");
    } else {
      setPage_title(definedLink.title);
    }

  },[])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Appbar page_title={page_title} drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <DrawerExport drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
      <Loading />
      <SnackBar />
    </Box>
  );
}

export default DefaultLayout