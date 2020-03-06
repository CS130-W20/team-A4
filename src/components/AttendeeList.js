import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
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

  return (
    <div>
      {popupVisible &&
        <Modal visible={popupVisible} width="400" height="220" effect="fadeInUp" onClickAway={() => closeModel()}>
          <CustomizedAvatars 
            userSetAvatar={props.userSetAvatar} 
            currentAvatar={props.currentAvatar} 
            avatars={props.avatars} 
            closeModel={closeModel} 
          />
        </Modal>
      }
      <List>
        {props.attendees.map((name, index) => (
          <ListItem key={index} button>
            <ListItemAvatar>
              <Avatar onClick={openModel} alt={name} src={props.currentAvatar}/>
            </ListItemAvatar>
          </ListItem>
        ))}
      </List>
    </div>
  );
}