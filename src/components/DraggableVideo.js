import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Draggable from 'react-draggable';
import Iframe from 'react-iframe'

import style from "../assets/jss/draggableStyle";

export default class DraggableVideo extends Component {
    render() {
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
        )
    }
}
