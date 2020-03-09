import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Iframe from 'react-iframe';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import style from "../assets/jss/draggableStyle";
import { CardContent } from '@material-ui/core';

export default class DraggableVideo extends Component {
  state = {
    videoUrl: "",
    show: false,
    z: this.props.maxZ
  }

  onSubmit = (e) => {
    this.setState({ show: true });
    this.props.handleValueChange(this.props.k, this.state.videoUrl);
  }

  convertToEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    console.log("videoId:", videoId);
    return "https://www.youtube.com/embed/" + videoId;
  }

  onChange = (e) => {
    this.setState({ videoUrl: e.target.value });
  }

  validURL = (str) => { // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/49849482
    // TODO: remove default URL
    var pattern = new RegExp('^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.value !== undefined &&
      this.validURL(nextProps.value) &&
      this.props.value !== nextProps.value) { // TODO: this is a work-around
      this.setState({ show: true, videoUrl: nextProps.value });
    }
  }


  render() {
    const show = this.state.show;
    return (
      <Rnd
        style={{...style, zIndex:this.state.z}}
        enableUserSelectHack={false}
        dragHandleClassName="moveable"
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
          this.props.handleLocationChange(
            this.props.k, d.x, d.y,
            this.props.location.split(',')[2],
            this.props.location.split(',')[3]
          );
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.props.handleLocationChange(
            this.props.k,
            this.props.location.split(',')[0],
            this.props.location.split(',')[1],
            ref.offsetWidth,
            ref.offsetHeight
          );
        }}
      >
        <Card
          style={{ width: '100%', height: '100%' }}
          onClick={() => {
            if (this.state.z <= this.props.maxZ){
              let incrementMaxZ = this.props.maxZ+1;
              this.props.updateZ(incrementMaxZ);
              this.setState({z:incrementMaxZ});
            }
          }}
        >
          <CardActions>
            <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton style={{ marginLeft: 'auto', cursor: 'all-scroll' }} aria-label="move" className="moveable">
              <OpenWithIcon />
            </IconButton>
          </CardActions>
          <CardContent style={{ height: '100%' }}>
            <FormControl style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={this.state.videoUrl}
                style={{ width: "80%", margin: 5 }}
                id="standard-videoUrl"
                label="Enter Video URL..."
                onChange={this.onChange}
              />
              <Button
                variant="contained"
                onClick={() => this.onSubmit()}
                style={{ width: "10%", margin: 5 }}
                value="Submit"
              >
                Submit
              </Button>
            </FormControl>
            <br />
            <Iframe
              url={this.convertToEmbedUrl(this.props.value)}
              width="100%"
              height="70%"
            />
          </CardContent>
        </Card>
      </Rnd>
    )
  }
}
