import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Iframe from 'react-iframe';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import style from "../assets/jss/draggableStyle";

export default class DraggableImage extends Component {

  state = {
      selectedImage : null,
      show : false
  }

  imageSelectedHandler = e => {
      this.setState({
          selectedImage : URL.createObjectURL(e.target.files[0])
      });
      this.setState({ show: true });
  }

  render() {
    const show = this.state.show;
    console.log("image selected:", this.state.selectedImage)
    return (
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
        <Card style={{ width: '100%', height: '100%' }} >
        <CardActions>
          <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
        {show ?
            <img src={this.state.selectedImage}/> 
        :
            <input type="file" onChange={this.imageSelectedHandler}/>
        }
        </Card>


      </Rnd>
    )
  }
}