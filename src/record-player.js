import {Seeker} from './seeker.js';
import {Utils} from './utils.js';
import {PlayButton} from './play-button.js';
import Config from './config.js';

import './styles/record-player.css';
import './styles/seeker.css';
import './styles/play-button.css';
import './styles/scene.css';

export class RecordPlayer {
    constructor(container, options) {
        Config.init(options);
        this.createDom(container);
    }

    createDom(container) {
        this.wrapper = Utils.createDomElement('div', 'rp-player');
        container.appendChild(this.wrapper);

        this.scene = this.createScene();
        this.wrapper.appendChild(this.scene);

        this.controls = this.createControls();
        this.wrapper.appendChild(this.controls);

        this.scene.addEventListener('click', () => {
            this.playButton.el.dispatchEvent(new MouseEvent('click'));
        });
    }

    /**
     * Load videos into <video> elements
     * @param descriptors
     */
    load(descriptors) {
        this.descriptors = descriptors;

        this.seeker.startLoading();
        this.sceneStartLoading();
        this.setupPlaybackFromDescriptors(descriptors);

        this.seeker.setPosition(0);

        this.adjustNumberOfScreens(descriptors.length);

        this.waitForCanPlayAll().then(() => {
            this.sceneEndLoading();
        });

        this.loadMedia().then(() => {
            this.seeker.setDuration(this.getPlaybackLengthInMs());
            this.seeker.endLoading();

            // forcing videos to have equal height
            this.videoElements.forEach(videoElement => {
                videoElement.parentElement.style.flex = `${videoElement.videoWidth / videoElement.videoHeight}`;
            });
            this.seek(0);
        });
    }

    /**
     * Calculates the duration of all videos' common time
     * (after the last video start and before first video end)
     * @return {number} milliseconds
     */
    getPlaybackLengthInMs() {
        // offsets are moments when videos start
        let starts = this.descriptors.map(descriptor => descriptor.offset);
        // the moment when video ends is the sum of its length and offset
        let ends = this.videoElements.map((videoElement, idx) => videoElement.duration * 1000 + this.descriptors[idx].offset);
        // duration is length between last start and first end of a video
        return Math.min(...ends) - Math.max(...starts);
    }

    /**
     * Setup playback basing on descriptors
     */
    setupPlaybackFromDescriptors(descriptors) {
        let maxOffset = Math.max(...descriptors.map(video => video.offset));
        descriptors.forEach(video => video.skip = maxOffset - video.offset);
    }

    /**
     * Creates a necessary number of <video> elements
     * @param number
     */
    adjustNumberOfScreens(number) {
        this.videoElements = this.videoElements || [];

        if (number > this.videoElements.length) {
            for (let i = this.videoElements.length; i < number; i++) {
                let videoEl = this.createVideoElement(i === 0);
                let videoWrapper = Utils.createDomElement('div', 'rp-video-wrapper');
                videoWrapper.appendChild(videoEl);

                this.videoElements.push(videoEl);
                this.scene.appendChild(videoWrapper);
            }
        } else if (number < this.videoElements.length) {
            this.videoElements = this.videoElements.slice(0, number);
        }
    }

    /**
     * Create scene for all videos with loader
     */
    createScene() {
        let scene = Utils.createDomElement('div', 'rp-scene');

        let curtain = Utils.createDomElement('div', 'rp-scene__loader');
        scene.append(curtain);

        let spinner = Utils.createDomElement('div', 'rp-scene__loader__spinner');
        curtain.append(spinner);

        return scene;
    }

    sceneStartLoading() {
        this.scene.querySelector('.rp-scene__loader').style.display = 'flex';
    }

    sceneEndLoading() {
        this.scene.querySelector('.rp-scene__loader').style.display = 'none';
    }

    /**
     * Create play/pause playButton and position seeker
     */
    createControls() {
        let controls = Utils.createDomElement('div', 'rp-controls');

        this.playButton = this.createPlayButton();
        controls.appendChild(this.playButton.el);

        this.seeker = this.createSeeker();
        controls.appendChild(this.seeker.getNode());

        return controls;
    }

    createPlayButton() {
        return new PlayButton(this.play.bind(this), this.pause.bind(this));
    }

    createSeeker() {
        return new Seeker(this.seek.bind(this));
    }

    /**
     * Synchronously play all video files
     */
    play() {
        // rewind when user clicks play on ended scene
        this.goToStartIfEnded();
        this.disablePlayButtonUntilPlaybackStarts();
        this.waitForCanPlayAll().then(() => {
            this.videoElements.forEach(e => e.play());
        });
    }

    pause() {
        this.playButton.showPlayIcon();
        this.videoElements.forEach(videoElement => videoElement.pause());
    }

    goToStartIfEnded() {
        if (this.ended) {
            this.ended = false;
            this.seek(0);
        }
    }

    waitForCanPlayAll() {
        let canPlayPromises = this.videoElements.map(videoElement => {
            return new Promise(resolve => {
                if (videoElement.readyState >= 3) {
                    resolve();
                } else {
                    Utils.one(videoElement, 'canplay', resolve);
                }
            });
        });

        return Promise.all(canPlayPromises);
    }

    disablePlayButtonUntilPlaybackStarts() {
        this.playButton.disable();

        this.waitAll('play').then(() => {
            this.playButton.enable();
            this.playButton.showPauseIcon();
        });
    }

    /**
     * Go to specific time
     * If video was playing, pauses it and resumes after successful seeking.
     *
     * @param targetInMs
     * @return promise of seek completed
     */
    seek(targetInMs) {
        this.playButton.disable();

        this.ended = false;
        let wasPaused = this.videoElements[0].paused;

        let allSeekedPromise = this.waitAll('seeked').then(() => {
            // when seek on all files is ended, resume playing if needed
            if (!wasPaused) {
                this.play();
            }
            this.playButton.enable();
        });

        this.videoElements.forEach((videoElement, idx) => {
            videoElement.pause();
            videoElement.currentTime = (this.descriptors[idx].skip + targetInMs) / 1000;
        });

        return allSeekedPromise;
    }

    /**
     * Stop downloading everything by removing sources
     * You need to load() after this to play something
     */
    reset() {
        if (!this.videoElements) return;
        this.videoElements.forEach(Utils.resetMediaSources);
    }

    /**
     * Create video sources from links provided in metadata
     * @return Promise promise of metadata for all videos loaded
     */
    loadMedia() {
        const goToEndOnVideoEnded = videoElement => {
            videoElement.addEventListener('ended', () => {
                this.pause();
                this.seeker.setPosition(this.getPlaybackLengthInMs());
                this.ended = true;
            })
        };

        const addVideoSource = (videoElement, descriptor) => {
            if (descriptor.url) {
                let source = Utils.createDomElement('source', '', {src: descriptor.url});

                if (descriptor.type) {
                    source.type = descriptor.type;
                }

                videoElement.appendChild(source);
            }
        };

        // first we create promise which awaits all video elements to load metadata
        let allMetadataLoadedPromise = this.waitAll('loadedmetadata');

        // then we initiate loading of files
        this.videoElements.forEach((videoElement, idx) => {
            Utils.resetMediaSources(videoElement);
            addVideoSource(videoElement, this.descriptors[idx]);
            goToEndOnVideoEnded(videoElement);
        });

        return allMetadataLoadedPromise;
    }

    /**
     * Wait for an event to fire on all the video elements
     * @param evtName what event to catch
     * @return {Promise} resolved when the event is fired on every video element
     */
    waitAll(evtName) {
        let awaitedPromises = this.videoElements.map(videoElement =>
            new Promise(resolve =>
                Utils.one(videoElement, evtName, resolve)));

        // return promise and do some logging
        return Promise.all(awaitedPromises).then(() =>
            Utils.log(`All ${evtName.toUpperCase()} now`));
    }

    /**
     * Create <video>
     * @param main is main video element (from which we get position)
     * @return HTMLElement
     */
    createVideoElement(main) {
        let videoElement = Utils.createDomElement('video', 'rp-video', {controls: false});

        if (main) {
            videoElement.addEventListener('timeupdate', evt => this.onTimeUpdate(videoElement, evt));
        }

        if (Config.debugEnabled) {
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
        const add = msg => {
            diagnostic.innerHTML += msg + '<br>';
            diagnostic.scrollTop = diagnostic.scrollHeight - diagnostic.clientHeight;
        };

        let diagnostic = Utils.createDomElement('pre', 'rp-diagnostic');
        videoElement.addEventListener('mousemove', evt => {
            diagnostic.style.opacity = '1';
            diagnostic.style.left = evt.clientX + 'px';
        });
        videoElement.addEventListener('mouseleave', () => diagnostic.style.opacity = '0');

        let evtTypes = ['canplay', 'error', 'seeking', 'seeked', 'playing', 'play', 'stalled', 'waiting', 'pause', 'paused', 'ended'];
        evtTypes.forEach(type => videoElement.addEventListener(type, () => add(type)));

        this.wrapper.appendChild(diagnostic);
    }

    onTimeUpdate(videoElement) {
        if (!this.ended) {
            let seekerTime = videoElement.currentTime * 1000 - this.descriptors[0].skip;
            Utils.log('Main <video> time', videoElement.currentTime + 's', 'Seeker time', seekerTime + 'ms');
            this.seeker.setPosition(seekerTime);
        } else {
            Utils.log('Tried to update seeker of stopped scene');
        }
    }
}

