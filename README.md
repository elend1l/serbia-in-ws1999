# World Stage Survey

This version includes a CyTube-inspired custom HTML5 player with play/pause, seek, volume, CC, playback speed and fullscreen. English VTT subtitles are enabled automatically.

## Configure
Edit `config.js` with the four titles, local/S3 MP4 URLs, VTT URLs, and Google Apps Script `/exec` URL.

For local testing you can use paths such as:
`media/song1.mp4`
`media/song1.vtt`

Run locally with:
`python -m http.server 8000`
then visit `http://localhost:8000/`.

## Google Apps Script
Keep `google-apps-script.gs` out of the public GitHub repository. Put the backend code in the private Google Sheet's Apps Script project.

The Google Sheet should have `Responses` and `Settings` tabs. `Settings!B2` controls `OPEN`/`CLOSED`; `Settings!B3` can contain an optional automatic closing date/time.
