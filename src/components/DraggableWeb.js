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
      webURL: "",
      show: false
    }
    this.iframe = React.createRef();
  }
  
  onSubmit = (e) => {
    this.setState({ show: true });
    this.props.handleValueChange(this.props.k, this.state.webURL);
  }

  onChange = (e) => {
    this.setState({ webURL: e.target.value });
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
      this.setState({ show: true, webURL: nextProps.value });
    }
  }

  render() {
    return (
      <Rnd
        style={style}
        enableUserSelectHack={false}
        dragHandleClassName="moveable"
        size={{ width: this.props.location.split(',')[2], height: this.props.location.split(',')[3] }}
        position={{ x: this.props.location.split(',')[0], y: this.props.location.split(',')[1] }}
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
        <Card style={{ width: '100%', height: '100%' }}>
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
                value={this.state.webURL}
                style={{ width: "80%", margin: 5 }}
                id="standard-weburl"
                label="Add Web URL..."
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
            <iframe
              ref={this.iframe}
              id="iframe"
              src={this.props.value}
              height="70%"
              width="100%"
            />
          </CardContent>
        </Card>
      </Rnd>
    )
  }
}
