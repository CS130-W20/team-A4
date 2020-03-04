import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Radio from '@material-ui/core/Radio';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

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

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {avatars.map((avatar, index) => (
          <GridListTile key={index}>
            <img src={avatar} alt={"image " + index} style={{ cursor: "pointer" }} />
            <GridListTileBar
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <Radio
                    checked={false}
                    onChange={() => props.setAvatarIndex(index)}
                    name="radio-button-demo"
                    inputProps={{ 'aria-label': 'A' }}
                />
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
