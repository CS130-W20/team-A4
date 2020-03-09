import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import Card from '@material-ui/core/Card';
import CanvasDraw from "react-canvas-draw";
import style from "../assets/jss/draggableStyle";
import { CardContent, Slider, Button } from '@material-ui/core';
import { TwitterPicker } from 'react-color'

const DEFAULT_BRUSH_RADIUS = 4;

export default class DraggableWhiteboard extends Component {
  state = {
    brushColor: "#000000",
    brushRadius: DEFAULT_BRUSH_RADIUS,
    z: this.props.maxZ
  }

  onChangeComplete = (color, _) => {
    this.setState({
      brushColor: color.hex
    });
  }

  handleSliderChange = (_, value) => {
    this.setState({
      brushRadius: value
    });
  }

  componentWillUpdate = (props) => {
    if (props.value != this.props.value) { // if value updated, load new data
      this.saveableCanvas.loadSaveData(props.value)
    }
  }

  componentDidUpdate = () => {
    this.saveableCanvas.drawImage();
  }
  
  handleUpload = ({ target }) => {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(target.files[0]);
    fileReader.onload = (e) => {
      this.props.handleValueChange(
        this.props.k,
        this.saveableCanvas.getSaveData(),
        e.target.result
      );
    }
  }

  render() {
    const colors = [
      '#000000', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', 
      '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7'
    ];
    console.log("whiteboard z:", this.state.z, "maxZ:", this.props.maxZ);
    return (
      <Rnd
        style={{...style, zIndex:this.state.z}}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
        }}
        size={{ width: this.props.location.split(',')[2], height: this.props.location.split(',')[3] }}
        position={{ x: this.props.location.split(',')[0], y: this.props.location.split(',')[1] }}
        onDragStart={() => {
          if (this.state.z <= this.props.maxZ){
            let incrementMaxZ = this.props.maxZ+1;
            this.props.updateZ(incrementMaxZ);
            this.setState({z:incrementMaxZ});
          }
        }}
        onDragStop={(e, d) => {
          this.props.handleLocationChange(this.props.componentId, d.x, d.y, this.props.location.split(',')[2], this.props.location.split(',')[3]);
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.props.handleLocationChange(
            this.props.componentId,
            this.props.location.split(',')[0],
            this.props.location.split(',')[1],
            ref.offsetWidth,
            ref.offsetHeight);
        }}
        enableUserSelectHack={false}
        dragHandleClassName="moveable"
      >
        <Card style={{ width: '100%', height: '100%' }}>
          <CardActions>
            <IconButton
              aria-label="delete"
              onClick={() => this.props.handleDeleteComponent(this.props.k)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              style={{ marginLeft: 'auto', cursor: 'all-scroll' }}
              aria-label="move"
              className="moveable"
            >
              <OpenWithIcon />
            </IconButton>
          </CardActions>
          <CardContent
            style={{ height: '65%' }}
            onMouseUp={() => this.props.handleValueChange(this.props.k, this.saveableCanvas.getSaveData())}
          >
            <CanvasDraw
              ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
              style={{ width: '100%', height: '100%' }}
              brushColor={this.state.brushColor}
              lazyRadius={10}
              brushRadius={this.state.brushRadius}
              loadTimeOffset={2}
              imgSrc={this.props.imgSrc}
            />
          </CardContent>
          <CardActions style={{ marginBottom: 5 }}> {/* TODO: align the color picker to center */} 
            <TwitterPicker
              style={{ float: 'left' }}
              colors={colors}
              onChangeComplete={this.onChangeComplete}
            />
            <Slider
              style={{ width: '180px', float: 'right' }}
              defaultValue={DEFAULT_BRUSH_RADIUS}
              getAriaValueText={() => this.state.brushRadius}
              onChange={this.handleSliderChange}
              aria-labelledby="brush-slider"
              valueLabelDisplay="auto"
              min={1}
              max={10}
            />
            <input
              accept="image/*"
              id="upload-file"
              multiple
              type="file"
              style={{ display: 'none' }}
              onChange={this.handleUpload}
            />
            <label htmlFor="upload-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </CardActions>
        </Card>
      </Rnd>
    )
  }
}
