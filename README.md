# parcel-plugin-run-server

A [Parcel](https://parceljs.org/) plugin to start (and restart) a server while running parcel in watch mode

## Why?

If using Parcel to build a node application (using `--target=node`) it's useful to have the server restart whenever there a change is made.

_This plugin will only if parce is ran in `watch` mode with a `target` of `node`_

## Getting Started

Via NPM

```
npm i -D parcel-plugin-run-server
```

Via Yarn

```
yarn add --dev parcel-plugin-run-server
```

## Configuration

Currently the plugin does not need any configuration. (Zero Config 🎉)

## Usage

The plugin will run the file specified using `--out-file` using `node --inspect`.
