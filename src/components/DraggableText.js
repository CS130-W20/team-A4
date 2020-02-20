import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Draggable from 'react-draggable';
import style from "../assets/jss/draggableStyle";

export default class DraggableText extends Component {
    
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
                        Drag from here                    
                        <h1>name: {this.props.name}, room: {this.props.room}</h1>
                        </div>
                    </Draggable>
                </Rnd>
            </div>
        )
    }
}
