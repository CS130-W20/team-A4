import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import Card from '@material-ui/core/Card';
import CanvasDraw from "react-canvas-draw";
import style from "../assets/jss/draggableStyle";
import { CardContent } from '@material-ui/core';


export default class DraggableWhiteboard extends Component {
  render() {
    return (
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
        }}
        enableUserSelectHack={false}
        dragHandleClassName="moveable"
      >
        <Card style={{ width: '100%', height: '100%' }}>
          <CardActions>
            <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
              <DeleteIcon />
            </IconButton>
            <IconButton style={{ marginLeft: 'auto', cursor: 'all-scroll' }} aria-label="move" className="moveable">
              <OpenWithIcon />
            </IconButton>
          </CardActions>
          <CardContent style={{ height: '80%' }}>
            <CanvasDraw style={{ width: '100%', height: '100%' }} />
          </CardContent>
          
          {/* <Whiteboard
            events={new EventStream()} eventStore={new EventStore()}
            width={'100%'}
            height={'100%'}
            // style={{ backgroundColor: 'lightgray' }}
          /> */}
        </Card>
      </Rnd>
    )
  }
}
