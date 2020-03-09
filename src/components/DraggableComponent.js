import React, { Component} from 'react';
import { Rnd } from "react-rnd";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import style from "../assets/jss/draggableStyle";
import DraggableImage from './DraggableImage';
import DraggableVideo from './DraggableVideo';
import DraggableText from './DraggableText';


export default class DraggableComponent extends Component {
    state = {
        z:0
    }
    
    render() {
      console.log("[enter draggable component] location: ", this.props.location);
        console.log(this.props.componentType);
        return (
        <Rnd
            style={{...style, zIndex:this.state.z}}
            default={{
              x: 0,
              y: 0,
              width: 500,
              height: 400,
            }}
            size={{ width: this.props.location.split(',')[2],  height: this.props.location.split(',')[3] }}
            position={{ x: this.props.location.split(',')[0], y: this.props.location.split(',')[1] }}
            onDragStart={(e, d) => { 
              if (this.props.maxZIndex >= this.state.z) {
                this.setState({ z:this.props.maxZIndex+1})
                this.props.updateMaxZIndex(this.state.z);
              }
            }}
            onDragStop={(e, d) => {
              console.log("In draggable, location is: ", d.x, ", ", d.y, ",", this.props.location.split(',')[2], ",", this.props.location.split(',')[3]);
              this.props.handleLocationChange(this.props.k, d.x, d.y, this.props.location.split(',')[2], this.props.location.split(',')[3]);
              // TODO: update z
            }}
            onResize={(e, direction, ref, delta, position) => {
              this.props.handleLocationChange(this.props.k,
                                              this.props.location.split(',')[0],
                                              this.props.location.split(',')[1],
                                              ref.offsetWidth,
                                              ref.offsetHeight);
            }}
            enableUserSelectHack={false}
            dragHandleClassName="moveable"
        >
            {this.props.componentType === "image" && <DraggableImage handleDeleteComponent={this.props.handleDeleteComponent} k={this.props.k}/>}
            {this.props.componentType === "video" && <DraggableVideo handleDeleteComponent={this.props.handleDeleteComponent} 
                                                                      k={this.props.k}
                                                                      handleValueChange={this.props.handleValueChange}
                                                                      value={this.props.value}/>}
            {this.props.componentType === "text" && <DraggableText handleDeleteComponent={this.props.handleDeleteComponent} 
                                                                      k={this.props.k}
                                                                      handleValueChange={this.props.handleValueChange}
                                                                      value={this.props.value}/>}
                                                                      {/* TODO: add whiteboard */}

          </Rnd>
        )
    }
}