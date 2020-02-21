import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';

import style from "../assets/jss/draggableStyle";


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
      >
        <Card style={{ width: '100%', height: '100%' }} >
          <CardHeader
            action={
              <IconButton aria-label="delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          />
          <Whiteboard
            events={new EventStream()} eventStore={new EventStore()}
            width={'100%'}
            height={'100%'}
            // style={{ backgroundColor: 'lightgray' }}
          />
        </Card>
      </Rnd>
    )
  }
}
