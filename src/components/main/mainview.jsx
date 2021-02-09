/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import ytdl from 'ytdl-core';
import server from '../../server/server';


class Mainview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      urlTxt:'',
      progress:'',
      estTime:'',
      downloadedSize:'',
      totalSize:''
    }

    this.download = this.download.bind(this);
  }

  inputChange = event =>{
    this.setState({
        [event.target.name] : event.target.value
    });
  };

  download(url){
    // console.log(url)

    // server.downloadVideo(url)
    let output = path.resolve(__dirname, 'video.mp4');
    let video = ytdl(url, { format: 'mp4' });
    let starttime;
    video.pipe(fs.createWriteStream(output));
    video.once('response', () => {
      starttime = Date.now();
    });
    video.on('progress', (chunckLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
      this.setState({
        progress: (percent * 100).toFixed(2),
        estTime: estimatedDownloadTime.toFixed(2),
        downloadedSize: (downloaded / 1024 / 1024).toFixed(2),
        totalSize: (total / 1024 / 1024).toFixed(2)
      });
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
      process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
      process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
      readline.moveCursor(process.stdout, 0, -1);
    });
    video.on('end', () => {
      alert('Downloaded succefully')
    });

    // let video = ytdl(this.state.urlTxt.id,{format: 'mp4'});
    // video.pipe(fs.createWriteStream('video.mp4'));

    // ytdl(this.state.urlTxt, {format: 'mp4'}).pipe(fs.createWriteStream('video.mp4'));
    // https://www.youtube.com/watch?v=a3ICNMQW7Ok
  }



  render() {
    return (
      <div>
        <input className="url" type="text" placeholder="Enter URL" onChange={this.inputChange} name="urlTxt" value={this.state.urlTxt} /> &nbsp;
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.download(this.state.urlTxt)}>Paste</button>
        {this.state.progress && <p>{this.state.progress}% downloaded ({this.state.downloadedSize}MB of {this.state.totalSize}MB)</p>}
        {this.state.estTime && <p>Estimated time: {this.state.estTime} Minutes</p>}
      </div>
    );
  }
}

export default Mainview;
