import {Seeker} from './seeker.js';
import {Utils} from './utils.js';

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
        // todo move button modification elsewhere
        this.button.setAttribute('disabled', 'disabled');

        this.waitAll('play').then(() => {
            this.button.removeAttribute('disabled');
            this.button.classList.add('pause');
            this.button.classList.remove('play');
        });

        let q = [];

        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            console.log('readyState: ' + videoElement.readyState);

            Promise.all(q).then(() => videoElement.play());

            q.push(new Promise(resolve => {
                if (videoElement.readyState >= 3) {
                    resolve();
                } else {
                    Utils.one(videoElement, 'playing', resolve);
                }
            }));
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
                Utils.one(v, evtName, resolve);
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
        let videoElement = Object.assign(document.createElement('video'), {controls: false});
        if (main) {
            videoElement.addEventListener('timeupdate', evt => this.onTimeUpdate(videoElement, evt));
        }
        this.setupDiagnostic(videoElement);
        return videoElement;
    }

    setupDiagnostic(videoElement) {
        let diagnostic = Object.assign(document.createElement('pre'), {className: 'diagnostic'});
        videoElement.addEventListener('mousemove', evt => {
            diagnostic.style.opacity = '1';
            diagnostic.style.left = evt.clientX + 'px';
        });
        videoElement.addEventListener('mouseleave', () => diagnostic.style.opacity = '0');

        function add(msg) {
            diagnostic.innerHTML += msg + '<br>';
            diagnostic.scrollTop = diagnostic.scrollHeight - diagnostic.clientHeight;
        }

        videoElement.addEventListener('canplay', () => add('canplay'));
        videoElement.addEventListener('error', () => add('error'));
        videoElement.addEventListener('seeking', () => add('seeking'));
        videoElement.addEventListener('seeked', () => add('seeked'));
        videoElement.addEventListener('playing', () => add('playing'));
        videoElement.addEventListener('play', () => add('play'));
        videoElement.addEventListener('stalled', () => add('stalled'));
        // videoElement.addEventListener('suspend', () => add('suspend'));
        videoElement.addEventListener('waiting', () => add('waiting'));

        document.body.appendChild(diagnostic);
    }

    onTimeUpdate(videoElement) {
        console.log(videoElement.currentTime);
        console.log(videoElement.currentTime * 1000 - this.descriptors[0].skip);
        this.seeker.setPosition(videoElement.currentTime * 1000 - this.descriptors[0].skip);
    }
}