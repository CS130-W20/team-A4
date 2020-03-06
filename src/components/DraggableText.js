import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import style from "../assets/jss/draggableStyle";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Icon } from '@material-ui/core';
import socket from "./SocketContext";

export default function DraggableText(props) {
  // const handleChange = event => {
  //   props.handleContentTableChange(value, props.component_id);
  //   setValue(event.target.value);
  //
  //   // Sync to other attendees
  //   socket.emit("update_component",
  //      {
  //         "room_id": props.roomID,
  //         "component_id": props.component_id,
  //         "component_type": "text",
  //         "update_type": "update_finished",
  //         "update_info": {
  //            "location": "(-1,-1),(-1,-1)", //-1 means no change in location
  //            "data": value
  //         }
  //      }
  //   );
  //   console.log("update_component sync: room_id is: ", props.roomID, ", component_id is: ", props.component_id, "new value is: ", value);
  // };

  const [value, setValue] = React.useState("");

  // React.useEffect(() => {
  //   // if (props.update_content != undefined) {
  //     // TODO: this logic is toxic, just for testing
  //     setValue(props.update_content);
  //     console.log("update value to: ", value);
  //   // }
  // })

  return (
    <Rnd
      style={style}
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 250,
      }}
      enableUserSelectHack={false}
    >
      <Card style={{ width: '100%', height: '100%' }} >
        <CardActions>
          <IconButton aria-label="delete" onClick={() => props.handleDeleteComponent(props.k)} >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
        <CardContent>
          <TextField
            value={props.value}
            multiline
            rows="4"
            rowsMax="10"
            variant="outlined"
            onChange={(e) => props.handleValueChange(props.componentId, e.target.value)}
            style={{ width: '100%', height: '100%' }}
          />
        </CardContent>
      </Card>
    </Rnd>
  );
}
