# typescript-dci

Brings support for DCI programming to TypeScript. For more information on DCI, see http://fulloo.info.

Documentation is forthcoming. In the meantime, check out the samples/dci folder.

All modifications to the official TypeScript source code are commented with "DCI"


# TypeScript

Scalable JavaScript development with types, classes and modules.

## Install

### Instructions for the in-development version:

1.  Download the zip file of this repository from https://github.com/mbrowne/typescript-dci/archive/master.zip
2.  If you already have typescript installed, you will need to remove the symlink to the existing Typescript compiler
    or else the `npm install` command below will fail. If you installed typescript as a global module in the standard location,
    you can remove the existing symlink by running:
    
    `rm /usr/local/bin/tsc`

3.  Unzip the downloaded file:

    `unzip typescript-dci-master.zip`

4.  Install it as a global node.js module (note: on some systems you may need to prefix this command with `sudo`):

    `npm install -g typescript-dci-master`


### Coming Soon:
  npm install -g typescript-dci

## Usage

	tsc --module commonjs index.ts
or:

	tsc --module amd index.ts

If you want TypeScript to watch for changes and recompile whenever you save a source file, add the `-w` option, e.g.:

	tsc -w --module commonjs index.ts

The `--module` flag is required when using DCI because some features are achieved at runtime, so the `typescript-dci/dci` module
needs to be available to every DCI program. For server-side or desktop programs, use `--module commonjs` and it should work out of the box.

To generate client-side code that will run in the browser, use `--module amd` to compile your project into [AMD](http://requirejs.org/docs/whyamd.html)
modules. You will also need to ensure that your project has access to the `typescript-dci/dci` module. To do this, copy the
file `typescript-dci/dci/dci-amd.js` to your project as `typescript-dci/dci.js` (relative to
the root directory of your project). In the future this process will be simplified.

In order to run the client-side code you will need an AMD loader. Some good AMD loaders include:

- [curl](https://github.com/cujojs/curl) (not to be confused with the command-line tool of the same name)
- [RequireJS](http://requirejs.org/)

(curl is listed first because it is more lightweight, but both are excellent projects.)

Some AMD projects also provide a bundling tool that makes it possible to combine all your modules into one or more minified files,
in order to optimize your app for production. For example, [curl](https://github.com/cujojs/curl) has a companion project
[cram](https://github.com/cujojs/cram/tree/master/docs).


## Build

1.  Install Node if you haven't already (http://nodejs.org/)
2.  Install Jake, the tool we use to build our compiler (https://github.com/mde/jake). To do this, run "npm install -g jake".
3.  To use jake, run one of the following commands: 
    - jake local - This builds the compiler. The output is in built/local in the public directory 
    - jake clean - deletes the build compiler 
    - jake LKG - This replaces the LKG (last known good) version of the compiler with the built one.
        - This is a bootstrapping step to be executed whenever the built compiler reaches a stable state.
    - jake tests - This builds the test infrastructure, using the built compiler. 
    - jake runtests - This runs the tests, using the built compiler and built test infrastructure. 
        - You can also override the host or specify a test for this command. Use host=<hostName> or tests=<testPath>. 
    - jake baseline-accept - This replaces the baseline test results with the results obtained from jake runtests. 
    - jake -T lists the above commands. 
