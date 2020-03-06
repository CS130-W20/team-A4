import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
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
          setButtonStatus(4);
          break;
        case 'createNamedRoom':
          socket.emit("create", {
            "user_name": name,
            "room_name": roomName,
            "user_avatar": "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg"
          });
          socket.on("create_result", (createResultData) => {
            console.log("createResultData:", createResultData);
            props.history.push(`/room/name=${name}&roomID=${createResultData.room_id}`, { data: createResultData });
          });
          break;
        case 'join':
          setButtonStatus(2);
          break;
        case 'start':
          socket.emit("join", {
            "user_name": name,
            "room_id": roomID,
            "user_avatar": "https://secure.img1-ag.wfcdn.com/im/98270403/resize-h800-w800%5Ecompr-r85/8470/84707680/Pokemon+Pikachu+Wall+Decal.jpg"
          });
          socket.on("join_result", (joinResultData) => {
            console.log("joinResultData:", joinResultData);
            if (joinResultData === "invalid input") {
              props.history.push('/');
            } else {
              console.log("GET HERE!");
              props.history.push(`/room/name=${name}&roomID=${roomID}`, { data: joinResultData });
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
      case 'roomID':
        setRoomID(e.target.value);
        break;
      case 'roomName':
        setRoomName(e.target.value);
        break;
      case 'roomName':
        setRoomName(e.target.value);
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
  const [roomID, setRoomID] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [blank, setBlank] = React.useState(false);
  const [buttonStatus, setButtonStatus] = React.useState(0); // 0: unlick, 1: createRoom, 2: joinRoom, 3: start, 4: createNamedRoom
  const { ...rest } = props;
  console.log("button status ", buttonStatus);
  return (
    <div>
      <Header
        absolute
        color="transparent"
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
                        labelText="User Name..."
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
                    : buttonStatus === 4 ?
                    <CustomInput
                      labelText="Room Name..."
                      id="room_name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        value: roomName,
                        onChange: (e) => handleChange(e, "roomName")
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
                          value: roomID,
                          onChange: (e) => handleChange(e, "roomID"),
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
                      buttonStatus === 4 ? 
                      <Button
                      onClick={e => handleClick(e, "createNamedRoom")}
                      simple
                      color="primary"
                      size="lg">
                      Start
                    </Button>
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
