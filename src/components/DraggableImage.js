import React, { Component } from 'react'
import { Rnd } from "react-rnd";
<<<<<<< HEAD
=======
import Iframe from 'react-iframe';
>>>>>>> master
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import style from "../assets/jss/draggableStyle";

export default class DraggableImage extends Component {

  state = {
      selectedImage : null,
<<<<<<< HEAD
      show : false,
      imageFile : null
=======
      show : false
>>>>>>> master
  }

  imageSelectedHandler = e => {
      this.setState({
<<<<<<< HEAD
          selectedImage : URL.createObjectURL(e.target.files[0]),
          imageFile : e.target.files[0]
      });
      this.setState({ show: true });

=======
          selectedImage : URL.createObjectURL(e.target.files[0])
      });
      this.setState({ show: true });
>>>>>>> master
  }

  render() {
    const show = this.state.show;
<<<<<<< HEAD
    console.log("image selected:", this.state.selectedImage);
    console.log("image file: ", this.state.imageFile);
=======
    console.log("image selected:", this.state.selectedImage)
>>>>>>> master
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
            <img 
                src={this.state.selectedImage} 
                width="90%" 
                height="80%"
<<<<<<< HEAD
                alt="image cannot be displayed"
=======
>>>>>>> master
            /> 
        :
            <input type="file" onChange={this.imageSelectedHandler}/>
        }
        </Card>


      </Rnd>
    )
  }
}