import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from "react-router-dom";
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';

import LogoutIcon from '@mui/icons-material/Logout';
import RouteList from '../routes';
import { useStateValue } from '../store/StateProvider';
import { actionTypes } from '../store/reducer';
import { AxiosPost } from '../config/Axios';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { BACKEND_URL } from '../config/data';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConstructionIcon from '@mui/icons-material/Construction';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import PaymentsIcon from '@mui/icons-material/Payments';

function DrawerExport({ children, drawerWidth, handleDrawerToggle, mobileOpen }) {
    const isDesktop = useMediaQuery('(min-width:1200px)');

    return (
        <Box
            component="nav"
            sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        >
            {isDesktop ? (
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: "primary.dark" },
                    }}
                    open
                >
                    <DrawerContent />
                </Drawer>
            ) : (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: "primary.dark2" },
                    }}
                >
                    <DrawerContent />
                </Drawer>
            )}
        </Box>
    )
}

const NavLinks = [
    {
      link:"/",
      icon:<HomeIcon/>,
      title:"Dashboard"
    },
    {
      link:"/member",
      icon:<PersonIcon/>,
      title:"Member"
    },
    {
      link:"/staff",
      icon:<SupervisedUserCircleIcon/>,
      title:"Staff"
    },
    {
      link:"/packages",
      icon:<Inventory2Icon/>,
      title:"Packages"
    },
    {
      link:"/schedules",
      icon:<ScheduleIcon/>,
      title:"Schedules"
    },
    {
      link:"/equipments",
      icon:<ConstructionIcon/>,
      title:"Equipments"
    },
    {
      link:"/designations",
      icon:<LocalPoliceIcon/>,
      title:"Designations"
    },
    {
      link:"/payments",
      icon:<PaymentsIcon/>,
      title:"Payments"
    }
  ];

function DrawerContent() {
    const [, dispatch] = useStateValue();
    const location = useLocation();

    function DrawerItem(props) {
        return (
            <ListItem disablePadding>
                <ListItemButton sx={{ py:1.5 }} className={`${location.pathname === props.href ? 'active-link' : ''}`} component={Link} to={props.href}>
                    <ListItemIcon sx={{ color: "#ffffff"}}>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText sx={{ color:"#ffffff"}} primary={props.title} />
                </ListItemButton>
            </ListItem>
        )
    }

    return (
        <React.Fragment>
            <Box sx={{ p: 1.5, maxHeight: 62.5, bgcolor: "primary", minHeight: { xs: '55px', sm: '63px' } }} component={Link} to="/">
                <img className="filter-white" style={{ width: "100%", height: "100%", objectFit: 'contain' }} src={`${BACKEND_URL}static/system/logo.svg`} alt="iGYM" />
            </Box>
            <Divider />
            <List>
                {NavLinks.map((link)=>{
                    return <DrawerItem key={link.link} href={link.link} title={link.title} icon={link.icon} />
                })}
            </List>
        </React.Fragment>
    )
}

export default DrawerExport