import React, { Component } from 'react'
import { Rnd } from "react-rnd";
import Iframe from 'react-iframe';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import style from "../assets/jss/draggableStyle";
export default class DraggableVideo extends Component {
  state = {
    videoUrl: "",
    show: false
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({show: true});
  }
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

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
      >
        <Card style={{ width: '100%', height: '100%' }} >
        <CardActions>
          <IconButton aria-label="delete" onClick={() => this.props.handleDeleteComponent(this.props.k)} >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
        {show ?
          <Iframe
            url={this.state.videoUrl}
            // url="http://www.youtube.com/embed/xDMP3i36naA"
            width="100%"
            height="70%"
          />
        :
          (<form onSubmit={this.onSubmit} style={{ display: 'flex' }}>
            <input 
              type="text" 
              name="videoUrl" 
              style={{ flex: '10', padding: '5px', width: '200px' }}
              placeholder="Add Video URL link..." 
              value={this.state.videoUrl}
              onChange={this.onChange}
            />
            <input 
              type="submit" 
              value="Submit" 
              className="btn"
              style={{flex: '1', padding: '5px', width: '200px' }}
            />
          </form>
        )}
        </Card>


      </Rnd>
    )
  }
}
