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
          <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{x: 0, y: 0}}
            position={null}
            grid={[25, 25]}
            scale={1}>
            <div className="handle" style={{backgroundColor: 'lightgreen', width: '30%', cursor: 'grab'}}>
              Drag from here
              <h1>name: {name}, room: {room}</h1>
            </div>
          </Draggable>
        </Rnd>

        <Button>Add Text</Button>
        <Button>Add Board</Button>

        <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
        >
          <Draggable
            axis="both"
            handle=".handle"
            defaultPosition={{x: 0, y: 0}}
            position={null}
            grid={[25, 25]}
            scale={1}>
            <div>
              <div className="handle" style={{backgroundColor: 'lightgreen', width: '30%', cursor: 'grab'}}>
                Drag from here
              </div>
              <Whiteboard
                events={new EventStream()} eventStore={new EventStore()}
                style={{backgroundColor: 'lightyellow'}}
              />
            </div>

          </Draggable>
        </Rnd>

        <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
        >
        <Draggable
          axis="both"
          handle=".handle"
          defaultPosition={{x: 0, y: 0}}
          position={null}
          grid={[25, 25]}
          scale={1}>
          <div className="handle" style={{backgroundColor: 'lightgreen', width: '30%', cursor: 'grab'}}>
            <p>Drag from here</p>
            <Iframe
              url="http://www.youtube.com/embed/xDMP3i36naA"
              width="450px"
              height="450px"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"/>
          </div>
        </Draggable>
        </Rnd>

      </div>
    );
  }
}
