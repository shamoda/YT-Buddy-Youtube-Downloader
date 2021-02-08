/* eslint-disable prettier/prettier */
import fs from 'fs';
import ytdl from 'ytdl-core';

class Server{
    downloadVideo = (url) => {
        ytdl(url, { format: 'mp4' }).pipe(fs.createWriteStream('video.mp4'));
    }
}



export default new Server();
