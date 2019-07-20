import Config from './config.js';
import {Utils} from './utils.js';

export class VideoPlayer {
    // onended
    // descriptor
    // isMain
    // el

    constructor() {

    }

    createDom() {
        this.el = Utils.createDomElement('video', 'rp-video', {controls: false});

        if (Config.debugEnabled) {
            this.createDiagnosticElement(this.el);
        }


        if (this.isMain) {
            this.el.addEventListener('timeupdate', evt => this.onTimeUpdate(videoElement, evt));
        }

        let diagnostic = this.createDiagnosticElement(this.el);
        this.el.appendChild(diagnostic);


    }

    init() {

    }

    load() {

    }

    play() {

    }

    pause() {
    }

    /**
     * Create diagnostic overlay for every video
     * Called when options.debug is true
     * @param videoElement
     */
    createDiagnosticElement(videoElement) {
        const add = msg => {
            diagnostic.innerHTML += msg + '<br>';
            diagnostic.scrollTop = diagnostic.scrollHeight - diagnostic.clientHeight;
        };

        const setupOnHoverDiagnosticForElement = el => {
            el.addEventListener('mousemove', evt => {
                diagnostic.style.opacity = '1';
                diagnostic.style.left = evt.clientX + 'px';
            });
            el.addEventListener('mouseleave', () => diagnostic.style.opacity = '0');
        };

        const setupEventLoggingOnElement = el => {
            let evtTypes = ['canplay', 'error', 'seeking', 'seeked', 'playing', 'play', 'stalled', 'waiting', 'pause', 'paused', 'ended'];
            evtTypes.forEach(type => el.addEventListener(type, () => add(type)));
        };

        let diagnostic = Utils.createDomElement('pre', 'rp-diagnostic');
        setupOnHoverDiagnosticForElement(videoElement);
        setupEventLoggingOnElement(videoElement);
        return diagnostic;
    }


}
