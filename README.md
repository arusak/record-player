Multiple video player
=====================
[![npm version](https://badge.fury.io/js/%40arusak%2Frecord-player.svg)](https://badge.fury.io/js/%40arusak%2Frecord-player)
[![Build status](https://travis-ci.org/arusak/record-player.png?branch=master)](https://travis-ci.org/arusak/record-player)
[![Coverage Status](https://coveralls.io/repos/github/arusak/record-player/badge.svg?branch=master)](https://coveralls.io/github/arusak/record-player?branch=master)

For synchronized playback of multiple video files at once.

Supports any number of streams playing at once. Creates a separate <video> element for each file.
Uses a single set of controls for the whole set of videos.

Is able to start playing videos with different starting positions.

Why
---

This player was created as a part of a video conferencing system.
That system stored all conversations in video files for archiving purposes.
For each conversation, it created as many files as there were participants in
the conversation. The recording of each file started at the moment when the person
joined the conversation. 

So when you wanted to watch archived record, you had to somehow sync the playback of 
several files. That included synchronous start and ability to seek all videos with a single
set of controls. So this tool was created.
 
API
---

### new RecordPlayer(container, [options])

Create an instance of player.

'container' is a HTML element in which you want this player to render

'options' are:

* debug - if _true_: show diagnostic overlay with event history for every video. Default: false.
* log - if _true): do console logging. Default: false.

### load(descriptors)

Load video files into player.

'descriptors' is an array of video descriptors. You usually get it from your video streaming service.

```
{
    url: './sample.webm',
    type: 'video/webm',
    offset: 0
}
```

* 'url' is the path to a file or stream.
* 'type' is optional. This is a mime-type for the loaded file. The browser tries to guess, but sometimes it need help.
* 'offset' is the timestamp (in milliseconds) of a video start. It might be UNIX time or your custom time offset.


### reset

Stop downloading any content and reset all video sources. To be called on component destruction. 

### API usage example
```
let player = new RecordPlayer(document.getElementById('player'), {debug: true});
player.load(recordsList);
```
