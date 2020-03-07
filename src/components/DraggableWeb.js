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

export default class DraggableWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      show: false
    }
    this.myRef = React.createRef();
  }

  

  onSubmit = (e) => {
    // e.preventDefault();
    this.setState({ show: true });
  }

  onChange = (e) => this.setState({ url: e.target.value });

  render() {
    const show = this.state.show;
    return (
      <Rnd
        ref={this.myRef}
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 400,
          height: 300,
        }}
        enableUserSelectHack={false}
        dragHandleClassName="moveable"
        ref = "div"
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
        <CardContent style={{ height: '100%' }}>
          {show ?
            <iframe id="iframe" style={{ width: "100%", height: "70%" }} src={this.state.url} target="_self"></iframe>
          :
            (<FormControl style={{ marginLeft: 10, display: 'flex' }}>  
              <TextField style={{ width: "85%", float: "left" }} id="standard-videoUrl" label="Add Web URL..." onChange={this.onChange} />
              <Button variant="contained" onClick={() => this.onSubmit()} style={{ width: "10%", float: "left" }} value="Submit">Submit</Button>
            </FormControl>
          )}
        </CardContent>
        </Card>
      </Rnd>
    )
  }
}
