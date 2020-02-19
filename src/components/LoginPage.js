import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import People from "@material-ui/icons/People";
// core components
import Header from "./Header/Header.js";
import HeaderLinks from "./Header/HeaderLinks.js";
import Footer from "./Footer/Footer.js";
import GridContainer from "./Grid/GridContainer.js";
import GridItem from "./Grid/GridItem.js";
import Button from "./CustomButtons/Button.js";
import Card from "./Card/Card.js";
import CardBody from "./Card/CardBody.js";
import CardHeader from "./Card/CardHeader.js";
import CardFooter from "./Card/CardFooter.js";
import CustomInput from "./CustomInput/CustomInput.js";
import Start from "./Start.js";

import styles from "../assets/jss/material-kit-react/views/loginPage.js";

import image from "./pictures/bg7.jpg";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState(0);
  const { ...rest } = props;
  return (
    <Router>
    <div>
      <Header
        absolute
        color="transparent"
        brand="CS130"
        // rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h1>XBoard</h1>
                  </CardHeader>
                  <p className={classes.divider}>By Team 5X4</p>
                  <CardBody>
                    <CustomInput
                      labelText="Name..."
                      id="first"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Room Number..."
                      id="room"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        endAdornment: (
                          <InputAdornment position="end">
                            <MeetingRoomIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple color="primary" size="lg">
                      Create Room
                    </Button>
                    <Button simple color="primary" size="lg">
                      Join Room
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
    </Router>
  );
}
