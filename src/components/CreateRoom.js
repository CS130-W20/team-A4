import React, { Component } from 'react'
import Draggable from 'react-draggable';
import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';

export default class CreateRoom extends Component {  
  render() {
    const { name, room } = this.props.match.params;
    return (
      <div>
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
      </div>
    );
  }
}
