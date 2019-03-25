import {Seeker} from './seeker.js';

export class RecordPlayer {
    constructor(container) {
        this.videoElements = [];

        this.wrapper = Object.assign(document.createElement('div'), {className: 'wrapper'});
        container.appendChild(this.wrapper);

        this.scene = Object.assign(document.createElement('div'), {className: 'scene'});
        this.wrapper.appendChild(this.scene);

        this.createControls();
    }

    load(metadata) {
        this.seeker.reset();
        this.setup(metadata);
        this.adjustNumberOfScreens(metadata.length);
        this.seeker.setDuration(this.duration);
        this.createSources().then(() => this.setVideoPositions());
    }

    setup(metadata) {
        this.metadata = metadata;
        this.startTime = Math.max(...metadata.map(m => m.start));
        this.endTime = Math.min(...metadata.map(m => m.end));
        this.duration = this.endTime - this.startTime;
        this.metadata.forEach(video => video.skip = this.startTime - video.start);
    }

    adjustNumberOfScreens(number) {
        if (number > this.videoElements.length) {
            for (let i = this.videoElements.length; i < number; i++) {
                let videoEl = this.createVideoElement(i === 0);
                this.videoElements.push(videoEl);
                this.scene.appendChild(videoEl);
            }
        } else if (number < this.videoElements.length) {
            this.videoElements.filter((v, idx) => idx < number)
                .forEach(v => v.style.display = 'none');
        }
    }

    createControls() {
        this.controls = Object.assign(document.createElement('div'), {className: 'controls'});
        this.wrapper.appendChild(this.controls);

        this.button = Object.assign(document.createElement('div'), {className: 'button play'});
        this.button.addEventListener('click', () => {
            if (this.button.classList.contains('play')) {
                this.play();
            } else {
                this.pause();
            }
        });
        this.controls.appendChild(this.button);

        this.seeker = new Seeker();
        this.controls.appendChild(this.seeker.getNode());
    }

    play() {
        // todo move button modification to caller
        this.button.setAttribute('disabled', 'disabled');
        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            console.log('readyState: ' + videoElement.readyState);
            // todo start synchronously when every video is ready
            if (videoElement.readyState >= 3) {
                videoElement.play().then(() => {
                    this.button.removeAttribute('disabled');
                    this.button.classList.add('pause');
                    this.button.classList.remove('play');
                });
            }
        }
    }

    pause() {
        this.button.classList.remove('pause');
        this.button.classList.add('play');
        this.videoElements.forEach(vel => vel.pause());
    }

    setVideoPositions() {
        let pos = this.seeker.getPosition();
        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            videoElement.currentTime = (this.metadata[i].skip + pos) / 1000;
            console.log('Setting element position to ' + videoElement.currentTime);
        }

    }

    resetSources(video) {
        for (let s of video.getElementsByTagName('source')) {
            s.remove();
        }
    }

    /**
     * Create video sources from links provided in metadata
     * @return Promise promise of metadata for all videos loaded
     */
    createSources() {
        let q = [];
        this.videoElements.forEach((v, i) => {
            q.push(new Promise((resolve) => {
                function onLoad() {
                    resolve();
                    v.removeEventListener(onLoad);
                }

                this.resetSources(v);
                let source = Object.assign(document.createElement('source'), {
                    src: this.metadata[i].url,
                    type: this.metadata[i].type
                });
                v.appendChild(source);
                v.addEventListener('loadedmetadata', onLoad);
            }));
        });
        return Promise.all(q);
    }

    /**
     * Create <video>
     * @param main is main video element (from which we get position)
     * @return HTMLElement
     */
    createVideoElement(main) {
        let video = Object.assign(document.createElement('video'), {controls: true});
        if (main) {
            video.addEventListener('timeupdate', evt => this.onTimeUpdate(video, evt));
        }
        return video;
    }

    onTimeUpdate(videoElement) {
        console.log(videoElement.currentTime);
        console.log(videoElement.currentTime * 1000 - this.metadata[0].skip);
        this.seeker.setPosition(videoElement.currentTime * 1000 - this.metadata[0].skip);
    }
}