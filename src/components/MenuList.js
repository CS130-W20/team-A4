import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import MovieIcon from '@material-ui/icons/Movie';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import BrushIcon from '@material-ui/icons/Brush';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Modal from 'react-awesome-modal';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MenuList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const openModel = () => {
    setPopupVisible(true);
  };

  const closeModel = () => {
    setPopupVisible(false);
    setCopied(false)
  }

  const handleCopyClick = (e) => {
    setCopied(e);
  }

  return (
    <div>
      <Modal visible={popupVisible} width="400" height="300" effect="fadeInUp" onClickAway={() => closeModel()}>
          <div>
              <h1>Room ID</h1>
              <p>{props.roomID}</p>
              <CopyToClipboard text={props.roomID}
                onCopy={() => handleCopyClick(true)}>
                <button>Copy to clipboard</button>
              </CopyToClipboard>
              {copied ? <span style={{color: 'red'}}>Copied.</span> : null}
              <button onClick={() => closeModel()}>Close</button>
          </div>
      </Modal>
      <List>
      <ListItem button component={Link} to={'/'}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={() => openModel()}>
        <ListItemIcon>
          <VpnKeyIcon />
        </ListItemIcon>
        <ListItemText primary="Room ID" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested} onClick={() => props.handleAddComponent("video")}>
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="Video" />
          </ListItem>
          <ListItem button className={classes.nested} onClick={() => props.handleAddComponent("text")}>
            <ListItemIcon>
              <TextFieldsIcon />
            </ListItemIcon>
            <ListItemText primary="Text" />
          </ListItem>
          <ListItem button className={classes.nested} onClick={() => props.handleAddComponent("whiteboard")}>
            <ListItemIcon>
              <BrushIcon />
            </ListItemIcon>
            <ListItemText primary="Whiteboard" />
          </ListItem>
          <ListItem button className={classes.nested} onClick={() => props.handleAddComponent("image")}>
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary="Image" />
          </ListItem>
        </List>
      </Collapse>
    </List>

    </div>
  );
}
