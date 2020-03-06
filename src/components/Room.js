import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuList from './MenuList';
import AttendeeList from './AttendeeList';
import DraggableWhiteboard from './DraggableWhiteboard';
import DraggableVideo from './DraggableVideo';
import DraggableText from './DraggableText';
import DraggableImage from './DraggableImage';
import socket from "./SocketContext";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function CreateRoom(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [components, setComponents] = React.useState([]);
  const [users, setUsers] = React.useState(props.location.state.data.user_name);
  const { name, roomID, roomName } = props.match.params;
  const avatars = [
    "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg",
    "https://pbs.twimg.com/profile_images/551035896602980352/sght8a8B.png",
    "https://lh3.googleusercontent.com/proxy/Zvz7clvSFkNGkW7STBzWq2xgMAdGNnPe4wiqOzIUnxAGLiYCEggx8pGk8tqfP72WN6ahwPWx7RpomQS-6AlbElUvpeCRxJLZp4PjDtljDvV8ttP0RX8SA1_rFQe6xVdwsG1s4ZOdCg7AUfTMXCLXFWj7",
    "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/05/1486126267-mickey-mouse.jpg",
    "https://listrick.com/wp-content/uploads/2019/11/Famous-Cartoon-Characters-with-Big-Noses-2.jpg",
    "https://pmcvariety.files.wordpress.com/2016/05/pooh.jpg?w=700",
    "https://i.pinimg.com/originals/76/65/78/76657870f44b49e13d59cc2fdd52083f.png",
    "https://i.etsystatic.com/6585391/r/il/e55d2a/593973841/il_570xN.593973841_qrbm.jpg"
  ]
  const [currentAvatar, setCurrentAvatar] = React.useState(avatars[0]);

  React.useEffect(() => {
    socket.on("join_result", (joinResultData) => {
      if (joinResultData === "invalid input") {
        console.log("INVALID joinResultData");
      } else {
        setUsers(joinResultData.user_name);
      }
    });

    socket.on("remove_user", (removeUserData) => {
      if (typeof(removeUserData) == "object") {
        setUsers(removeUserData);
      } else {
        console.log("INVALID removeUserData");
      }
    });

    socket.emit("get_info", {
      "room_id": roomID
    });

    socket.on("room_info", (roomInfoData) => {
      setUsers(roomInfoData.user_name);
    });
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAddComponent = (type) => {
    // Inform server about adding component of type {type}
    console.log("emit create_component of type: ", type, " and room id is: ", roomID);
    socket.emit("create_component", {
        "room_id": roomID,
        "component_type": type
      }
    );

    // Retrive from server the component_id as {data}
    socket.on("create_component", (data) => {
      let newComponents = [...components];
      let component_id = data.component_id;
      console.log("on created_component of type: ", type, " and component_id is: ", component_id);
      let key = [type, component_id].join(',');
      newComponents.push(key);
      setComponents(newComponents);
    });
  }

  const handleDeleteComponent = (key) => {
    let newComponents = [...components];
    let index = newComponents.indexOf(key);
    let parseObjects = key.split(",");
    let type = parseObjects[0];
    let component_id = parseObjects[1];
    newComponents.splice(index, 1);
    setComponents(newComponents);
    console.log("emit delete_component of component_id: ", component_id, ", type is: ", type, " and room id is: ", roomID);
    socket.emit("delete_component", {
        "room_id": roomID,
        "component_id": component_id,
        "component_type": type
      }
    );
  }

  const userSetAvatar = (e) => {
    setCurrentAvatar(e);
    console.log("user avatar: ", currentAvatar);
  }
  
  // Update components
  useEffect(() => {
    socket.on("create_component", (data) => {
      console.log(data);
      let newComponents = [...components];
      let component_id = data.component_id;
      let component_type = data.component_type;
      let component_data = data.component_data;
      console.log("on created_component of type: ", component_type, " and component_id is: ", component_id);
      let key = [component_type, component_id].join(',');
      newComponents.push(key);
      setComponents(newComponents);
    });
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Room {roomName}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <MenuList handleAddComponent={handleAddComponent} roomID={roomID}/>
        <Divider />
        <AttendeeList attendees={users} userSetAvatar={userSetAvatar} currentAvatar={currentAvatar} avatars={avatars}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid>
            {components.map((key) => {
              switch (key.split(',')[0]) {
                case 'video':
                  return (<DraggableVideo key={key} k={key} handleDeleteComponent={handleDeleteComponent} />);
                case 'text':
                  return (<DraggableText key={key} k={key} handleDeleteComponent={handleDeleteComponent} />);
                case 'whiteboard':
                  return (<DraggableWhiteboard key={key} k={key} handleDeleteComponent={handleDeleteComponent} />);
                case 'image':
                  return (<DraggableImage key={key} k={key} handleDeleteComponent={handleDeleteComponent} />);
              }
            })}
          </Grid>
        </Container>
      </main>
    </div>
  );
}
