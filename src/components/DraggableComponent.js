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


export default class DraggableComponent extends Component {
    state = {
        z:0
    }
    
    render() {
        console.log(this.props.componentType);
        return (
        <Rnd
            style={{...style, zIndex:this.state.z}}
            style={style}
            default={{
              x: 0,
              y: 0,
              width: 500,
              height: 400,
            }}
            onDragStart={(e, d) => { 
              if (this.props.maxZIndex >= this.state.z) {
                this.setState({ z:this.props.maxZIndex+1})
                this.props.updateMaxZIndex(this.state.z);
              }
            }}
            enableUserSelectHack={false}
            dragHandleClassName="moveable"
        >
            {this.props.componentType === "image" && <DraggableImage handleDeleteComponent={this.props.handleDeleteComponent} k={this.props.k}/>}
            {this.props.componentType === "video" && <DraggableVideo handleDeleteComponent={this.props.handleDeleteComponent} k={this.props.k}/>}

            
            
          </Rnd>
        )
    }
}