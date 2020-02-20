import React, { Component } from 'react'
import { Button } from '@material-ui/core';

import DraggableText from './DraggableText';
import DraggableWhiteboard from './DraggableWhiteboard';
import DraggableVideo from './DraggableVideo';

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
        <DraggableText name={name} room={room}/>
        <Button>Add Text</Button>
        <Button>Add Board</Button>
        <DraggableWhiteboard />
        <DraggableVideo />

      </div>
    );
  }
}
