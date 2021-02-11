/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
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
import { Button, Card, CardActions, CircularProgress, IconButton, LinearProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../App.global.css'

    // added functionalities to the paste button

    // https://www.youtube.com/watch?v=a3ICNMQW7Ok


class Mainview extends Component {

  // class variables
  video;
  output;
  validUrl = false;
  snack = false;

  // initializing constructor
  constructor(props) {
    super(props);
    this.state = {
      urlTxt:'',
      format:'',
      disableFormat: true,
      disableDownload: true,
      downloadBtnProgress: false,
      isDownloading: false,
      progress:0,
      estTime: 0,
      downloadedSize: 0,
      totalSize: 0
    }
  }

  downloadInitialState() {
    this.setState({
      urlTxt:'',
      format:'',
      disableFormat: true,
      disableDownload: true,
      downloadBtnProgress: false,
      isDownloading: false,
      progress: 0,
      estTime: 0,
      downloadedSize: 0,
      totalSize: 0
    });
    this.video = null;
  }

  // listening to onChange event of URL input field
  inputChange = event =>{
    this.setState({
        [event.target.name] : event.target.value
    }, function() {
      this.validateInputs()
    });
  };

  validateInputs() {
    // validating the url
    if(ytdl.validateURL(this.state.urlTxt))
    {
      this.setState({
        disableFormat: false
      })
      if(this.state.format != '') {
        this.setState({
          disableDownload: false
        })
      }
      // setting validUrl true
      this.validUrl = true
      this.output = path.resolve(__dirname, 'video.'+this.state.format);
      // creating readable stream
      this.video = ytdl(this.state.urlTxt, { format: this.state.format });
      console.log('Valid URL')
    }
    else{
      console.log('Invalid URL')
      this.downloadInitialState()
    }
  }


  downloadVideo(){

    if(this.validUrl){
      // showing progress circle besides the download button
      this.setState({ downloadBtnProgress: true })

      // local variable to store download start time
      let starttime;

      // writting the file from readable stream to file system
      this.video.pipe(fs.createWriteStream(this.output));

      // this will fire when downloading started
      this.video.once('response', () => {
        starttime = Date.now();
        this.setState({ isDownloading: true, downloadBtnProgress: false })
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
        this.setState({ isDownloading: false })
        if(this.state.progress == 100){
          this.snack = true
        }
        this.downloadInitialState()
        this.snack = false
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
        alert("downloading already terminated");
      }
    }
  }



  render() {
    return (
      <div>
        <Card>
          <div style={{ padding: "10px", background: "", display: "flex", alignContent: "center", alignItems: "center" }}>
            {/* <Image src={logo} width="82px" height="33px" style={{ padding: "10px" }} /> */}

            <div style={{ textAlign: "center", width: "100%", display: "flex", justifyContent: "center" }}>
              <input className="url" type="text"  placeholder="Paste URL Here" onChange={this.inputChange} name="urlTxt" value={this.state.urlTxt} /> &nbsp;
              <Button className="btnDownload" variant="contained" size="small" type="button" style={{ color:"white", background:"green" }} > <FontAwesomeIcon icon={faEdit} />&nbsp; Paste</Button> &nbsp;
              <Form.Control className="fileFormat" as="select" placeholder="Select Format" value={this.state.format} onChange={this.inputChange} name="format" disabled={this.state.disableFormat} >
                {/* {this.state.optionList} */}
                <option value="" disabled hidden>- format -</option>
                <option value="mp3">.mp3</option>
                <option value="mp4">.mp4</option>
              </Form.Control>
              <Button className="btnDownload" variant="contained" color="primary" size="small" type="button" onClick={() => this.downloadVideo()} disabled={this.state.disableDownload} > <FontAwesomeIcon icon={faDownload} />&nbsp; Download</Button> &nbsp;
              {this.state.downloadBtnProgress && <CircularProgress style={{ height:"29px", width:"29px" }} />}
            </div>
          </div>

          {this.state.isDownloading &&
          <CardActions style={{ textAlign: "center", width: "100%", display: "flex", justifyContent: "center" }}>
            <p className="progress">Downloading {this.state.downloadedSize}MB/{this.state.totalSize}MB</p>

            <LinearProgress variant="determinate" color="secondary" style={{ width: "500px" }} value={parseFloat(this.state.progress)} />
            <p className="progress">{this.state.progress}%</p><p className="progress">Time Remaining {this.state.estTime} Mins</p>
            <IconButton className="btnDownload" variant="contained" color="secondary" size="small" type="button" onClick={() => this.stopDownloading()}> <FontAwesomeIcon icon={faTrash} /></IconButton>
          </CardActions>
          }
        </Card>

        <Snackbar open={this.snack} autoHideDuration={6000} onClose={() => this.downloadInitialState()}>
          <Alert onClose={() => this.downloadInitialState()} severity="success">
            Downloaded Completed
          </Alert>
        </Snackbar>

      </div>
    );
  }
}

export default Mainview;
