import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Iframe from 'react-iframe';
import style from "../assets/jss/draggableStyle";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Icon } from '@material-ui/core';

export default class DraggableVideo extends Component {
  render() {
    return (
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 500,
          height: 400,
        }}
      >
        <Card style={{ width: '100%', height: '100%' }} >
          <CardActions>
            <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
          <Iframe
            url="http://www.youtube.com/embed/xDMP3i36naA"
            width="100%"
            height="70%"
          />
        </Card>
      </Rnd>
    )
  }
}
