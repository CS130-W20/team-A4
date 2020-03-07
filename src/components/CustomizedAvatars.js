import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Radio from '@material-ui/core/Radio';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));



export default function CustomizedAvatars(props) {
  const classes = useStyles();
  // console.log("props.currentUser", props.currentUser);

  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h6">
          Choose Your Avatar
        </Typography>
      </CardContent>
      <GridList className={classes.gridList} cols={2.5}>
        {props.avatars.map((avatar, index) => (
          <GridListTile key={index}>
            <img src={avatar} alt={"image " + index} style={{ cursor: "pointer" }} />
            <GridListTileBar
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <Radio
                  checked={props.userAvatars[props.attendees.indexOf(props.currentUser)] === props.avatars[index]}
                  onChange={() => props.userSetAvatar(props.avatars[index])}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              }
            />
          </GridListTile>
        ))}
      </GridList>
      <CardActions>
        <Button color="primary" onClick={() => props.closeModel()}>Close</Button>
      </CardActions>
    </Card>
  );
}
