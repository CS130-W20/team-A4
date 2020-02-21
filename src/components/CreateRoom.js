import React, { Component } from 'react'
import Draggable from 'react-draggable';
import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';
import { Rnd } from "react-rnd";
import { Button } from '@material-ui/core';
import Iframe from 'react-iframe'

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

export default class CreateRoom extends Component {
  render() {
    const { name, room } = this.props.match.params;
    return (
      <div>

        <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
        >
          <div>
            <h1>name: {name}, room: {room}</h1>
          </div>
        </Rnd>

        <Button>Add Text</Button>
        <Button>Add Board</Button>

        <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
        }}
        >
          <div>
            <Whiteboard
              events={new EventStream()} eventStore={new EventStore()}
              style={{backgroundColor: 'lightyellow'}}
            />
          </div>
        </Rnd>

        <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
        }}
        >
          <div>
            <Iframe
              url="http://www.youtube.com/embed/xDMP3i36naA"
              width="450px"
              height="450px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"/>
          </div>
        </Rnd>

      </div>
    );
  }
}
