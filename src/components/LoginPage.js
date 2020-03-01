import React from 'react';
import { BrowserRouter as Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import People from "@material-ui/icons/People";
// core components
import Header from "./Header/Header.js";
import GridContainer from "./Grid/GridContainer.js";
import GridItem from "./Grid/GridItem.js";
import Button from "./CustomButtons/Button.js";
import Card from "./Card/Card.js";
import CardBody from "./Card/CardBody.js";
import CardHeader from "./Card/CardHeader.js";
import CardFooter from "./Card/CardFooter.js";
import CustomInput from "./CustomInput/CustomInput.js";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import image from "./pictures/bg7.jpg";
import io from "socket.io-client";
import socket from "./SocketContext";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  function handleClick(e, field) {
    //const socket = require('./SocketContext.js');
    if (name === "") {
      setBlank(true);
    } else {
      setBlank(false);
      switch(field) {
        case 'create':
          socket.emit("create", {
            "user_name": name
          });
          socket.on("create_result", (data) => {
            console.log("data:", data);
            props.history.push(`/createRoom/name=${name}&room=${data.room_id}`, { data: data });
          });
          break;
        case 'join':
          setButtonStatus(2);
          break;
        case 'start':
          // pass room number into socket.emit
          socket.emit("join", {
              "user_name": name,
              "room_id": room
          });
          socket.on("join_result", (data) => {
            console.log("data is:", data, typeof(data));
            if (data === "invalid input") {
              props.history.push('/');
            } else {
              props.history.push(`/createRoom/name=${name}&room=${room}`, { data: data });
            }
          });
          break;
        default:
          break;
      }
    }
  }

  function handleChange(e, field) {
    switch(field) {
      case 'name':
        setBlank(e.target.value === "");
        setName(e.target.value);
        break;
      case 'room':
        setRoom(e.target.value);
        break;
      default:
        break;
    }
  }

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  //const endpoint = React.useState("ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080");
  //const socket = io( "ec2-54-184-200-244.us-west-2.compute.amazonaws.com:8080", {"transports": ["polling","websocket"]});
  const path = React.useState("");

  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [blank, setBlank] = React.useState(false);
  const [buttonStatus, setButtonStatus] = React.useState(0); // 0: unlick, 1: createRoom, 2: joinRoom, 3: start
  const { ...rest } = props;

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="CS130"
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
                  <CardBody>
                    {buttonStatus === 0 ?
                      <CustomInput
                        labelText="Name..."
                        id="name"
                        formControlProps={{
                          fullWidth: true
                        }}
                        errorMessage={blank ? "Please enter your name" : undefined}
                        inputProps={{
                          type: "text",
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                          onChange: (e) => handleChange(e, "name"),
                          error: blank,
                        }}
                      />
                    :
                      <CustomInput
                        labelText="Room ID"
                        id="room_id"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          value: room,
                          onChange: (e) => handleChange(e, "room"),
                        }}
                      />
                    }
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    {/* Only show Create Room button when no button clicked */}
                    {buttonStatus === 0 ?
                      [<Button
                        onClick={e => handleClick(e, "create")}
                        simple
                        color="primary"
                        size="lg"
                        key="create">
                        Create Room
                      </Button>,
                      <Button
                        onClick={e => handleClick(e, "join")}
                        simple
                        color="primary"
                        size="lg"
                        key="join">
                        Join Room
                      </Button>]
                      :
                      <Button
                        onClick={e => handleClick(e, "start")}
                        simple
                        color="primary"
                        size="lg">
                        Start
                      </Button>
                    }
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
