import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import {Whiteboard, EventStream, EventStore} from '@ohtomi/react-whiteboard';

import style from "../assets/jss/draggableStyle";


export default class DraggableWhiteboard extends Component {
    render() {
        return (
            <div>
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
            </div>
        )
    }
}
