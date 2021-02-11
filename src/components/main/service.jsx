/* eslint-disable prettier/prettier */
// import fs from 'fs';
import ytdl from 'ytdl-core';
// import youtube from 'simple-youtube-api'

class Service{
    async getFormats (url) {
        // ytdl.getBasicInfo(url).then(info => {
        //   console.log('formats:', info.formats)
        // })
        let info = await ytdl.getInfo(url);
        let audioFormats = ytdl.chooseFormat(info.formats, {quality:'highest'});
        console.log(audioFormats);
    }
}



export default new Service();
