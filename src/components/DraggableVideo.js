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
    show: false
  }

  onSubmit = (e) => {
    // e.preventDefault();
    this.setState({ show: true });
  }

  convertToEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    console.log("videoId:", videoId);
    return "https://www.youtube.com/embed/" + videoId;
  }

  onChange = (e) => {
    // TODO: s
    this.setState({ videoUrl: e.target.value });
    this.props.handleValueChange(this.props.k, e.target.value);
  }

  render() {
    const show = this.state.show;
    return (
        <Card style={{ width: '100%', height: '100%' }} >
        <CardActions>
          <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton style={{ marginLeft: 'auto', cursor: 'all-scroll' }} aria-label="move" className="moveable">
            <OpenWithIcon />
          </IconButton>
        </CardActions>
        <CardContent style={{ height: '100%' }}>
        {show ?
          <Iframe
            url={this.convertToEmbedUrl(this.props.value)}
            width="100%"
            height="70%"
          />
        :
          (<FormControl style={{ marginLeft: 10, display: 'flex' }}>
            <TextField style={{ width: "85%", float: "left" }} id="standard-videoUrl" label="Add Video URL link..." onChange={this.onChange} />
            <Button variant="contained" onClick={() => this.onSubmit()} style={{ width: "10%", float: "left" }} value="Submit">Submit</Button>
          </FormControl>
        )}
        </CardContent>
        </Card>
    )
  }
}
