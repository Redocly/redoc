# 1.3.0 (2014-08-31)
### Bug fixes
* Fix code samples are not shown for operations without body param (#93)
* Fixed side menu overlapped site footer (#75)
* Fix broken order in discriminator dropdown

### Features/Improvements
* Support "x-nullable" property by @kedashoe (#92)

# 1.2.0 (2016-08-30)
### Bug fixes
* Fix sticky sidebar top sticking (#75)
* Fix array inside objects if referenced directly (#84)
* Add banner to the bundle file (#89)
* Fix broken additionalProperties
* Fix version render issue (extra "v" letter)

### Features/Improvements
* Change the way discriminator is rendered
* Created CDN major release 1.x.x (#87)
* Smaller bundle size (371KB gzipped)
* Better start-up time due to [AoT](http://blog.mgechev.com/2016/08/14/ahead-of-time-compilation-angular-offline-precompilation/)

### Code refactoring
* Moved build-system to Webpack
* Moved to latest Typescript + get rid of typings
* Upgrade to the latest Angular2 RC.5

# 1.1.2 (2016-08-21)
### Bug fixes
* Revert "Fix markdown newlines to be GFM" (#82)
* Move license and contact info above description

# 1.1.1 (2016-08-21)
### Bug fixes
* Fix markdown newlines to be GFM (#82)
* Fix markdown code blocks in api description

# 1.1.0 (2016-08-12)
### Bug fixes

* Fix API description width on mobile
* Render valid JSON in samples (quoted object keys)

### Features/Improvements

* Add Tuple support (arrays with separate schema for each value) (#69)
* Add special representation for enum with one value (#70)
* Change `< * >` notation to `< anything >`


# 1.0.1 (2016-08-01)
### Bug fixes

* Use api host if schema host is undefined
