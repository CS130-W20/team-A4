import React, { Component, useState} from 'react'
import { Rnd } from "react-rnd";
import style from "../assets/jss/draggableStyle";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';

export default function DraggableText(props) {
  const [z, setZ] = useState(props.maxZ);
  console.log("text z:", z, "maxZ:", props.maxZ);
  return (
    <Rnd
      style={{...style, zIndex:z}}
      size={{ width: props.location.split(',')[2],  height: props.location.split(',')[3] }}
      position={{ x: props.location.split(',')[0], y: props.location.split(',')[1] }}
      onDragStart={() => {
        if (z <= props.maxZ){
          let incrementMaxZ = props.maxZ+1;
          props.updateZ(incrementMaxZ);
          setZ(incrementMaxZ);
        }
      }}
      onDragStop={(e, d) => {
        props.handleLocationChange(props.k, d.x, d.y, props.location.split(',')[2], props.location.split(',')[3]);
      }}
      onResize={(e, direction, ref, delta, position) => {
        props.handleLocationChange(
          props.k,
          props.location.split(',')[0],
          props.location.split(',')[1],
          ref.offsetWidth,
          ref.offsetHeight
        );
      }}
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 250,
      }}
      enableUserSelectHack={false}
      dragHandleClassName="moveable"
    >
      <Card style={{ width: '100%', height: '100%' }} >
        <CardActions>
          <IconButton aria-label="delete" onClick={() => props.handleDeleteComponent(props.k)} >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton style={{ marginLeft: 'auto', cursor: 'all-scroll' }} aria-label="move" className="moveable">
            <OpenWithIcon />
          </IconButton>
        </CardActions>
        <CardContent style={{ height: '80%' }}>
          <TextField
            value={props.value}
            multiline
            rows="4"
            rowsMax="10"
            variant="outlined"
            onChange={(e) => props.handleValueChange(props.k, e.target.value)}
            style={{ width: '100%', height: '100%' }}
          />
        </CardContent>
      </Card>
      </Rnd>
  );
}
