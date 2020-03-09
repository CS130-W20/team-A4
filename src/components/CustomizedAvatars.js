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

const AVATARS = [
  "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg",
  "https://pbs.twimg.com/profile_images/551035896602980352/sght8a8B.png",
  "https://hips.hearstapps.com/digitalspyuk.cdnds.net/17/05/1486126267-mickey-mouse.jpg",
  "https://listrick.com/wp-content/uploads/2019/11/Famous-Cartoon-Characters-with-Big-Noses-2.jpg",
  "https://pmcvariety.files.wordpress.com/2016/05/pooh.jpg?w=700",
  "https://i.pinimg.com/originals/76/65/78/76657870f44b49e13d59cc2fdd52083f.png",
  "https://i.etsystatic.com/6585391/r/il/e55d2a/593973841/il_570xN.593973841_qrbm.jpg"
];

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
<<<<<<< HEAD
  // console.log("props.currentUser", props.currentUser);
=======
>>>>>>> dave-branch

  return (
    <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h6">
          Choose Your Avatar
        </Typography>
      </CardContent>
      <GridList className={classes.gridList} cols={2.5}>
        {AVATARS.map((avatar, index) => (
          <GridListTile key={index}>
            <img src={avatar} alt={"avatar " + index} style={{ cursor: "pointer" }} />
            <GridListTileBar
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <Radio
                  checked={props.currentUser[1] === avatar}
                  onChange={() => props.userSetAvatar(avatar)}
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
