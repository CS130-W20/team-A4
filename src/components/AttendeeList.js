import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Modal from 'react-awesome-modal';
import CustomizedAvatars from './CustomizedAvatars';

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

export default function AttendeeList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [popupVisible, setPopupVisible] = React.useState(false);

  const openModel = () => {
    setPopupVisible(true);
  }

  const closeModel = () => {
    setPopupVisible(false);
  }
  console.log({props});
  return (
    <div>
    <Modal visible={popupVisible} width="400" height="220" effect="fadeInUp" onClickAway={() => closeModel()}>
      <div>
          <CustomizedAvatars userSetAvatar={props.userSetAvatar} currentAvatar={props.currentAvatar} avatars={props.avatars}/>
          <Button color="primary" onClick={() => closeModel()}>Choose</Button>
      </div>
    </Modal>
    <List>
      {props.attendees.map((name, index) => (
        <ListItem button>
          <ListItemAvatar>
          <IconButton onClick={openModel}>
              <Avatar alt={name} src={props.currentAvatar}/>
          </IconButton>
          </ListItemAvatar>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
    </div>
  );
}