import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import style from "../assets/jss/draggableStyle";

export default class DraggableImage extends Component {

  state = {
      selectedImage : null,
      show : false,
      imageFile : null
  }

  imageSelectedHandler = e => {
      this.setState({
          selectedImage : URL.createObjectURL(e.target.files[0]),
          imageFile : e.target.files[0]
      });
      this.setState({ show: true });

  }

  render() {
    const show = this.state.show;

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
        dragHandleClassName="moveable"
      >
        <Card style={{ width: '100%', height: '100%' }} >
          <CardActions>
            <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton style={{ marginLeft: 'auto', cursor: 'all-scroll' }} aria-label="move" className="moveable">
              <OpenWithIcon />
            </IconButton>
          </CardActions>
          <CardContent>
            {show ?
              <img 
                  src={this.state.selectedImage} 
                  width="90%" 
                  height="80%"
                  alt="image cannot be displayed"
              /> 
            :
              <input type="file" onChange={this.imageSelectedHandler}/>
            }
            </CardContent>
        </Card>
      </Rnd>
    )
  }
}