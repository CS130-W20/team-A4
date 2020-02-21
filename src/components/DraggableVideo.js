import React, { Component } from 'react'
import { Rnd } from "react-rnd";
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
        )
    }
}
