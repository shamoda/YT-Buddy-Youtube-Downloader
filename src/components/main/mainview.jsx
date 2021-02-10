/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable react/sort-comp */
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


    // https://www.youtube.com/watch?v=a3ICNMQW7Ok


class Mainview extends Component {

  // class variables
  video;
  validUrl = false;
  output = path.resolve(__dirname, 'video.mp4');

  // initializing constructor
  constructor(props) {
    super(props);
    this.state = {
      urlTxt:'abc',
      progress:'',
      estTime:'',
      downloadedSize:'',
      totalSize:''
    }
  }

  // listening to onChange event of URL input field
  inputChange = event =>{

    this.setState({
        [event.target.name] : event.target.value
    });

    // validating the url
    if(ytdl.validateURL(event.target.value))
    {
      // setting validUrl true
      this.validUrl = true
      // creating readable stream
      this.video = ytdl(event.target.value, { format: 'mp4' });
      console.log('Valid URL')
    }
    else{
      console.log('Invalid URL')
    }
  };



  downloadVideo(){

    if(this.validUrl){
      // local variable to store download start time
      let starttime;

      // writting the file from readable stream to file system
      this.video.pipe(fs.createWriteStream(this.output));

      // this will fire when downloading started
      this.video.once('response', () => {
        starttime = Date.now();
      });

      // getting progress of the downloading video
      this.video.on('progress', (chunckLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;

        // updating the state according to the progress
        this.setState({
          progress: (percent * 100).toFixed(2),
          estTime: estimatedDownloadTime.toFixed(2),
          downloadedSize: (downloaded / 1024 / 1024).toFixed(2),
          totalSize: (total / 1024 / 1024).toFixed(2)
        });

        // writting progress data on console
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout, 0, -1);
      });

      // this will fire when downloading is finished
      this.video.on('end', () => {
        alert('Downloaded succefully')
      });
    }
  }

  stopDownloading() {

    if(this.validUrl){
      // destroying readable stream
      this.video.destroy();

      // deleting partially downloaded file from the downloaded location
      if (fs.existsSync(this.output)) {
        fs.unlink(this.output, (err) => {
            if (err) {
                alert("An error ocurred while downloading the file" + err.message);
                console.log(err);
                return;
            }
            console.log("File succesfully deleted");
        });
      }
      else{
        alert("Downloading stoped. Please wait.");
      }
    }
  }



  render() {
    return (
      <div>
        <input className="url" type="text" placeholder="Enter URL" onChange={this.inputChange} name="urlTxt" value={this.state.urlTxt} /> &nbsp;
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.downloadVideo()}>Download</button>
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.stopDownloading()}>Stop</button>
        {this.state.progress && <p>{this.state.progress}% downloaded ({this.state.downloadedSize}MB of {this.state.totalSize}MB)</p>}
        {this.state.estTime && <p>Estimated time: {this.state.estTime} Minutes</p>}
      </div>
    );
  }
}

export default Mainview;
