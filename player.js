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

    /**
     * Load videos into <video> elements
     * @param descriptors
     */
    load(descriptors) {
        this.descriptors = descriptors;
        this.seeker.reset();

        this.setup(descriptors);
        this.adjustNumberOfScreens(descriptors.length);
        this.createSources().then(() => {
            this.seeker.setDuration(this.duration);
            this.setVideoPositions(0);
        });
    }

    /**
     * Setup playback basing on metadata
     */
    setup() {
        this.startTime = Math.max(...this.descriptors.map(m => m.start));
        this.endTime = Math.min(...this.descriptors.map(m => m.end));
        this.duration = this.endTime - this.startTime;
        this.descriptors.forEach(video => video.skip = this.startTime - video.start);
    }

    /**
     *
     * @param number
     */
    adjustNumberOfScreens(number) {
        if (number > this.videoElements.length) {
            for (let i = this.videoElements.length; i < number; i++) {
                let videoEl = this.createVideoElement(i === 0);
                this.videoElements.push(videoEl);
                this.scene.appendChild(videoEl);
            }
        } else if (number < this.videoElements.length) {
            this.videoElements = this.videoElements.slice(0, number);
        }
    }

    /**
     * Create play/pause button and position seeker
     */
    createControls() {
        this.controls = Object.assign(document.createElement('div'), {className: 'controls'});
        this.wrapper.appendChild(this.controls);

        this.button = Object.assign(document.createElement('button'), {className: 'button play'});
        this.button.addEventListener('click', () => {
            if (this.button.classList.contains('play')) {
                this.play();
            } else {
                this.pause();
            }
        });
        this.controls.appendChild(this.button);

        this.seeker = new Seeker(this.seek.bind(this));
        this.controls.appendChild(this.seeker.getNode());
    }

    play() {
        // todo move button modification to caller
        this.button.setAttribute('disabled', 'disabled');

        this.waitAll('play').then(() => {
            this.button.removeAttribute('disabled');
            this.button.classList.add('pause');
            this.button.classList.remove('play');
        });

        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            console.log('readyState: ' + videoElement.readyState);
            // todo start synchronously when every video is ready
            if (videoElement.readyState >= 3) {
                videoElement.play();
            }
        }
    }

    pause() {
        this.button.classList.remove('pause');
        this.button.classList.add('play');
        this.videoElements.forEach(vel => vel.pause());
    }

    setVideoPositions(pos) {
        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            videoElement.currentTime = (this.descriptors[i].skip + pos) / 1000;
            console.log('Setting element position to ' + videoElement.currentTime);
        }
    }

    seek(target) {
        this.button.setAttribute('disabled', 'disabled');

        let wasPaused = this.videoElements[0].paused;

        this.waitAll('seeked').then(() => {
            if (!wasPaused) {
                this.play();
            }
            this.button.removeAttribute('disabled');
        });

        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            videoElement.pause();
            videoElement.currentTime = (this.descriptors[i].skip + target) / 1000;
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
        let p = this.waitAll('loadedmetadata');

        this.videoElements.forEach((v, i) => {
            this.resetSources(v);

            let source = Object.assign(document.createElement('source'), {
                src: this.descriptors[i].url,
                type: this.descriptors[i].type
            });
            v.appendChild(source);
        });

        return p;
    }

    waitAll(evtName) {
        let q = [];
        this.videoElements.forEach(v => {
            q.push(new Promise((resolve) => {
                function one() {
                    resolve();
                    v.removeEventListener(evtName, one);
                }

                v.addEventListener(evtName, one);
            }));
        });
        return Promise.all(q).then(() => console.log(`All ${evtName} now`));
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
            video.addEventListener('seeking', () => console.log('seeking'));
            video.addEventListener('seeked', () => console.log('seeked'));
        }
        return video;
    }

    onTimeUpdate(videoElement) {
        console.log(videoElement.currentTime);
        console.log(videoElement.currentTime * 1000 - this.descriptors[0].skip);
        this.seeker.setPosition(videoElement.currentTime * 1000 - this.descriptors[0].skip);
    }
}