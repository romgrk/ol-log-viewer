# ol-log-viewer

![ol-log-viewer](https://raw.githubusercontent.com/romgrk/ol-log-viewer/master/static/viewer-service-control.png)


Features:
 - Choose which processes to show (by name)
 - Choose which error levels to show (e.g. hide all process with no errors)
 - Search through logs
 - `Alt+1` toggles the services control panel (requires the .exe to be started
     in administrator mode)
 - Folding
 - Smart indicators: yellow icon when process runs in 1.2 to 2 times the
     average; red icon when over 2 times the average. (Average is calculated
     only for processes with the same name)


### Install & build:

```
$ git clone https://github.com/romgrk/ol-log-viewer
$ cd ol-log-viewer
$ npm install
$ npm run build-all
```

Will create a `dist/` folder, containing an executable file.

### Start development environment:

```
$ npm run dev
```
