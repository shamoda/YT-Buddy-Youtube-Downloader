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

    this.btnClick = this.btnClick.bind(this);
  }

  inputChange = event =>{
    this.setState({
        [event.target.name] : event.target.value
    });

    // if(event.target.value  Check is this valid or not)
    // {
    //   video = ytdl(this.state.urlTxt, { format: 'mp4' });
    // }

    console.log(event.target.value)

  };


  output = path.resolve(__dirname, 'video.mp4');
  
  video = ytdl(this.state.urlTxt, { format: 'mp4' });



  stop(btn) {
    console.log(btn)
    if(this.video.isPaused){
      this.video.resume();
    }

    this.video.destroy();

      if (fs.existsSync(this.output)) {
        fs.unlink(this.output, (err) => {
            if (err) {
                alert("An error ocurred updating the file" + err.message);
                console.log(err);
                return;
            }
            console.log("File succesfully deleted");
        });
      }else{
        alert("This file doesn't exist, cannot delete");
      }
  }



  btnClick(btn){
    console.log(btn)

    let starttime;

      this.video.pipe(fs.createWriteStream(this.output));

       this.video.once('response', () => {
        starttime = Date.now();
      });


          this.video.on('progress', (chunckLength, downloaded, total) => {
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


      this.video.on('end', () => {
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
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.btnClick('download')}>Download</button>
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.pause('pause')}>Pause</button>
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.resume('resume')}>Resume</button>
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.stop('stop')}>Stop</button>
        <button className="paste" type="button" variant="outline-primary" onClick={() => this.btnClick('msg')}>Msg</button>
        {this.state.progress && <p>{this.state.progress}% downloaded ({this.state.downloadedSize}MB of {this.state.totalSize}MB)</p>}
        {this.state.estTime && <p>Estimated time: {this.state.estTime} Minutes</p>}
      </div>
    );
  }
}

export default Mainview;
