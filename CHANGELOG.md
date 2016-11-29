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
