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
  // const [users, setUsers] = React.useState([]);
  const { name, roomID, roomName } = props.match.params;
  // let contentTable = {}; // <id, content>
  const [contentTable, setContentTable] = React.useState({});
  const [locationTable, setLocationTable] = React.useState({});
  const avatars = [
    "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg",
    "https://pbs.twimg.com/profile_images/551035896602980352/sght8a8B.png",
    "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/05/1486126267-mickey-mouse.jpg",
    "https://listrick.com/wp-content/uploads/2019/11/Famous-Cartoon-Characters-with-Big-Noses-2.jpg",
    "https://pmcvariety.files.wordpress.com/2016/05/pooh.jpg?w=700",
    "https://i.pinimg.com/originals/76/65/78/76657870f44b49e13d59cc2fdd52083f.png",
    "https://i.etsystatic.com/6585391/r/il/e55d2a/593973841/il_570xN.593973841_qrbm.jpg"
  ]
  const [currentAvatar, setCurrentAvatar] = React.useState(avatars[0]);
  const [userAvatars, setUserAvatars] = React.useState(props.location.state.data.user_avatar);

  React.useEffect(() => {
    socket.emit("join", { // TODO: avatar传过去
      "user_name": name,
      "room_id": roomID
    });

    socket.on("join_result", (joinResultData) => {
      if (joinResultData === "invalid input") {
        console.log("INVALID joinResultData");
      } else {
        setUsers(joinResultData.user_name);
        setUserAvatars(joinResultData.user_avatar);
        // TODO: setComponents, location, content
      }
    });

    socket.on("remove_user", (removeUserData) => {
      if (typeof(removeUserData) == "object") {
        setUsers(removeUserData.user_name);
      } else {
        console.log("INVALID removeUserData");
      }
    });

    socket.on("room_info", (roomInfoData) => {
      setUsers(roomInfoData.user_name);
      setUserAvatars(roomInfoData.user_avatar);
    });
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleAddComponent = (type) => {
    socket.emit("create_component", {
      "room_id": roomID,
      "component_type": type
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

    // TODO: delete item from contentTable and locationTable (although it has no effect in demo)

    socket.emit("delete_component", {
      "room_id": roomID,
      "component_id": component_id,
      "component_type": type
    });
  }

  const handleValueChange = (key, value) => {
    let component_id = key.split(',')[1];
    let component_type = key.split(',')[0];
    let newContentTable = {...contentTable};
    newContentTable[component_id] = value;
    setContentTable(newContentTable);
    socket.emit("update_component",
       {
          "room_id": roomID,
          "component_id": component_id,
          "component_type": component_type,
          "update_type": "update_finished",
          "update_info": {
             "location": locationTable[component_id],
             "data": value
          }
       }
    );
  }

  const handleLocationChange = (key, x, y, width, height) => {
    console.log("receive handle location change")
    let component_id = key.split(',')[1];
    let component_type = key.split(',')[0];
    let location = [x, y, width, height].join(',');
    let newLocationTable = {...locationTable};
    newLocationTable[component_id] = location;
    setLocationTable(newLocationTable);
    socket.emit("update_component",
       {
          "room_id": roomID,
          "component_id": component_id,
          "component_type": component_type,
          "update_type": "update_finished",
          "update_info": {
             "location": location,
             "data": contentTable[component_id]
          }
       }
    );
  }


  // Listen to any updates on create components
  const userSetAvatar = (e) => {
    setCurrentAvatar(e);
    socket.emit("change_avatar", {
      "room_id": roomID,
      "user_name": name,
      "user_avatar": e
    })
  }

  useEffect(() => {
    socket.on("create_component", (data) => {
      let newComponents = [...components];
      let component_id = data.component_id;
      let component_type = data.component_type;
      let component_data = data.component_data;
      let key = [component_type, component_id].join(',');
      newComponents.push(key);

      // Set default value
      let newLocationTable = {...locationTable};
      newLocationTable[component_id] = "0,0,500,500";
      setLocationTable(newLocationTable);

      let newContentTable = {...contentTable};
      newContentTable[component_id] = component_data;
      setContentTable(newContentTable);

      setComponents(newComponents);
    });

    socket.on("delete_component", (data) => {
      let newComponents = [...components];
      let component_type = data.component_type;
      let component_id = data.component_id;
      let key = [component_type, component_id].join(',');
      let index = newComponents.indexOf(key);
      newComponents.splice(index, 1);
      setComponents(newComponents);
    });

    socket.on("update_component", (data) => {
      console.log("update_component: ", data);

      let component_type = data.component_type;
      let component_id = data.component_id;
      let update_info = data.update_info;

      let newContentTable = {...contentTable};
      newContentTable[component_id] = update_info.data;

      let newLocationTable = {...locationTable};
      newLocationTable[component_id] = update_info.location;

      setContentTable(newContentTable);
      setLocationTable(newLocationTable);

      console.log("print locationtable: ", newLocationTable);
    });
  }, [components, contentTable, locationTable]);

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
        <AttendeeList
          attendees={users}
          userSetAvatar={userSetAvatar}
          userAvatars={userAvatars}
          avatars={avatars}
          currentUser={name}/>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid>
            {components.map((key) => {
              let componentType = key.split(',')[0];
              let componentId = key.split(',')[1];
              switch (componentType) {
                case 'video':
                  return (
                    <DraggableVideo
                      key={key}
                      k={key}
                      roomID={roomID}
                      componentId={componentId}
                      value={contentTable[componentId]}
                      location={locationTable[componentId]}
                      handleDeleteComponent={handleDeleteComponent}
                      handleValueChange={handleValueChange}
                      handleLocationChange={handleLocationChange}
                    />);
                case 'text':
                  return (
                    <DraggableText
                      key={key}
                      k={key}
                      roomID={roomID}
                      componentId={componentId}
                      value={contentTable[componentId]}
                      location={locationTable[componentId]}
                      handleDeleteComponent={handleDeleteComponent}
                      handleValueChange={handleValueChange}
                      handleLocationChange={handleLocationChange}
                    />
                  );
                case 'whiteboard':
                  return (
                    <DraggableWhiteboard
                      key={key}
                      k={key}
                      roomID={roomID}
                      componentId={componentId}
                      value={contentTable[componentId]}
                      location={locationTable[componentId]}
                      handleDeleteComponent={handleDeleteComponent}
                      handleValueChange={handleValueChange}
                      handleLocationChange={handleLocationChange}
                    />
                  );
                case 'image':
                  return (
                    <DraggableImage
                      key={key}
                      k={key}
                      roomID={roomID}
                      componentId={componentId}
                      value={contentTable[componentId]}
                      location={locationTable[componentId]}
                      handleDeleteComponent={handleDeleteComponent}
                      handleValueChange={handleValueChange}
                      handleLocationChange={handleLocationChange}
                    />
                  );
              }
            })}
          </Grid>
        </Container>
      </main>
    </div>
  );
}
