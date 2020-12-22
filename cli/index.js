#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-implicit-dependencies */
const React = require("react");
const server_1 = require("react-dom/server");
const styled_components_1 = require("styled-components");
const handlebars_1 = require("handlebars");
const http_1 = require("http");
const path_1 = require("path");
const zlib = require("zlib");
// @ts-ignore
const redoc_1 = require("redoc");
const chokidar_1 = require("chokidar");
const fs_1 = require("fs");
const mkdirp = require("mkdirp");
const YargsParser = require("yargs");
const BUNDLES_DIR = path_1.dirname(require.resolve('redoc'));
/* tslint:disable-next-line */
YargsParser.command('serve <spec>', 'start the server', yargs => {
    yargs.positional('spec', {
        describe: 'path or URL to your spec',
    });
    yargs.options('title', {
        describe: 'Page Title',
        type: 'string',
    });
    yargs.option('s', {
        alias: 'ssr',
        describe: 'Enable server-side rendering',
        type: 'boolean',
    });
    yargs.option('p', {
        alias: 'port',
        type: 'number',
        default: 8080,
    });
    yargs.option('w', {
        alias: 'watch',
        type: 'boolean',
    });
    yargs.demandOption('spec');
    return yargs;
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        ssr: argv.ssr,
        title: argv.title,
        watch: argv.watch,
        templateFileName: argv.template,
        templateOptions: argv.templateOptions || {},
        redocOptions: getObjectOrJSON(argv.options),
    };
    console.log(config);
    try {
        yield serve(argv.port, argv.spec, config);
    }
    catch (e) {
        handleError(e);
    }
}))
    .command('bundle <spec>', 'bundle spec into zero-dependency HTML-file', yargs => {
    yargs.positional('spec', {
        describe: 'path or URL to your spec',
    });
    yargs.option('o', {
        describe: 'Output file',
        alias: 'output',
        type: 'string',
        default: 'redoc-static.html',
    });
    yargs.options('title', {
        describe: 'Page Title',
        type: 'string',
    });
    yargs.options('disableGoogleFont', {
        describe: 'Disable Google Font',
        type: 'boolean',
        default: false,
    });
    yargs.option('cdn', {
        describe: 'Do not include ReDoc source code into html page, use link to CDN instead',
        type: 'boolean',
        default: false,
    });
    yargs.demandOption('spec');
    return yargs;
}, (argv) => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        ssr: true,
        output: argv.o,
        cdn: argv.cdn,
        title: argv.title,
        disableGoogleFont: argv.disableGoogleFont,
        templateFileName: argv.template,
        templateOptions: argv.templateOptions || {},
        redocOptions: getObjectOrJSON(argv.options),
    };
    try {
        yield bundle(argv.spec, config);
    }
    catch (e) {
        handleError(e);
    }
}))
    .demandCommand()
    .options('t', {
    alias: 'template',
    describe: 'Path to handlebars page template, see https://git.io/vh8fP for the example ',
    type: 'string',
})
    .options('templateOptions', {
    describe: 'Additional options that you want pass to template. Use dot notation, e.g. templateOptions.metaDescription',
})
    .options('options', {
    describe: 'ReDoc options, use dot notation, e.g. options.nativeScrollbars',
}).argv;
function serve(port, pathToSpec, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let spec = yield redoc_1.loadAndBundleSpec(pathToSpec);
        let pageHTML = yield getPageHTML(spec, pathToSpec, options);
        const server = http_1.createServer((request, response) => {
            console.time('GET ' + request.url);
            if (request.url === '/redoc.standalone.js') {
                respondWithGzip(fs_1.createReadStream(path_1.join(BUNDLES_DIR, 'redoc.standalone.js'), 'utf8'), request, response, {
                    'Content-Type': 'application/javascript',
                });
            }
            else if (request.url === '/') {
                respondWithGzip(pageHTML, request, response, {
                    'Content-Type': 'text/html',
                });
            }
            else if (request.url === '/spec.json') {
                const specStr = JSON.stringify(spec, null, 2);
                respondWithGzip(specStr, request, response, {
                    'Content-Type': 'application/json',
                });
            }
            else {
                response.writeHead(404);
                response.write('Not found');
                response.end();
            }
            console.timeEnd('GET ' + request.url);
        });
        console.log();
        server.listen(port, () => console.log(`Server started: http://127.0.0.1:${port}`));
        if (options.watch && fs_1.existsSync(pathToSpec)) {
            const pathToSpecDirectory = path_1.resolve(path_1.dirname(pathToSpec));
            const watchOptions = {
                ignored: [/(^|[\/\\])\../, /___jb_[a-z]+___$/],
                ignoreInitial: true,
            };
            const watcher = chokidar_1.watch(pathToSpecDirectory, watchOptions);
            const log = console.log.bind(console);
            const handlePath = (_path) => __awaiter(this, void 0, void 0, function* () {
                try {
                    spec = yield redoc_1.loadAndBundleSpec(pathToSpec);
                    pageHTML = yield getPageHTML(spec, pathToSpec, options);
                    log('Updated successfully');
                }
                catch (e) {
                    console.error('Error while updating: ', e.message);
                }
            });
            watcher
                .on('change', (path) => __awaiter(this, void 0, void 0, function* () {
                log(`${path} changed, updating docs`);
                handlePath(path);
            }))
                .on('add', (path) => __awaiter(this, void 0, void 0, function* () {
                log(`File ${path} added, updating docs`);
                handlePath(path);
            }))
                .on('addDir', path => {
                log(`↗  Directory ${path} added. Files in here will trigger reload.`);
            })
                .on('error', error => console.error(`Watcher error: ${error}`))
                .on('ready', () => log(`👀  Watching ${pathToSpecDirectory} for changes...`));
        }
    });
}
function bundle(pathToSpec, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = Date.now();
        const spec = yield redoc_1.loadAndBundleSpec(pathToSpec);
        const pageHTML = yield getPageHTML(spec, pathToSpec, Object.assign(Object.assign({}, options), { ssr: true }));
        mkdirp.sync(path_1.dirname(options.output));
        fs_1.writeFileSync(options.output, pageHTML);
        const sizeInKiB = Math.ceil(Buffer.byteLength(pageHTML) / 1024);
        const time = Date.now() - start;
        console.log(`\n🎉 bundled successfully in: ${options.output} (${sizeInKiB} KiB) [⏱ ${time / 1000}s]`);
    });
}
function getPageHTML(spec, pathToSpec, { ssr, cdn, title, disableGoogleFont, templateFileName, templateOptions, redocOptions = {}, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let html;
        let css;
        let state;
        let redocStandaloneSrc;
        if (ssr) {
            console.log('Prerendering docs');
            const specUrl = redocOptions.specUrl || (isURL(pathToSpec) ? pathToSpec : undefined);
            const store = yield redoc_1.createStore(spec, specUrl, redocOptions);
            const sheet = new styled_components_1.ServerStyleSheet();
            html = server_1.renderToString(sheet.collectStyles(React.createElement(redoc_1.Redoc, { store })));
            css = sheet.getStyleTags();
            state = yield store.toJS();
            if (!cdn) {
                redocStandaloneSrc = fs_1.readFileSync(path_1.join(BUNDLES_DIR, 'redoc.standalone.js'));
            }
        }
        templateFileName = templateFileName ? templateFileName : path_1.join(__dirname, './template.hbs');
        const template = handlebars_1.compile(fs_1.readFileSync(templateFileName).toString());
        return template({
            redocHTML: `
    <div id="redoc">${(ssr && html) || ''}</div>
    <script>
    ${(ssr && `const __redoc_state = ${sanitizeJSONString(JSON.stringify(state))};`) || ''}

    var container = document.getElementById('redoc');
    Redoc.${ssr
                ? 'hydrate(__redoc_state, container);'
                : `init("spec.json", ${JSON.stringify(redocOptions)}, container)`};

    </script>`,
            redocHead: ssr
                ? (cdn
                    ? '<script src="https://unpkg.com/redoc@next/bundles/redoc.standalone.js"></script>'
                    : `<script>${redocStandaloneSrc}</script>`) + css
                : '<script src="redoc.standalone.js"></script>',
            title: title || spec.info.title || 'ReDoc documentation',
            disableGoogleFont,
            templateOptions,
        });
    });
}
// credits: https://stackoverflow.com/a/9238214/1749888
function respondWithGzip(contents, request, response, headers = {}) {
    let compressedStream;
    const acceptEncoding = request.headers['accept-encoding'] || '';
    if (acceptEncoding.match(/\bdeflate\b/)) {
        response.writeHead(200, Object.assign(Object.assign({}, headers), { 'content-encoding': 'deflate' }));
        compressedStream = zlib.createDeflate();
    }
    else if (acceptEncoding.match(/\bgzip\b/)) {
        response.writeHead(200, Object.assign(Object.assign({}, headers), { 'content-encoding': 'gzip' }));
        compressedStream = zlib.createGzip();
    }
    else {
        response.writeHead(200, headers);
        if (typeof contents === 'string') {
            response.write(contents);
            response.end();
        }
        else {
            contents.pipe(response);
        }
        return;
    }
    if (typeof contents === 'string') {
        compressedStream.write(contents);
        compressedStream.pipe(response);
        compressedStream.end();
        return;
    }
    else {
        contents.pipe(compressedStream).pipe(response);
    }
}
function isURL(str) {
    return /^(https?:)\/\//m.test(str);
}
function sanitizeJSONString(str) {
    return escapeClosingScriptTag(escapeUnicode(str));
}
// see http://www.thespanner.co.uk/2011/07/25/the-json-specification-is-now-wrong/
function escapeClosingScriptTag(str) {
    return str.replace(/<\/script>/g, '<\\/script>');
}
// see http://www.thespanner.co.uk/2011/07/25/the-json-specification-is-now-wrong/
function escapeUnicode(str) {
    return str.replace(/\u2028|\u2029/g, m => '\\u202' + (m === '\u2028' ? '8' : '9'));
}
function handleError(error) {
    console.error(error.stack);
    process.exit(1);
}
function getObjectOrJSON(options) {
    switch (typeof options) {
        case 'object':
            return options;
        case 'string':
            try {
                if (fs_1.existsSync(options) && fs_1.lstatSync(options).isFile()) {
                    return JSON.parse(fs_1.readFileSync(options, 'utf-8'));
                }
                else {
                    return JSON.parse(options);
                }
            }
            catch (e) {
                console.log(`Encountered error:\n\n${options}\n\nis neither a file with a valid JSON object neither a stringified JSON object.`);
                handleError(e);
            }
        default:
            return {};
    }
}
