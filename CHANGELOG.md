<a name="1.20.0"></a>
## [1.20.0](https://github.com/Rebilly/ReDoc/compare/v1.19.3...v1.20.0) (2018-01-21)


### Bug Fixes

* Path parameters are not correctly overriden ([c406dc5](https://github.com/Rebilly/ReDoc/commit/c406dc5)), closes [#400](https://github.com/Rebilly/ReDoc/issues/400)
* Use parentNode instead of parentElement to fix IE11 crash ([e8adb60](https://github.com/Rebilly/ReDoc/commit/e8adb60)), closes [#406](https://github.com/Rebilly/ReDoc/issues/406)


### Features

* align parameters to match up ([#375](https://github.com/Rebilly/ReDoc/issues/375)) ([d083c16](https://github.com/Rebilly/ReDoc/commit/d083c16))

### Deprecations
* Dropped bower support. No more dist files on the `releases` branch.

<a name="1.19.3"></a>
## [1.19.3](https://github.com/Rebilly/ReDoc/compare/v1.19.2...v1.19.3) (2017-11-16)


### Bug Fixes

* html characters not escaped in code blocks (fixes [#378](https://github.com/Rebilly/ReDoc/issues/378)) ([fef9ec4](https://github.com/Rebilly/ReDoc/commit/fef9ec4))


<a name="1.19.2"></a>
## [1.19.2](https://github.com/Rebilly/ReDoc/compare/v1.19.1...v1.19.2) (2017-11-10)


### Bug Fixes

* response samples doesn't show only text/plain (fixes [#371](https://github.com/Rebilly/ReDoc/issues/371)) ([00aea06](https://github.com/Rebilly/ReDoc/commit/00aea06))


<a name="1.19.1"></a>
# [1.19.1](https://github.com/Rebilly/ReDoc/compare/v1.19.0...v1.19.1) (2017-10-02)


### Bug Fixes

* snapshot crashing on `constructor` prop ([04e8606](https://github.com/Rebilly/ReDoc/commit/04e8606)), closes [#341](https://github.com/Rebilly/ReDoc/issues/341)


<a name="1.19.0"></a>
# [1.19.0](https://github.com/Rebilly/ReDoc/compare/v1.18.1...v1.19.0) (2017-09-21)


### Bug Fixes

* Clearly label version compatibility ([8d849a6](https://github.com/Rebilly/ReDoc/commit/8d849a6)), closes [#338](https://github.com/Rebilly/ReDoc/issues/338)
* HEAD http verb support ([d8b6e02](https://github.com/Rebilly/ReDoc/commit/d8b6e02)), closes [#342](https://github.com/Rebilly/ReDoc/issues/342)


### Features

* add ignoredHeaderParameters option ([56d62e5](https://github.com/Rebilly/ReDoc/commit/56d62e5))
* add native-scrollbars option to workaround scrolling perf issues ([f2ed92c](https://github.com/Rebilly/ReDoc/commit/f2ed92c))


<a name="1.18.1"></a>
## [1.18.1](https://github.com/Rebilly/ReDoc/compare/v1.17.0...v1.18.1) (2017-08-28)


### Bug Fixes

* crash if `contact` is not in the spec ([1b9ba0d](https://github.com/Rebilly/ReDoc/commit/1b9ba0d)), closes [#332](https://github.com/Rebilly/ReDoc/issues/332)


<a name="1.18.0"></a>
# [1.18.0](https://github.com/Rebilly/ReDoc/compare/v1.16.1...v1.18.0) (2017-08-28)


### Bug Fixes

* increase padding top for `.api-info-wrapper` when left sidebar is hiding to avoid header overlaying by top menu ([514fc29](https://github.com/Rebilly/ReDoc/commit/514fc29))
* add `display: inline-block` for `.openapi-button` ([86b4db4](https://github.com/Rebilly/ReDoc/commit/86b4db4)),
closes [#321](https://github.com/Rebilly/ReDoc/issues/321)
* add margins around list-items in markdown ([b165785](https://github.com/Rebilly/ReDoc/commit/b165785))

### Features

* generate download link for specs defined by an object ([60e8cb4](https://github.com/Rebilly/ReDoc/commit/60e8cb4)), closes [#289](https://github.com/Rebilly/ReDoc/issues/289)
* support text-plain response sample ([b84177c](https://github.com/Rebilly/ReDoc/commit/b84177c)), closes [#270](https://github.com/Rebilly/ReDoc/issues/270)
* clickable logo that points to specific url ([cb3d318](https://github.com/Rebilly/ReDoc/commit/cb3d318)), closes
[#322](https://github.com/Rebilly/ReDoc/issues/322)
* support x-example for parameters ([f792273](https://github.com/Rebilly/ReDoc/commit/f792273)), closes
[#297](https://github.com/Rebilly/ReDoc/issues/297)

<a name="1.17.0"></a>
# [1.17.0](https://github.com/Rebilly/ReDoc/compare/v1.16.1...v1.17.0) (2017-08-02)


### Bug Fixes

* copy code-samples included \n\r characters ([cd962fa](https://github.com/Rebilly/ReDoc/commit/cd962fa)), closes [#296](https://github.com/Rebilly/ReDoc/issues/296)
* enum with single value not shown in non-body params ([87d9abd](https://github.com/Rebilly/ReDoc/commit/87d9abd)), closes [#284](https://github.com/Rebilly/ReDoc/issues/284)
* handle case where items is array in indexer ([5e5db72](https://github.com/Rebilly/ReDoc/commit/5e5db72)), closes [#304](https://github.com/Rebilly/ReDoc/issues/304)
* output dates as ISO 8601 strings in JSON Formatter ([#313](https://github.com/Rebilly/ReDoc/issues/313)) ([86d8179](https://github.com/Rebilly/ReDoc/commit/86d8179))
* make padding between h2 sections smaller ([2c89536](https://github.com/Rebilly/ReDoc/commit/2c89536)), closes [#291](https://github.com/Rebilly/ReDoc/issues/291)
* ready-only for nested objects samples ([be41d6d](https://github.com/Rebilly/ReDoc/commit/be41d6d)), closes [#300](https://github.com/Rebilly/ReDoc/issues/300)


### Features

* add `hide-loading` option ([2ebca4b](https://github.com/Rebilly/ReDoc/commit/2ebca4b)), closes [#315](https://github.com/Rebilly/ReDoc/issues/315)
* add special rendering for deprecated operations ([#290](https://github.com/Rebilly/ReDoc/issues/290)) ([2748aac](https://github.com/Rebilly/ReDoc/commit/2748aac))
* export angular module *<not stable yet>* ([ef5101b](https://github.com/Rebilly/ReDoc/commit/ef5101b))
* support for xml samples in response when there is no schema in response ([eb7089b](https://github.com/Rebilly/ReDoc/commit/eb7089b)), closes [#307](https://github.com/Rebilly/ReDoc/issues/307)



<a name="1.16.0"></a>
# [1.16.0](https://github.com/Rebilly/ReDoc/compare/v1.15.0...v1.16.0) (2017-05-12)


### Bug Fixes

* do not show discriminator dropdown if it is empty ([7a5d315](https://github.com/Rebilly/ReDoc/commit/7a5d315))
* prevent possible XSS using `untrusted-spec` option ([c0698bb](https://github.com/Rebilly/ReDoc/commit/c0698bb))
* URL changes so fast ([131b437](https://github.com/Rebilly/ReDoc/commit/131b437)), closes [#252](https://github.com/Rebilly/ReDoc/issues/252)


### Features

* display xml examples if present in response examples ([cb106cc](https://github.com/Rebilly/ReDoc/commit/cb106cc))


<a name="1.15.0"></a>
# [1.15.0](https://github.com/Rebilly/ReDoc/compare/v1.14.0...v1.15.0) (2017-05-05)


### Bug Fixes

* menu items not full-width on short item names ([ef1b2bd](https://github.com/Rebilly/ReDoc/commit/ef1b2bd))
* menu service subscription leak ([bb00dc3](https://github.com/Rebilly/ReDoc/commit/bb00dc3))
* openapi button: add `download` attribute ([583c571](https://github.com/Rebilly/ReDoc/commit/583c571))
* sample unavailable when no schema in response object ([1eedbfe](https://github.com/Rebilly/ReDoc/commit/1eedbfe))
* Slugifying non-ascii headers make duplicate permalinks ([#264](https://github.com/Rebilly/ReDoc/issues/264)) ([6edbbe7](https://github.com/Rebilly/ReDoc/commit/6edbbe7))
* typo in download button classname (thanks [@dwilding](https://github.com/dwilding)) ([6b363a5](https://github.com/Rebilly/ReDoc/commit/6b363a5))
* firefox and IE scroll sync after deps update ([ad04636](https://github.com/Rebilly/ReDoc/commit/ad04636))



### Features

* add triangle icon for expandable menu items ([e7130d2](https://github.com/Rebilly/ReDoc/commit/e7130d2))
* clear button (x) in search box ([0341db4](https://github.com/Rebilly/ReDoc/commit/0341db4))


<a name="1.14.0"></a>
# [1.14.0](https://github.com/Rebilly/ReDoc/compare/v1.13.0...v1.14.0) (2017-04-23)


### Bug Fixes

* don't show download button if initialized with an object ([476d6c4](https://github.com/Rebilly/ReDoc/commit/476d6c4))
* endpoint link doesn't expand when click on arrow ([9248cc2](https://github.com/Rebilly/ReDoc/commit/9248cc2))
* markdown block text color 💅 ([0f6f035](https://github.com/Rebilly/ReDoc/commit/0f6f035)), closes [#255](https://github.com/Rebilly/ReDoc/issues/255)
* ReDoc removes path if site is using history API ([c77e1a2](https://github.com/Rebilly/ReDoc/commit/c77e1a2)), closes [#257](https://github.com/Rebilly/ReDoc/issues/257)
* remove trailing slash from url when use `x-servers` ([2760a34](https://github.com/Rebilly/ReDoc/commit/2760a34))
* subscription leak in side-menu ([838f233](https://github.com/Rebilly/ReDoc/commit/838f233))


### Features

* add GH-like anchors to h1 and h2 headings in md ([bb3667d](https://github.com/Rebilly/ReDoc/commit/bb3667d))
* add perfect-scrollbar for side menu ([cdeee67](https://github.com/Rebilly/ReDoc/commit/cdeee67))
* emphasize path with primary color in servers dropdown ([388b3d4](https://github.com/Rebilly/ReDoc/commit/388b3d4))
* new option `path-in-middle-panel` ([74a3193](https://github.com/Rebilly/ReDoc/commit/74a3193))
* SideMenu to support items template as a parameter ([8a49fb3](https://github.com/Rebilly/ReDoc/commit/8a49fb3))


<a name="1.13.0"></a>
# 1.13.0 (2017-04-19)


### Bug Fixes

* fix issue with loading https spec ([585b9cf](https://github.com/Rebilly/ReDoc/commit/585b9cf)), closes [#243](https://github.com/Rebilly/ReDoc/issues/243) (by Khoa Tran)
* UL missing css ([303b49e](https://github.com/Rebilly/ReDoc/commit/303b49e)), closes [#248](https://github.com/Rebilly/ReDoc/issues/248)
* don't show contact info if it is empty object ([6077cc6](https://github.com/Rebilly/ReDoc/commit/6077cc6))
* code block formatting in markdown list ([a9cad19](https://github.com/Rebilly/ReDoc/commit/a9cad19)), closes [#242](https://github.com/Rebilly/ReDoc/issues/242)

### Features

* HTTP verbs badges in side menu ([92eec25](https://github.com/Rebilly/ReDoc/commit/92eec25)), closes [#61](https://github.com/Rebilly/ReDoc/issues/61)
* HTTP verbs badges in search results ([61fd426](https://github.com/Rebilly/ReDoc/commit/61fd426))
* new option [`no-auto-auth`](https://github.com/Rebilly/ReDoc#redoc-tag-attributes) to disable authentication section auto adding ([00b304a](https://github.com/Rebilly/ReDoc/commit/00b304a))

<a name="1.12.1"></a>
# 1.12.1 (2017-04-19)


### Bug Fixes

* fix: use replace state instead of pushState ([4f4e748](https://github.com/Rebilly/ReDoc/commit/4f4e748)), closes [#244](https://github.com/Rebilly/ReDoc/issues/244)

<a name="1.12.0"></a>
# 1.12.0 (2017-04-19)


### Bug Fixes

* add safeguard for undefined ([aaac434](https://github.com/Rebilly/ReDoc/commit/aaac434)), closes [#236](https://github.com/Rebilly/ReDoc/issues/236)
* view errors were not reported ([6aa3a7d](https://github.com/Rebilly/ReDoc/commit/6aa3a7d))

### Features

* Support x-examples vendor extension for requests (by [@brendo](https://github.com/brendo))

### Other

* Updated to Angular 4, bundle is a bit smaller now

<a name="1.11.0"></a>
# 1.11.0 (2017-03-09)


### Bug Fixes

* do not hang when swagger doesn't contain any paths ([e4f5388](https://github.com/Rebilly/ReDoc/commit/e4f5388)), closes [#216](https://github.com/Rebilly/ReDoc/issues/216)
[#201](https://github.com/Rebilly/ReDoc/issues/201)
* optimize and support inherited discriminator ([64e5741](https://github.com/Rebilly/ReDoc/commit/64e5741))
* redoc hangs when indexing recursive discriminator-based definitions ([1e96f88](https://github.com/Rebilly/ReDoc/commit/1e96f88))
* wrong warnings for $ref not single ([193f4bf](https://github.com/Rebilly/ReDoc/commit/193f4bf)), closes [#221](https://github.com/Rebilly/ReDoc/issues/221)
* x-extendedDiscriminator not working ([4899f3e](https://github.com/Rebilly/ReDoc/commit/4899f3e)), closes [#217](https://github.com/Rebilly/ReDoc/issues/217)


### Features

* copy pretty-printed JSON ([e99d66d](https://github.com/Rebilly/ReDoc/commit/e99d66d)), closes [#219](https://github.com/Rebilly/ReDoc/issues/219)
* support for OpenAPI object as a parameter for `init` ([d99f256](https://github.com/Rebilly/ReDoc/commit/d99f256)), closes [#224](https://github.com/Rebilly/ReDoc/issues/224)

<a name="1.10.2"></a>
## 1.10.2 (2017-03-01)

### Bug Fixes
* clear page fragment when scroll to the beginning
* update docs for x-tagGroup, add warning [#215](https://github.com/Rebilly/ReDoc/issues/215)
* show warning for non-used in tagGroup tags

<a name="1.10.1"></a>
## 1.10.1 (2017-02-27)


### Bug Fixes

* improve x-servers dropdown animation performance ([69c7d98](https://github.com/Rebilly/ReDoc/commit/69c7d98))



<a name="1.10.0"></a>
# 1.10.0 (2017-02-27)


### Bug Fixes
* Revert: remove unused hide-hostname option ([7031176](https://github.com/Rebilly/ReDoc/commit/7031176))

### Features

* new option `required-props-first` ([c724df4](https://github.com/Rebilly/ReDoc/commit/c724df4)), closes [#191](https://github.com/Rebilly/ReDoc/issues/191)
* update fragment while scrolling and on menu clicks ([66c06b3](https://github.com/Rebilly/ReDoc/commit/66c06b3)), closes [#138](https://github.com/Rebilly/ReDoc/issues/138) [#202](https://github.com/Rebilly/ReDoc/issues/202)



<a name="1.9.0"></a>
# 1.9.0 (2017-02-25)


### Bug Fixes

* do not crash if version is not string ([accd016](https://github.com/Rebilly/ReDoc/commit/accd016)), closes [#208](https://github.com/Rebilly/ReDoc/issues/208)
* long paths break EndpointLink ui ([8472045](https://github.com/Rebilly/ReDoc/commit/8472045))
* remove unused hide-hostname option ([7031176](https://github.com/Rebilly/ReDoc/commit/7031176))


### Features

* Add support for `x-servers` ([fd49082](https://github.com/Rebilly/ReDoc/commit/fd49082))
* Color of "default" Response depends on other successful responses are specified ([9d0dd25](https://github.com/Rebilly/ReDoc/commit/9d0dd25)), closes [#197](https://github.com/Rebilly/ReDoc/issues/197)
* improved type string with minLength == maxLength ([e76bcc3](https://github.com/Rebilly/ReDoc/commit/e76bcc3)), closes [#212](https://github.com/Rebilly/ReDoc/issues/212)
* show type string with minLength 1 as "non-empty" ([d175a4d](https://github.com/Rebilly/ReDoc/commit/d175a4d)), closes [#192](https://github.com/Rebilly/ReDoc/issues/192)



<a name="1.8.1"></a>
## 1.8.1 (2017-02-23)


### Bug Fixes
* Fix toggle icon width on IE, closes [#198](https://github.com/Rebilly/ReDoc/issues/198)
* Add safe guards array without items, closes [#199](https://github.com/Rebilly/ReDoc/issues/199)
* Fix extra slash if basePath is not present ([a5c03ab](https://github.com/Rebilly/ReDoc/commit/a5c03ab)), closes [#201](https://github.com/Rebilly/ReDoc/issues/201)
* response samples - render description as markdown ([4acfc11](https://github.com/Rebilly/ReDoc/commit/4acfc11)), closes [#190](https://github.com/Rebilly/ReDoc/issues/190)
* take snapshot of schema to not overwrite inlined references ([77bc3c4](https://github.com/Rebilly/ReDoc/commit/77bc3c4)), closes [#203](https://github.com/Rebilly/ReDoc/issues/203)
* use items description if not present on top level ([23e7847](https://github.com/Rebilly/ReDoc/commit/23e7847))


### Features

* autoscroll menu ([b43a87d](https://github.com/Rebilly/ReDoc/commit/b43a87d))


# 1.8.0 (2017-02-03)
### Features/Improvements
* In-page search :tada: []#51](https://github.com/Rebilly/ReDoc/issues/51)
* Render externalDocs [#103](https://github.com/Rebilly/ReDoc/issues/103)
* Undeprecate x-traitTag

### Bug fixes
* Tags with x-traitTag: true are now greyed out in ReDoc output bug [#194](https://github.com/Rebilly/ReDoc/issues/194)
* CSS: request body model-tree wrapping problem [#185](https://github.com/Rebilly/ReDoc/issues/185)
* Strange request to `example.com` causing CSP error [#178](https://github.com/Rebilly/ReDoc/issues/178)
* Fix latest empty menu-items not getting active [#194](https://github.com/Rebilly/ReDoc/issues/194)
* Fixed crash when level-2 heading goes before level-1 in description [#179](https://github.com/Rebilly/ReDoc/issues/179) (by [@jsmartfo](https://github.com/jsmartfo))

# 1.7.0 (2017-01-06)
### Features/Improvements
* Add support for grouping items in menu via [`x-tagGroups`](https://github.com/Rebilly/ReDoc/blob/master/docs/redoc-vendor-extensions.md#x-taggroups)
* Support inherited discriminator (only one at the moment)
* Add support for second-level headings from Markdown docs (by [@jaingaurav](https://github.com/jaingaurav))

### Bug fixes
* Fix response list for shared schemas (fixes [#177](https://github.com/Rebilly/ReDoc/issues/177))
* Fix right panel overlaps site-footer

# 1.6.4 (2016-12-28)
### Bug fixes
* Fix crash on MS Edge (fixes [#166](https://github.com/Rebilly/ReDoc/issues/166))
* Uncomment animation after upgrade to the latest ng2 (resolves [#162](https://github.com/Rebilly/ReDoc/issues/162))

# 1.6.3 (2016-12-19)
### Bug fixes
* Disable side-menu animation (workaround for [#162](https://github.com/Rebilly/ReDoc/issues/162))
* Use markdown for response description (fixes [#158](https://github.com/Rebilly/ReDoc/issues/158))
* Fix leaks (fixes [#167](https://github.com/Rebilly/ReDoc/issues/167))
* Update webpack and stick to ts@2.0.9 (fixes [#169](https://github.com/Rebilly/ReDoc/issues/169), [#168](https://github.com/Rebilly/ReDoc/issues/168))

### Features/Improvements
* add `expand-responses` option - specify which responses are expand by default ([#165](https://github.com/Rebilly/ReDoc/issues/165)).

# 1.6.2 (2016-12-11)
### Bug fixes
* Use markdown in responses description ([#158](https://github.com/Rebilly/ReDoc/issues/158))

### Features/Improvements
* [x-displayName](https://github.com/Rebilly/ReDoc/blob/master/docs/redoc-vendor-extensions.md#x-displayname) for tags - by [@bfirsh](https://github.com/bfirsh) ([PR #152](https://github.com/Rebilly/ReDoc/pull/152))

# 1.6.1 (2016-12-02)
### Bug fixes
* Fix only the first instance of schema was rendered ([#150](https://github.com/Rebilly/ReDoc/issues/150))
* Regression: fix side panel overlaps footer
* Fix menu was not initialized for specs without tags

### Features/Improvements
* Don't show error screen for runtimes after render finished
* Updated dependencies (angular to the latest version + dev deps)


# 1.6.0 (2016-11-30)
### Bug fixes
* Update webpack to the latest beta ([#143](https://github.com/Rebilly/ReDoc/issues/143))
* Fix read-only fields appear in request samples ([#142](https://github.com/Rebilly/ReDoc/issues/142))
* A few more minor UI improvemnts

### Features/Improvements
* Major performance optimization with new option `lazy-rendering`

To enable use `<redoc>` tag parameter: `<redoc spec-url="..." lazy-rendering></redoc>`.
In this mode ReDoc shows initial screen ASAP and then renders the rest operations asynchronously while showing progress bar on the top. Check out [the demo](//rebilly.github.io/ReDoc) for the example.
* Enable cors-proxy for demo
* README: Add button link to yeoman-generator

# 1.5.2 (2016-11-28)
### Bug fixes
* Fix crashing on array without items ([#104](https://github.com/Rebilly/ReDoc/issues/104))
* Fix `allOf` within array items ([#136](https://github.com/Rebilly/ReDoc/issues/136))
* Fix reference resolution from external files ([#96](https://github.com/Rebilly/ReDoc/issues/96))
* Fix object to become an array ([#146](https://github.com/Rebilly/ReDoc/issues/146))

### Features/Improvements
* Add support for Swagger `collectionFormat`
* Wrap API version in span with class ([#145](https://github.com/Rebilly/ReDoc/issues/145))
* Update openapi-sampler to 0.3.3

# 1.5.1 (2016-10-31)
### Bug fixes
* Fix content scrolling on language switch ([#130](https://github.com/Rebilly/ReDoc/issues/130))

### Features/Improvements
* Support for Swagger `pattern` property ([#42](https://github.com/Rebilly/ReDoc/issues/42))
* Add option to hide hostname in method definition (by @bfirsh)
* Add Docker development environment (by @bfirsh)

# 1.5.0 (2016-10-31)
### Bug fixes
* Fix side menu items wrong sync with description headers

### Features/Improvements
* Support for Security Definitions
* Update angular2 to the 2.1.2

### Deprecations
* Deprecate `x-traitTag`

### Code refactoring
* Separate RedocModule from AppModule
* Get rid of angular facade/lang dependencies
* Error handler refactor

# 1.4.1 (2016-10-18)
### Bug fixes
* Emit helpers for module build

# 1.4.0 (2016-10-14)
### Bug fixes
* Fix destroy/reinit
* Fix minimum/maximum zero not rendered ([#123](https://github.com/Rebilly/ReDoc/issues/123))

### Features/Improvements
* Do spec load after bootstrap
* Build and publish angular2 module ([#126](https://github.com/Rebilly/ReDoc/issues/126))

# 1.3.3 (2016-09-28)
### Features/Improvements
* Implemented x-extendedDiscriminator to workaround name clashes in big specs
* Add engines to package.json ([#83](https://github.com/Rebilly/ReDoc/issues/83))
* Fix npm start on windows ([#119](https://github.com/Rebilly/ReDoc/issues/119), [#118](https://github.com/Rebilly/ReDoc/issues/118))
* Update webpack to latest beta
* Update angular to 2.0.1
* Update local dev steps
* Update openapi-sampler lib ([#111](https://github.com/Rebilly/ReDoc/issues/111))

# 1.3.2 (2016-09-13)
### Bug fixes
* Fix broken tabs styling for response samples
* Fix v1.x.x deployment

# 1.3.1 (2016-09-13)
### Bug fixes
* Makes basePath optional (by @LeFnord)
* Fixed little typo (by @adamd)
* Typo s/IGNORRED/IGNORED (by @MikeRalphson)
* Fixed indentation (by @bennyn)
* Fix default hostname ([#108](https://github.com/Rebilly/ReDoc/issues/108))
* Fix default value for falsy values is not displayed ([#109](https://github.com/Rebilly/ReDoc/issues/109))
* Fix schema collapse after change discriminator

### Features/Improvements
* Update to latest Angular RC.6
* Smaller bundle size by removing esprima dep from bundle
* Updated dependencies

# 1.3.0 (2016-08-31)
### Bug fixes
* Fix code samples are not shown for operations without body param ([#93](https://github.com/Rebilly/ReDoc/issues/93))
* Fixed side menu overlapped site footer ([#75](https://github.com/Rebilly/ReDoc/issues/75))
* Fix broken order in discriminator dropdown

### Features/Improvements
* Support "x-nullable" property by @kedashoe ([#92](https://github.com/Rebilly/ReDoc/issues/92))

# 1.2.0 (2016-08-30)
### Bug fixes
* Fix sticky sidebar top sticking ([#75](https://github.com/Rebilly/ReDoc/issues/75))
* Fix array inside objects if referenced directly ([#84](https://github.com/Rebilly/ReDoc/issues/84))
* Add banner to the bundle file ([#89](https://github.com/Rebilly/ReDoc/issues/89))
* Fix broken additionalProperties
* Fix version render issue (extra "v" letter)

### Features/Improvements
* Change the way discriminator is rendered
* Created CDN major release 1.x.x ([#87](https://github.com/Rebilly/ReDoc/issues/87))
* Smaller bundle size (371KB gzipped)
* Better start-up time due to [AoT](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/)

### Code refactoring
* Moved build-system to Webpack
* Moved to latest Typescript + get rid of typings
* Upgrade to the latest Angular2 RC.5

# 1.1.2 (2016-08-21)
### Bug fixes
* Revert "Fix markdown newlines to be GFM" ([#82](https://github.com/Rebilly/ReDoc/issues/82))
* Move license and contact info above description

# 1.1.1 (2016-08-21)
### Bug fixes
* Fix markdown newlines to be GFM ([#82](https://github.com/Rebilly/ReDoc/issues/82))
* Fix markdown code blocks in api description

# 1.1.0 (2016-08-12)
### Bug fixes

* Fix API description width on mobile
* Render valid JSON in samples (quoted object keys)

### Features/Improvements

* Add Tuple support (arrays with separate schema for each value) ([#69](https://github.com/Rebilly/ReDoc/issues/69))
* Add special representation for enum with one value ([#70](https://github.com/Rebilly/ReDoc/issues/70))
* Change `< * >` notation to `< anything >`


# 1.0.1 (2016-08-01)
### Bug fixes

* Use api host if schema host is undefined
