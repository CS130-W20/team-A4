import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ImageIcon from '@material-ui/icons/Image';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MovieIcon from '@material-ui/icons/Movie';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import BrushIcon from '@material-ui/icons/Brush';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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

export default function AttendeeList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List>
      <ListItem button>
        <ListItemAvatar>
          <Avatar alt="Dave Chan" src="https://i.pinimg.com/originals/76/65/78/76657870f44b49e13d59cc2fdd52083f.png" />
        </ListItemAvatar>
        <ListItemText primary="Dave Chan" />
      </ListItem>
      <ListItem button>
        <ListItemAvatar>
<<<<<<< HEAD
          <Avatar alt="Feilan Wang" src="https://pbs.twimg.com/profile_images/551035896602980352/sght8a8B.png" />
=======
          <Avatar alt="Feilan Wang" src="https://blog.bigbigwork.com/upload/2019/9/timg-8fa713226f3a474794b1c22a8a066d70.jpg" />
>>>>>>> 3d85352c97ea0584283b49671b168ab5d4bf7a7b
        </ListItemAvatar>
        <ListItemText primary="Feilan Wang" />
      </ListItem>
      <ListItem button>
        <ListItemAvatar>
          <Avatar alt="Liuyi Shi" src="https://i.etsystatic.com/6585391/r/il/e55d2a/593973841/il_570xN.593973841_qrbm.jpg" />
        </ListItemAvatar>
        <ListItemText primary="Liuyi Shi" />
      </ListItem>
    </List>
  );
}