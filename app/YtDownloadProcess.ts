
import {app, WebContents} from 'electron';
import {ExecaChildProcess} from 'execa';
import * as path from 'path';
import * as youtubeDL from 'youtube-dl-exec';
const ytDLLib = youtubeDL.create(path.join(__dirname, '/node_modules/youtube-dl-exec/bin/youtube-dl'));
var ffmpeg = require('ffmpeg-static-electron');

export class YtDownloadProcess {
    public process: ExecaChildProcess;
    private transcodingStarted = false;
    public processPercent = 0;

    constructor(public uuid: string,
        private link: string,
        private sender: WebContents,
        private downloadVideo = false) {
        this.getInfo();
    }

    private async getInfo(): Promise<void> {
        try {
            const info = await ytDLLib(this.link, {
                printJson: true,
                skipDownload: true
            });
            this.sender.send('ytDownload-info', {
                uuid: this.uuid,
                title: info.title,
                thumbnail: info.thumbnail
            });
            this.start();
        } catch {
            this.sender.send('ytDownload-error', {
                uuid: this.uuid,
                error: 'Could not retrieve video information'
            });
        }
    }

    private downloadError(): void {
        this.sender.send('ytDownload-error', {
            uuid: this.uuid,
            error: 'Error while downloading/transcoding'
        });
    }

    private downloadProcess(processText: string): void {
        if (this.transcodingStarted) {
            this.transcodingStarted = false;
            this.downloadFinished();
        }
        if (processText.includes('[download]')) {
            let processPercent = processText.match(/([0-9]){1,3}([.])?([0-9]){1,3}?([%])/g);
            this.processPercent = processPercent ? parseFloat(processPercent[0]) : this.processPercent;
            this.sender.send('ytDownload-download', {
                uuid: this.uuid,
                process: this.processPercent
            })
        }
        if (processText.includes('[ffmpeg]')) {
            this.transcodingStarted = true;
            this.sender.send('ytDownload-transcoding', {
                uuid: this.uuid
            })
        }
    }

    public abort(): void {
        if (this.process) {
            this.process.cancel()
        }
        delete this.process;
    }

    private downloadFinished(): void {
        this.sender.send('ytDownload-finished', {
            uuid: this.uuid
        })
        delete this.process;
    }

    private start(): void {
        let config = {
            ffmpegLocation: ffmpeg.path,
            noCallHome: true,
            output: path.join(app.getPath('downloads'), '/').concat('%(title)s.%(ext)s')
        } as youtubeDL.YtFlags;
        if (this.downloadVideo) {
            config.format = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio';
            config.mergeOutputFormat = 'mp4';
        } else {
            config.extractAudio = true;
            config.audioFormat = 'mp3';
        }
        this.process = ytDLLib.exec(this.link, config, {encoding: 'utf-8'});

        this.process.stderr.on('data', () => this.downloadError);

        this.process.stdout.on('data', (processData) => {
            let processText = '';
            processData.forEach((num) => {
                processText += (String.fromCharCode(num));
            });
            this.downloadProcess(processText);
        });
    }
}
