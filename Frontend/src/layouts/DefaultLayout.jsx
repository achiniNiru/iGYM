import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SnackBar from './SnackBar';
import { useLocation } from 'react-router-dom';
import { ConstructionOutlined } from '@mui/icons-material';
import { useStateValue } from '../store/StateProvider';
import { actionTypes } from '../store/reducer';
import { AxiosPost } from '../config/Axios';
import Loading from './Loading';

const drawerWidth = 240;

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

  function DrawerItem(props) {
    return (
      <ListItem button component="a" href={props.href}>
        <ListItemText sx={{textAlign: 'center'}} primary={props.title} />
      </ListItem>
    )
  }

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {NavLinks.map((link)=>{
          return <DrawerItem key={link.link} href={link.link} title={link.title} />
        })}
        <ListItem button component="button" onClick={handleLogOut}>
          <ListItemText sx={{textAlign: 'center'}} primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            IGYM Project {page_title ? (`- ${page_title}`) : ""}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
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