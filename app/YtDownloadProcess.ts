import {ChildProcessWithoutNullStreams} from 'child_process';
import {app, WebContents} from 'electron';
import * as path from 'path';
import YTDlpWrap from 'yt-dlp-wrap';
var ffmpeg = require('ffmpeg-static-electron');

export class YtDownloadProcess {
    public process: ChildProcessWithoutNullStreams;
    private yTDlpWrap = new YTDlpWrap(path.join(__dirname, 'yt-dlp/yt-dlp').replace('app.asar', 'app.asar.unpacked'));

    constructor(public uuid: string,
        private link: string,
        private sender: WebContents,
        private downloadVideo = false) {
        this.getInfo().then((hasInfo) => {
            if (hasInfo) {
                this.start();
            }
        });
    }

    private async getInfo(): Promise<boolean> {
        return this.yTDlpWrap.execPromise([
            this.link,
            '--print-json',
            '--skip-download'
        ]).then((info) => {
            let parsedInfo = JSON.parse(info);
            this.sender.send('ytDownload-info', {
                uuid: this.uuid,
                title: parsedInfo.title,
                thumbnail: parsedInfo.thumbnail
            });
            return true;
        }).catch(() => {
            this.sender.send('ytDownload-error', {
                uuid: this.uuid,
                error: 'Information could not be retrieved'
            });
            return false;
        });
    }

    private downloadError(err: any): void {
        this.sender.send('ytDownload-error', {
            uuid: this.uuid,
            error: 'Error while downloading/transcoding'
        });
    }

    public abort(): void {
        if (this.process) {
            this.process.kill('SIGKILL');
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
        let config = [
            this.link,
            '--ffmpeg-location',
            ffmpeg.path.replace('app.asar', 'app.asar.unpacked'),
            '--output',
            path.join(app.getPath('downloads'), '/').concat('%(title)s.%(ext)s')
        ];

        if (this.downloadVideo) {
            config.push('--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio');
            config.push('--merge-output-format', 'mp4');
        } else {
            config.push('--extract-audio', true);
            config.push('--audio-format', 'mp3');
        }
        const exec = this.yTDlpWrap.exec(config)
            .on('error', () => this.downloadError)
            .on('ytDlpEvent', (ytDlpEvent) => {
                if (ytDlpEvent.includes('ExtractAudio') || ytDlpEvent.includes('Merger')) {
                    this.sender.send('ytDownload-transcoding', {
                        uuid: this.uuid
                    })
                }
            })
            .on('progress', (data) => {
                this.sender.send('ytDownload-download', {
                    uuid: this.uuid,
                    process: data.percent
                })
            });
        this.process = exec.ytDlpProcess.on('close', () => {
            this.downloadFinished();
        });
    }
}
