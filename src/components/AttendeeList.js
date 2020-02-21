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

export default function AttendeeList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
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

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List>
      {props.attendees.map((name, index) => (
        <ListItem button>
          <ListItemAvatar>
            <Avatar alt={name} src={avatars[index]} />
          </ListItemAvatar>
          <ListItemText primary={name} />
        </ListItem>
      ))}
    </List>
  );
}