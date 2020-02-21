import React, { Component } from 'react'
import { Rnd } from "react-rnd";
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
                  <div>
                    <h1>name: {this.props.name}, room: {this.props.room}</h1>
                  </div>
                </Rnd>
            </div>
        )
    }
}
