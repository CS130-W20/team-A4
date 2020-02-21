import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Iframe from 'react-iframe';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Icon } from '@material-ui/core';

import CardBody from "./Card/CardBody.js";
import CustomInput from "./CustomInput/CustomInput.js";

import style from "../assets/jss/draggableStyle";
export default class DraggableVideo extends Component {
  state = {
    videoUrl: ""
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ videoUrl: '' });
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      console.log("state: ", this.state),
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 400,
        }}
        enableUserSelectHack={false}
      >
      enter video link
      <form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
        <input 
          type="text" 
          name="videoUrl" 
          style={{ flex: '10', padding: '5px' }}
          placeholder="Add Video URL link..." 
          value={this.state.videoUrl}
          onChange={this.onChange}
        />
        <input 
          type="submit" 
          value="Submit" 
          className="btn"
          style={{flex: '1'}}
        />
      </form>

        <Card style={{ width: '100%', height: '100%' }} >
          <CardActions>
            <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
          <Iframe
            // url={this.state.videoUrl}
            url="http://www.youtube.com/embed/xDMP3i36naA"
            width="100%"
            height="70%"
          />
        </Card>
      </Rnd>
    )
  }
}
