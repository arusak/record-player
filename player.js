import {Seeker} from './seeker.js';
import {Utils} from './utils.js';

export class RecordPlayer {
    constructor(container, options) {
        this.videoElements = [];
        this.options = options;

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

        this.setupPlayback(descriptors);
        this.adjustNumberOfScreens(descriptors.length);
        this.createSources().then(() => {
            this.seeker.setDuration(this.duration);
            this.seek(0);
        });
    }

    /**
     * Setup playback basing on metadata
     */
    setupPlayback(descriptors) {
        this.startTime = Math.max(...descriptors.map(m => m.start));
        this.endTime = Math.min(...descriptors.map(m => m.end));
        this.duration = this.endTime - this.startTime;
        descriptors.forEach(video => video.skip = this.startTime - video.start);
    }

    /**
     * Creates a necessary number of <video> elements
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

    /**
     * Synchronously play all video files
     */
    play() {
        this.tuneButton({enabled: false});

        this.waitAll('play').then(() => {
            this.tuneButton({enabled: true, playing: true});
        });

        let q = [];

        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            this.log('readyState: ' + videoElement.readyState);

            Promise.all(q).then(() => videoElement.play());

            q.push(new Promise(resolve => {
                if (videoElement.readyState >= 3) {
                    resolve();
                } else {
                    Utils.one(videoElement, 'canplay', resolve);
                }
            }));
        }
    }

    pause() {
        this.tuneButton({playing: false});
        this.videoElements.forEach(vel => vel.pause());
    }

    /**
     * Go to specific time
     * If video was playing, pauses it and resumes after successful seeking.
     *
     * @param target
     */
    seek(target) {
        this.tuneButton({enabled: false});

        let wasPaused = this.videoElements[0].paused;

        this.waitAll('seeked').then(() => {
            if (!wasPaused) {
                this.play();
            }
            this.tuneButton({enabled: true});
        });

        for (let i = 0; i < this.videoElements.length; i++) {
            let videoElement = this.videoElements[i];
            videoElement.pause();
            videoElement.currentTime = (this.descriptors[i].skip + target) / 1000;
        }
    }


    /**
     * Create video sources from links provided in metadata
     * @return Promise promise of metadata for all videos loaded
     */
    createSources() {
        let p = this.waitAll('loadedmetadata');

        this.videoElements.forEach((videoElement, idx) => {
            Utils.resetMediaSources(videoElement);

            let source = Object.assign(document.createElement('source'), {
                src: this.descriptors[idx].url,
                type: this.descriptors[idx].type
            });
            videoElement.appendChild(source);
        });

        return p;
    }

    /**
     * Wait for an event to fire on all the video elements
     * @param evtName what event to catch
     * @return {Promise} resolved when the event is fired on every video element
     */
    waitAll(evtName) {
        let q = [];
        this.videoElements.forEach(videoElement => {
            q.push(new Promise((resolve) => {
                Utils.one(videoElement, evtName, resolve);
            }));
        });
        return Promise.all(q).then(() => this.log(`All ${evtName.toUpperCase()} now`));
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

        if (this.options.debug) {
            this.setupDiagnostic(videoElement);
        }

        return videoElement;
    }

    /**
     * Create diagnostic overlay for every video
     * Called when options.debug is true
     * @param videoElement
     */
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
        let seekerTime = videoElement.currentTime * 1000 - this.descriptors[0].skip;
        this.log('Main <video> time', videoElement.currentTime + 's', 'Seeker time', seekerTime + 'ms');
        this.seeker.setPosition(seekerTime);
    }

    /**
     * Sets button state
     * @param enabled if true, removes disabled state. If false, adds it. Otherwise, does nothing with disabled state
     * @param playing if true, sets class for pause icon. If false, set class for play icon. Otherwise, does nothing with classes
     */
    tuneButton({enabled, playing}) {
        if (enabled === true) {
            this.button.removeAttribute('disabled');
        } else if (enabled === false) {
            this.button.setAttribute('disabled', 'disabled');
        }

        if (playing === true) {
            this.button.classList.add('pause');
            this.button.classList.remove('play');
        } else if (playing === false) {
            this.button.classList.remove('pause');
            this.button.classList.add('play');
        }
    }

    log(...msgs) {
        if (this.options.log) {
            console.log('[RecordPlayer]', ...msgs);
        }
    }
}

