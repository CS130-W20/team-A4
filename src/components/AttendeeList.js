import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from 'react-awesome-modal';
import CustomizedAvatars from './CustomizedAvatars';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    // maxWidth: 360,
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
  const [userClickedPopup, setUserClickedPopup] = React.useState(0);
  const openModel = (e) => {
    setPopupVisible(true);
    setUserClickedPopup(e);
  }

  const closeModel = () => {
    setPopupVisible(false);
  }

  return (
    <div>
      {popupVisible &&
        <Modal visible={popupVisible} width="400" height="220" effect="fadeInUp" onClickAway={() => closeModel()}>
          {props.currentUser === userClickedPopup ? 
            <CustomizedAvatars 
              userSetAvatar={props.userSetAvatar} 
              currentUser={props.currentUser}
              avatars={props.avatars} 
              closeModel={closeModel} 
              attendees={props.attendees}
              userAvatars={props.userAvatars}
            />
          :
            <Card className={classes.root}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Hi {props.currentUser}!
                </Typography>
                <br />
                <Typography variant="body2" component="p">
                  You can only change your own avatar.
                </Typography>
              </CardContent>
              <CardActions style={{ position: "absolute", bottom: 0, right: 0}}>
                <Button color="primary" size="medium" onClick={() => closeModel()}>Close</Button>
              </CardActions>
            </Card>
          }
        </Modal>
      }
      <List>
        {props.attendees !== undefined && props.attendees.map((name, index) => (
          <ListItem key={index} button>
            <ListItemAvatar>
              <Avatar onClick={() => openModel(name)} alt={name} src={props.userAvatars[index]}/>
            </ListItemAvatar>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}