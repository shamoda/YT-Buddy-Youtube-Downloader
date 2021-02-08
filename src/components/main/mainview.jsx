/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import server from '../../server/server';

class Mainview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      urlTxt:''
    }

    this.download = this.download.bind(this);
  }

  inputChange = event =>{
    this.setState({
        [event.target.name] : event.target.value
    });
  };

  download(url){
    console.log(url)
    server.downloadVideo(url)

    // let video = ytdl(this.state.urlTxt.id,{format: 'mp4'});
    // video.pipe(fs.createWriteStream('video.mp4'));

    // ytdl(this.state.urlTxt, {format: 'mp4'}).pipe(fs.createWriteStream('video.mp4'));
  }



  render() {
    return (
      <div>
        <input className="url" type="text" placeholder="Enter URL" onChange={this.inputChange} name="urlTxt" value={this.state.urlTxt} /> &nbsp;
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.download(this.state.urlTxt)}>Paste</button>
      </div>
    );
  }
}

export default Mainview;
