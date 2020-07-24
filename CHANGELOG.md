# [2.0.0-rc.35](https://github.com/Redocly/redoc/compare/v2.0.0-rc.34...v2.0.0-rc.35) (2020-07-24)

### Bug Fixes

* update EnumValues component ([#1324](https://github.com/Redocly/redoc/issues/1324)) ([de27ac0](https://github.com/Redocly/redoc/commit/de27ac03081d55967f5a479fb1352a83b8ceb8b2))



# [2.0.0-rc.34](https://github.com/Redocly/redoc/compare/v2.0.0-rc.33...v2.0.0-rc.34) (2020-07-24)

Same as rc.33 by mistake



# [2.0.0-rc.33](https://github.com/Redocly/redoc/compare/v2.0.0-rc.31...v2.0.0-rc.33) (2020-07-21)


### Bug Fixes

* default style and explode for params ([633d712](https://github.com/Redocly/redoc/commit/633d71293fa9af2bda3bf456a9258625ee2b94a1)), closes [#1016](https://github.com/Redocly/redoc/issues/1016)
* fix contrast ratio for response titles ([47c6319](https://github.com/Redocly/redoc/commit/47c63192062d87b2b3205b915472930eaff6cc03))
* fix expand variable for vars with hyphens or dots ([0904b3f](https://github.com/Redocly/redoc/commit/0904b3fec24edc56c4a4951501fe02ae22fd852b)), closes [#926](https://github.com/Redocly/redoc/issues/926)
* make dropdowns accessible by keyboard ([e8a0d10](https://github.com/Redocly/redoc/commit/e8a0d105ca52204b0d6fd61f5e909d9dbbe6f147))
* make endpoint dropdown accessible ([3d25005](https://github.com/Redocly/redoc/commit/3d25005f084f06ac01b8fa13eb1d69092e99fd27))
* make properties focusable ([05fd754](https://github.com/Redocly/redoc/commit/05fd7543a29e0aeb364c1ba3f2d736656de7b3b7))
* make response sections focusable ([442014c](https://github.com/Redocly/redoc/commit/442014c06d6a7d2260adf7bc5798dd29869f10c9))
* make sample controls focusable ([006031c](https://github.com/Redocly/redoc/commit/006031c51787b617f2b0aed80a4b8486c5d2d3ca))
* update focus styling ([30a27c1](https://github.com/Redocly/redoc/commit/30a27c116b366428570d0b5516b5b2b4bcd0c5fc))


### Features

* add maxDisplayedEnumValues config and buttons for show/hide enums ([#1322](https://github.com/Redocly/redoc/issues/1322)) ([a2b018d](https://github.com/Redocly/redoc/commit/a2b018d393ee25fb8e9233f8123c29d14ab054c7))
* array size info based on min max Items properties ([#1308](https://github.com/Redocly/redoc/issues/1308)) ([644e96a](https://github.com/Redocly/redoc/commit/644e96ae457047ce09f55aa1f14a42c41dbc1dc8))
* new option sortEnumValuesAlphabetically ([#1321](https://github.com/Redocly/redoc/issues/1321)) ([a96a11a](https://github.com/Redocly/redoc/commit/a96a11a4dc8a509c6c3fba67dc4e065b66624e18))



# [2.0.0-rc.32](https://github.com/Redocly/redoc/compare/v2.0.0-rc.31...v2.0.0-rc.32) (2020-07-21)

Same as rc.31 by mistake



# [2.0.0-rc.31](https://github.com/Redocly/redoc/compare/v2.0.0-rc.30...v2.0.0-rc.31) (2020-06-25)


### Bug Fixes

* do not display long regexps ([#1295](https://github.com/Redocly/redoc/issues/1295)) ([2ede22c](https://github.com/Redocly/redoc/commit/2ede22c45cc970ea1ac296adbae1f6032744f823))
* prevent body scrolling when user scrolls side menu ([#1300](https://github.com/Redocly/redoc/issues/1300)) ([865a56a](https://github.com/Redocly/redoc/commit/865a56a2a9a105ef7b3b9150767399ca7339195a))



# [2.0.0-rc.30](https://github.com/Redocly/redoc/compare/v2.0.0-rc.29...v2.0.0-rc.30) (2020-05-25)


### Bug Fixes

* add security headers to Docker nginx config ([#1244](https://github.com/Redocly/redoc/issues/1244)) ([4512436](https://github.com/Redocly/redoc/commit/4512436f1d88bd99558fe5f8384b37aa62562480))
* keep 3-column layout on 13-inch mbp ([8d1d4c8](https://github.com/Redocly/redoc/commit/8d1d4c82e1377aecf936985ac13fa9bf5257562a))
* proper search-index dispose ([9dd129d](https://github.com/Redocly/redoc/commit/9dd129d90b87f24ad20f084c44d48be50d750c94))



# [2.0.0-rc.29](https://github.com/Redocly/redoc/compare/v2.0.0-rc.28...v2.0.0-rc.29) (2020-05-10)


### Bug Fixes

* depreacate x-code-samples, rename to x-codeSamples for consistency ([becc2f5](https://github.com/Redocly/redoc/commit/becc2f58568388b6500e6476874f27f62ff58ba9))
* do not crash on incompatible allOf, console.warn instead ([6e607b9](https://github.com/Redocly/redoc/commit/6e607b9a2928b062c7705087432c0f0d88e74f5d)), closes [#1156](https://github.com/Redocly/redoc/issues/1156)
* download button opens in new tab instead of downloading ([b59faad](https://github.com/Redocly/redoc/commit/b59faada8210a4c8f61fa0e850b7d844574a46d1)), closes [#1247](https://github.com/Redocly/redoc/issues/1247)
* fix broken md headings with ampersand ([8460659](https://github.com/Redocly/redoc/commit/846065916d58cf628f0bc93c74be429ecdea12e7)), closes [#1173](https://github.com/Redocly/redoc/issues/1173)


### Features

* **cli:** add the --title option to the serve subcommand ([#1160](https://github.com/Redocly/redoc/issues/1160)) ([10414fc](https://github.com/Redocly/redoc/commit/10414fc6d5c0f91b5e93b1ed2326e4e508611324))



# [2.0.0-rc.28](https://github.com/Redocly/redoc/compare/v2.0.0-rc.27...v2.0.0-rc.28) (2020-04-27)


### Bug Fixes

* encode URLs in json samples linkify (xss) ([62c01da](https://github.com/Redocly/redoc/commit/62c01da420fca2137674ae562d4ecba54db97da9)), thanks to @masatokinugawa



# [2.0.0-rc.27](https://github.com/Redocly/redoc/compare/v2.0.0-rc.26...v2.0.0-rc.27) (2020-04-20)


### Features

* add callbacks support ([#1224](https://github.com/Redocly/redoc/issues/1224)) ([57e93ec](https://github.com/Redocly/redoc/commit/57e93ec4355de2659fcb5449b14b7ed738c6c276))



# [2.0.0-rc.26](https://github.com/Redocly/redoc/compare/v2.0.0-rc.25...v2.0.0-rc.26) (2020-03-29)


### Bug Fixes

* crash to wrong spelling in localeCompare ([3908a7c](https://github.com/Redocly/redoc/commit/3908a7c46448d277b82318659cdea65db52f9e70)), closes [#1218](https://github.com/Redocly/redoc/issues/1218)



# [2.0.0-rc.25](https://github.com/Redocly/redoc/compare/v2.0.0-rc.24...v2.0.0-rc.25) (2020-03-27)


### Bug Fixes

* do not collapse top level on Collapse All in json samples ([#1209](https://github.com/Redocly/redoc/issues/1209)) ([830371b](https://github.com/Redocly/redoc/commit/830371b5d1edf4ba7a138b3b3d78148d020e0349))
* fix passing boolean value to showExtensions options ([#1211](https://github.com/Redocly/redoc/issues/1211)) ([c6eaa02](https://github.com/Redocly/redoc/commit/c6eaa0281bb0f62b019c865e4aefb863ce84d628))
* improve names for some theme settings ([a0bd27c](https://github.com/Redocly/redoc/commit/a0bd27c75427a39abc9c753b0654678eed2f3851))
* sort discriminator entries by mapping order ([#1216](https://github.com/Redocly/redoc/issues/1216)) ([ac4f915](https://github.com/Redocly/redoc/commit/ac4f915494f289d1c97ffdfe3af59efd94734f8c))


### Features

* add x-explicitMappingOnly extension ([#1215](https://github.com/Redocly/redoc/issues/1215)) ([ea5b0aa](https://github.com/Redocly/redoc/commit/ea5b0aabf9133d11d3a8fcb79f9515d21e0d7ac0))



# [2.0.0-rc.24](https://github.com/Redocly/redoc/compare/v2.0.0-rc.23...v2.0.0-rc.24) (2020-03-17)


### Bug Fixes

* Add debounce for 300 ms when searching ([#1089](https://github.com/Redocly/redoc/issues/1089)) ([373f018](https://github.com/Redocly/redoc/commit/373f018d0c183f83d07a4dbad4a4e2c9ab159f69))
* do not load SearchWorker if disableSearch is `true` ([#1191](https://github.com/Redocly/redoc/issues/1191)) ([af415e8](https://github.com/Redocly/redoc/commit/af415e89e8c074a3f7c84f76f24020a7bd545483)), closes [#764](https://github.com/Redocly/redoc/issues/764)
* fix major search performance due to wrong marker element ([8c053cc](https://github.com/Redocly/redoc/commit/8c053cc474e88befc3338307317c0702d212d4c3)), closes [#1109](https://github.com/Redocly/redoc/issues/1109)


### Features

* new option expandSingleSchemaField ([7608800](https://github.com/Redocly/redoc/commit/7608800d0acaa2fa0099dc840e17cd5aa90b54ca))



# [2.0.0-rc.23](https://github.com/Redocly/redoc/compare/v2.0.0-rc.22...v2.0.0-rc.23) (2020-02-09)


### Bug Fixes

* fix broken sticky sidebar in Chrome 80 ([1a2a7dd](https://github.com/Redocly/redoc/commit/1a2a7dd8331cedd6ced4c18accf0b417549b3ff3)), closes [#1167](https://github.com/Redocly/redoc/issues/1167)



# [2.0.0-rc.22](https://github.com/Redocly/redoc/compare/v2.0.0-rc.21...v2.0.0-rc.22) (2020-01-15)


### Bug Fixes

* do not process oneOf if inherited from parent with discriminator ([5248415](https://github.com/Redocly/redoc/commit/52484157912d908daea8255d0b7d684b33258d7a))


### Features

* add HTTP syntax highlighting ([#1157](https://github.com/Redocly/redoc/issues/1157)) ([27a4af7](https://github.com/Redocly/redoc/commit/27a4af707686d56280753473b4294ee4af096534))



# [2.0.0-rc.21](https://github.com/Redocly/redoc/compare/v2.0.0-rc.20...v2.0.0-rc.21) (2020-01-10)


### Bug Fixes

* empty servers behaviour per OAS spec ([ed1db0c](https://github.com/Redocly/redoc/commit/ed1db0c9027087ae0ae923e390e3e1d638a647ae)), closes [#1151](https://github.com/Redocly/redoc/issues/1151)
* fix duplicated content in tags when using md headings ([a260c84](https://github.com/Redocly/redoc/commit/a260c8414c34a259a70a20ebcd20ecbb06c3d250)), closes [#1150](https://github.com/Redocly/redoc/issues/1150) [#1152](https://github.com/Redocly/redoc/issues/1152)
* use mobile menu background color value from theme ([#1144](https://github.com/Redocly/redoc/issues/1144)) ([41a9b3c](https://github.com/Redocly/redoc/commit/41a9b3c18228d236d182d3c15c9abc35ae72a0d5))



# [2.0.0-rc.20](https://github.com/Redocly/redoc/compare/v2.0.0-rc.19...v2.0.0-rc.20) (2019-12-13)


### Bug Fixes

* fix missing parameters ([942d782](https://github.com/Redocly/redoc/commit/942d782b5a8d08767a7538741b75587cf1e67f44)), closes [#1142](https://github.com/Redocly/redoc/issues/1142)



# [2.0.0-rc.19](https://github.com/Redocly/redoc/compare/v2.0.0-rc.18...v2.0.0-rc.19) (2019-12-13)


### Bug Fixes

* change the title of "Security Scheme Type" to match "HTTP Authorization Scheme" ([#1126](https://github.com/Redocly/redoc/issues/1126)) ([289c8e6](https://github.com/Redocly/redoc/commit/289c8e6ae1ff00371f86d3f2646607c64bc30050))
* do not URI-encode parameter values for better readability ([6aeb0bf](https://github.com/Redocly/redoc/commit/6aeb0bf68df3f03f2ca1317f8b5787545bd363f1)), closes [#1138](https://github.com/Redocly/redoc/issues/1138)
* fix sortByRequired (stabilise sort) ([#1136](https://github.com/Redocly/redoc/issues/1136)) ([d92434d](https://github.com/Redocly/redoc/commit/d92434d11b08e8b0f6be5453ec69aa1d0e0df79f)), closes [#1104](https://github.com/Redocly/redoc/issues/1104) [#1121](https://github.com/Redocly/redoc/issues/1121) [#1061](https://github.com/Redocly/redoc/issues/1061)
* h2 padding on mobile ([7ed1a7e](https://github.com/Redocly/redoc/commit/7ed1a7ef0e7978a0dfb40afcc72c3362466f9624)), closes [#1118](https://github.com/Redocly/redoc/issues/1118)
* python comment stripped in headings ([4a25aae](https://github.com/Redocly/redoc/commit/4a25aaef69fad814836392ea7e41eb32c182a261)), closes [#1116](https://github.com/Redocly/redoc/issues/1116)
* remove hardcoded fontFamily for oneOf labels ([094ce91](https://github.com/Redocly/redoc/commit/094ce914e3f9cfe567b39db4ea88208014d8b686)), closes [#1120](https://github.com/Redocly/redoc/issues/1120)
* search-box use theme ([1bf490c](https://github.com/Redocly/redoc/commit/1bf490c05b343d262f8819bf1ddc433e070be1b9))
* support discriminator mapping 1-n ([6e390f9](https://github.com/Redocly/redoc/commit/6e390f9c7909da0b5d1d6fc571ab4ad92e715d6e)), closes [#1111](https://github.com/Redocly/redoc/issues/1111)
* wrap json examples in code tag ([#1064](https://github.com/Redocly/redoc/issues/1064)) ([dc5430e](https://github.com/Redocly/redoc/commit/dc5430e53def780a81612d269cc3aea3f8785eea))


### Features

* display `multipleOf` constrains ([#1065](https://github.com/Redocly/redoc/issues/1065)) ([3e90133](https://github.com/Redocly/redoc/commit/3e901336643b988ae45ae86c485005b8865e6e04))
* enable menuToggle by default ([5d81abe](https://github.com/Redocly/redoc/commit/5d81abeb28c1e4f2826e41424c10163834c37e45))
* new option hideSchemaTitles ([11cc4c4](https://github.com/Redocly/redoc/commit/11cc4c4c3e04a7e5bf3a9ebba20d10fa882a49e5))
* new option payloadSampleIdx ([eaaa99d](https://github.com/Redocly/redoc/commit/eaaa99d68e2392273e8d9c0173db3b546e035d5f))
* **cli:** Fallback on the spec's title before falling back on… ([#1073](https://github.com/Redocly/redoc/issues/1073)) ([e01eea4](https://github.com/Redocly/redoc/commit/e01eea445c93d74b66533c860d76bb3aff4d6df2))



# [2.0.0-rc.18](https://github.com/Redocly/redoc/compare/v2.0.0-rc.17...v2.0.0-rc.18) (2019-10-16)


### Bug Fixes

* add oneOf buttons vertical space when wrapped to new line ([cd9fd61](https://github.com/Redocly/redoc/commit/cd9fd61))
* improve mime-type dropdown font ([ce885f8](https://github.com/Redocly/redoc/commit/ce885f8))



# [2.0.0-rc.17](https://github.com/Redocly/redoc/compare/v2.0.0-rc.16...v2.0.0-rc.17) (2019-10-16)


### Bug Fixes

* active menu item scroll into view ([0a01e9a](https://github.com/Redocly/redoc/commit/0a01e9a))
* changed several components style font-family to monospace ([#1063](https://github.com/Redocly/redoc/issues/1063)) ([0c20e64](https://github.com/Redocly/redoc/commit/0c20e64)), closes [#909](https://github.com/Redocly/redoc/issues/909)
* no quotes for default values in header fields. ([#1059](https://github.com/Redocly/redoc/issues/1059)) ([b5af71d](https://github.com/Redocly/redoc/commit/b5af71d))
* types over-pluralization ([#1057](https://github.com/Redocly/redoc/issues/1057)) ([4494f80](https://github.com/Redocly/redoc/commit/4494f80)), closes [#1053](https://github.com/Redocly/redoc/issues/1053)


### Features

* added support for file paths as --options cli argument ([#1049](https://github.com/Redocly/redoc/issues/1049)) ([4adb927](https://github.com/Redocly/redoc/commit/4adb927))



# [2.0.0-rc.16](https://github.com/Redocly/redoc/compare/v2.0.0-rc.15...v2.0.0-rc.16) (2019-09-30)


### Bug Fixes

* fix scrollYOffset when SSR ([d09c1c1](https://github.com/Redocly/redoc/commit/d09c1c1))



# [2.0.0-rc.15](https://github.com/Redocly/redoc/compare/v2.0.0-rc.14...v2.0.0-rc.15) (2019-09-30)


### Bug Fixes

* auth section appears twice ([5aa7784](https://github.com/Redocly/redoc/commit/5aa7784)), closes [#818](https://github.com/Redocly/redoc/issues/818)
* clicking on group title breaks first tag ([4649683](https://github.com/Redocly/redoc/commit/4649683)), closes [#1034](https://github.com/Redocly/redoc/issues/1034)
* do not crash on empty scopes ([e787d9e](https://github.com/Redocly/redoc/commit/e787d9e)), closes [#1044](https://github.com/Redocly/redoc/issues/1044)
* false-positive recursive detection with allOf at the same level ([faa74d6](https://github.com/Redocly/redoc/commit/faa74d6))
* fix scrollYOffset when SSR ([21258a5](https://github.com/Redocly/redoc/commit/21258a5))
* left menu item before group is not highlighted ([67e2a8f](https://github.com/Redocly/redoc/commit/67e2a8f)), closes [#1033](https://github.com/Redocly/redoc/issues/1033)
* remove excessive whitespace between md sections on small screens ([e318fb3](https://github.com/Redocly/redoc/commit/e318fb3)), closes [#874](https://github.com/Redocly/redoc/issues/874)
* use url-template dependency ([#1008](https://github.com/Redocly/redoc/issues/1008)) ([32a464a](https://github.com/Redocly/redoc/commit/32a464a)), closes [#1007](https://github.com/Redocly/redoc/issues/1007)


### Features

* **cli:** added support for JSON string value for --options CLI argument ([#1047](https://github.com/Redocly/redoc/issues/1047)) ([2a28130](https://github.com/Redocly/redoc/commit/2a28130)), closes [#797](https://github.com/Redocly/redoc/issues/797)
* **cli:** add `disableGoogleFont` parameter to cli ([#1045](https://github.com/Redocly/redoc/issues/1045)) ([aceb343](https://github.com/Redocly/redoc/commit/aceb343))
* new option expandDefaultServerVariables ([#1014](https://github.com/Redocly/redoc/issues/1014)) ([0360dce](https://github.com/Redocly/redoc/commit/0360dce))




# [2.0.0-rc.14](https://github.com/Redocly/redoc/compare/v2.0.0-rc.13...v2.0.0-rc.14) (2019-08-07)


### Bug Fixes

* fix escaping JSON string values ([58cb20d](https://github.com/Redocly/redoc/commit/58cb20d)), closes [#999](https://github.com/Redocly/redoc/issues/999)
* revert expanding default server variables ([7849f7f](https://github.com/Redocly/redoc/commit/7849f7f))



# [2.0.0-rc.13](https://github.com/Redocly/redoc/compare/v2.0.0-rc.12...v2.0.0-rc.13) (2019-08-01)


### Bug Fixes

* enum list doesn't wrap ([bfbb0c1](https://github.com/Redocly/redoc/commit/bfbb0c1)), closes [#993](https://github.com/Redocly/redoc/issues/993)
* incorrect serialization of some parameter samples ([aba45db](https://github.com/Redocly/redoc/commit/aba45db)), closes [#992](https://github.com/Redocly/redoc/issues/992)
* support json serialization for parameter examples ([1367380](https://github.com/Redocly/redoc/commit/1367380)), closes [#934](https://github.com/Redocly/redoc/issues/934)
* unify accordion icons for responses section ([2afc2e4](https://github.com/Redocly/redoc/commit/2afc2e4)), closes [#975](https://github.com/Redocly/redoc/issues/975)
* update to core.js 3 ([9e3375d](https://github.com/Redocly/redoc/commit/9e3375d)), closes [#997](https://github.com/Redocly/redoc/issues/997)



# [2.0.0-rc.12](https://github.com/Redocly/redoc/compare/v2.0.0-rc.11...v2.0.0-rc.12) (2019-07-30)


### Bug Fixes

* rename ObjectDescription to SchemaDefinition as discussed ([4496622](https://github.com/Redocly/redoc/commit/4496622))



# [2.0.0-rc.11](https://github.com/Redocly/redoc/compare/v2.0.0-rc.10...v2.0.0-rc.11) (2019-07-30)


### Bug Fixes

* do not add extra slashes to pattern ([70d1ee9](https://github.com/Redocly/redoc/commit/70d1ee9)), closes [#983](https://github.com/Redocly/redoc/issues/983)
* dropdown fixes related to object description ([0504ad4](https://github.com/Redocly/redoc/commit/0504ad4))
* incorrect serialization of parameter sample with hyphen ([f7dd658](https://github.com/Redocly/redoc/commit/f7dd658))
* redoc-cli: Add missing content type header on compressed responses of `/` path


### Features

* menu items from tags + md extension for Schema Definition ([#681](https://github.com/Redocly/redoc/pull/681))
* new option `menuToggle` - fold active MenuItem if clicked ([#963](https://github.com/Redocly/redoc/issues/963))
* Add option for skipping quotes in enums `enumSkipQuotes` ([#968](https://github.com/Redocly/redoc/issues/968)) ([afc7e36](https://github.com/Redocly/redoc/commit/afc7e36))
* add `sampleCollapseLevel` option ([#937](https://github.com/Redocly/redoc/issues/937)) ([d3f1c16](https://github.com/Redocly/redoc/commit/d3f1c16))

# [2.0.0-rc.10](https://github.com/Redocly/redoc/compare/v2.0.0-rc.9...v2.0.0-rc.10) (2019-07-08)


### Bug Fixes

* broken headings with single quote ([51d3b9b](https://github.com/Redocly/redoc/commit/51d3b9b)), closes [#955](https://github.com/Redocly/redoc/issues/955)
* fix fields table overflow if deeply nested with long title ([12b7057](https://github.com/Redocly/redoc/commit/12b7057))
* hide empty example when it is not defined ([4bd499f](https://github.com/Redocly/redoc/commit/4bd499f))
* markdown in examples descriptions + minor ui tweaks ([f52d9e8](https://github.com/Redocly/redoc/commit/f52d9e8))
* organize response examples in dropdown and display description ([995e557](https://github.com/Redocly/redoc/commit/995e557))



# [2.0.0-rc.9](https://github.com/Redocly/redoc/compare/v2.0.0-rc.8-1...v2.0.0-rc.9) (2019-06-27)


### Bug Fixes

* fix regression double slashes added to full URL display ([f29a4fe](https://github.com/Redocly/redoc/commit/f29a4fe))
* IE11, add missing Object.assign polyfill ([888f04e](https://github.com/Redocly/redoc/commit/888f04e))
* serialize parameter example values according to the spec ([#917](https://github.com/Redocly/redoc/issues/917)) ([3939286](https://github.com/Redocly/redoc/commit/3939286))
* styled-component style error in tabs ([#946](https://github.com/Redocly/redoc/issues/946)) ([c488bbf](https://github.com/Redocly/redoc/commit/c488bbf))


### Features

* add x-additionalPropertiesName ([#622](https://github.com/Redocly/redoc/issues/622)) ([#944](https://github.com/Redocly/redoc/issues/944)) ([0eb1e66](https://github.com/Redocly/redoc/commit/0eb1e66))



# [2.0.0-rc.8-1](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.8...v2.0.0-rc.8-1) (2019-05-13)


### Bug Fixes

* crash with empty servers with redoc-cli ([3d52b39](https://github.com/Rebilly/ReDoc/commit/3d52b39))



# [2.0.0-rc.8](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.7...v2.0.0-rc.8) (2019-05-13)


### Bug Fixes

* fix broken CLI again ([4e12b5d](https://github.com/Rebilly/ReDoc/commit/4e12b5d))
* fix logo gutter bg ([81896d3](https://github.com/Rebilly/ReDoc/commit/81896d3))



# [2.0.0-rc.7](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.6...v2.0.0-rc.7) (2019-05-13)


### Bug Fixes

* crash in node due to broken URL parsing ([8df2b97](https://github.com/Rebilly/ReDoc/commit/8df2b97))



# [2.0.0-rc.6](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.5...v2.0.0-rc.6) (2019-05-13)


### Bug Fixes

* broken schema tables with long enums ([3a74b74](https://github.com/Rebilly/ReDoc/commit/3a74b74))
* deep linking sometimes not working when sent over messengers ([2491d97](https://github.com/Rebilly/ReDoc/commit/2491d97))



# [2.0.0-rc.5](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.4...v2.0.0-rc.5) (2019-05-13)


### Bug Fixes

* change fontFamily for EndpointInfo ([#866](https://github.com/Rebilly/ReDoc/issues/866)) ([851b133](https://github.com/Rebilly/ReDoc/commit/851b133))
* clean up field values display ([#855](https://github.com/Rebilly/ReDoc/issues/855)) ([5c91590](https://github.com/Rebilly/ReDoc/commit/5c91590))
* discriminator and oneOf title fix ([a3d7d7a](https://github.com/Rebilly/ReDoc/commit/a3d7d7a))
* encode x-www-form-urlencoded examples correctly ([65930ad](https://github.com/Rebilly/ReDoc/commit/65930ad)), closes [#870](https://github.com/Rebilly/ReDoc/issues/870)
* fix redoc-cli broken dependencies ([81a7568](https://github.com/Rebilly/ReDoc/commit/81a7568))
* IE11 add missing fetch and URL polyfills ([d2ce1bd](https://github.com/Rebilly/ReDoc/commit/d2ce1bd)), closes [#875](https://github.com/Rebilly/ReDoc/issues/875)
* ignore empty x-tagGroups array ([#869](https://github.com/Rebilly/ReDoc/issues/869)) ([4366a0d](https://github.com/Rebilly/ReDoc/commit/4366a0d))
* incorrect detected schema title for deeply inherited schemas ([7d7b4e3](https://github.com/Rebilly/ReDoc/commit/7d7b4e3))
* pluralize array of types ([fdcac30](https://github.com/Rebilly/ReDoc/commit/fdcac30))
* remove huge space after Authentication section ([548fae3](https://github.com/Rebilly/ReDoc/commit/548fae3)), closes [#872](https://github.com/Rebilly/ReDoc/issues/872)
* remove query string from server URL ([#895](https://github.com/Rebilly/ReDoc/issues/895)) ([64453ff](https://github.com/Rebilly/ReDoc/commit/64453ff))
* remove tabs top margin ([5c187f3](https://github.com/Rebilly/ReDoc/commit/5c187f3))
* right panel code samples bg color ([de2aed2](https://github.com/Rebilly/ReDoc/commit/de2aed2))
* tidy up non-redoc vendor extension presentation ([#847](https://github.com/Rebilly/ReDoc/issues/847)) ([b21cd3d](https://github.com/Rebilly/ReDoc/commit/b21cd3d))
* update apiKey in to be titleize ([#902](https://github.com/Rebilly/ReDoc/issues/902)) ([35df477](https://github.com/Rebilly/ReDoc/commit/35df477))
* **cli:** add node-libs-browser to the deps ([6c79901](https://github.com/Rebilly/ReDoc/commit/6c79901)), closes [#850](https://github.com/Rebilly/ReDoc/issues/850)


### Features

* add hideSingleRequestSampleTab option ([4550e4d](https://github.com/Rebilly/ReDoc/commit/4550e4d))
* add lineHeight config for headings ([#894](https://github.com/Rebilly/ReDoc/issues/894)) ([5dd5d6d](https://github.com/Rebilly/ReDoc/commit/5dd5d6d))
* basic UI labels configuration ([b0e660e](https://github.com/Rebilly/ReDoc/commit/b0e660e)). Can be used for translations later.
* add logo gutter to the theme ([82c0cb1a](https://github.com/Rebilly/ReDoc/commit/82c0cb1a)).

# [2.0.0-rc.4](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.3...v2.0.0-rc.4) (2019-03-15)


### Bug Fixes

* move swagger2openapi to deps because of missing transitive deps ([ed9b878](https://github.com/Rebilly/ReDoc/commit/ed9b878))


### Features

* display requestBody description [#833](https://github.com/Rebilly/ReDoc/issues/833) ([#838](https://github.com/Rebilly/ReDoc/issues/838)) ([56ca371](https://github.com/Rebilly/ReDoc/commit/56ca371))


# [2.0.0-rc.3](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.2...v2.0.0-rc.3) (2019-03-15)


### Bug Fixes

* add extra deref step for anyOf/oneOf variants ([d81b631](https://github.com/Rebilly/ReDoc/commit/d81b631)), closes [#810](https://github.com/Rebilly/ReDoc/issues/810)
* duplicate keys in request samples ([3ce5bff](https://github.com/Rebilly/ReDoc/commit/3ce5bff)), closes [#815](https://github.com/Rebilly/ReDoc/issues/815)
* escape backslashes in string literals ([#823](https://github.com/Rebilly/ReDoc/issues/823)) ([70faca1](https://github.com/Rebilly/ReDoc/commit/70faca1)), closes [#822](https://github.com/Rebilly/ReDoc/issues/822)
* escape quotes in string values ([0473165](https://github.com/Rebilly/ReDoc/commit/0473165)), closes [#882](https://github.com/Rebilly/ReDoc/issues/882)
* pin lunr version in ReDoc ([178ff4c](https://github.com/Rebilly/ReDoc/commit/178ff4c)), closes [#844](https://github.com/Rebilly/ReDoc/issues/844)
* set last section min-height ([4dd79cd](https://github.com/Rebilly/ReDoc/commit/4dd79cd)), closes [#820](https://github.com/Rebilly/ReDoc/issues/820)


### Features

* support externalValue for examples ([2cdfcd2](https://github.com/Rebilly/ReDoc/commit/2cdfcd2)), closes [#551](https://github.com/Rebilly/ReDoc/issues/551) [#840](https://github.com/Rebilly/ReDoc/issues/840)
* **cli:** Add templateOptions param to pass additional data to custom template ([#792](https://github.com/Rebilly/ReDoc/issues/792)) ([4e8ee03](https://github.com/Rebilly/ReDoc/commit/4e8ee03))



# [2.0.0-rc.2](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2019-01-27)


### Bug Fixes

* make padding for md code blocks and code samples consistent ([007752d](https://github.com/Rebilly/ReDoc/commit/007752d))
* make syntax highlighting for md js code blocks same as for payload samples ([d197c0f](https://github.com/Rebilly/ReDoc/commit/d197c0f))
* Only display API version if present ([#773](https://github.com/Rebilly/ReDoc/issues/773)) ([fb3cb36](https://github.com/Rebilly/ReDoc/commit/fb3cb36))



# [2.0.0-rc.1](https://github.com/Rebilly/ReDoc/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2019-01-17)


### Bug Fixes

* allow docker container serving under non-root URLs ([#731](https://github.com/Rebilly/ReDoc/issues/731)) ([cfb6f0f](https://github.com/Rebilly/ReDoc/commit/cfb6f0f)), closes [#730](https://github.com/Rebilly/ReDoc/issues/730)
* make example/defaults badge consistent with code blocks ([fa39ce4](https://github.com/Rebilly/ReDoc/commit/fa39ce4))
* pattern constrain spacing ([c7436f2](https://github.com/Rebilly/ReDoc/commit/c7436f2))
* sidebar navigation issues when scrollYOffset is float number ([c04f387](https://github.com/Rebilly/ReDoc/commit/c04f387)), closes [#748](https://github.com/Rebilly/ReDoc/issues/748)



# [2.0.0-rc.0](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.41...v2.0.0-rc.0) (2018-11-27)


### Bug Fixes

* false-positive recursive detection with oneOf ([59eaa8d](https://github.com/Rebilly/ReDoc/commit/59eaa8d)), closes [#723](https://github.com/Rebilly/ReDoc/issues/723) [#585](https://github.com/Rebilly/ReDoc/issues/585)
* fix hideHostname also hiding basePath ([b5f3224](https://github.com/Rebilly/ReDoc/commit/b5f3224)), closes [#677](https://github.com/Rebilly/ReDoc/issues/677)
* fix spacing with nested markdown lists ([f2f6909](https://github.com/Rebilly/ReDoc/commit/f2f6909)), closes [#718](https://github.com/Rebilly/ReDoc/issues/718)
* improve scrolling performance in Chrome with non-wrapped json examples ([a69c402](https://github.com/Rebilly/ReDoc/commit/a69c402))
* nested oneOf button spacing ([3673720](https://github.com/Rebilly/ReDoc/commit/3673720)), closes [#719](https://github.com/Rebilly/ReDoc/issues/719)
* onLoaded callback not run on spec error ([e77df0c](https://github.com/Rebilly/ReDoc/commit/e77df0c)), closes [#690](https://github.com/Rebilly/ReDoc/issues/690)
* theme improvements by [@stasiukanya](https://github.com/stasiukanya) ([e2d0cd5](https://github.com/Rebilly/ReDoc/commit/e2d0cd5))
* **cli:** old peer dependency issue with styled-components ([#699](https://github.com/Rebilly/ReDoc/issues/699)) ([9e2853c](https://github.com/Rebilly/ReDoc/commit/9e2853c))


### Features

* Add feature to specify href for logo explicitly ([#645](https://github.com/Rebilly/ReDoc/issues/645)) ([87fd7d7](https://github.com/Rebilly/ReDoc/commit/87fd7d7))
* add support for markdown in Server Object ([155d214](https://github.com/Rebilly/ReDoc/commit/155d214))
* Add support for minLength and maxLength constraint humanization ([#700](https://github.com/Rebilly/ReDoc/issues/700)) ([f40568b](https://github.com/Rebilly/ReDoc/commit/f40568b)), closes [#42](https://github.com/Rebilly/ReDoc/issues/42) [/github.com/Rebilly/ReDoc/issues/42#issuecomment-371883853](https://github.com//github.com/Rebilly/ReDoc/issues/42/issues/issuecomment-371883853)



<a name="2.0.0-alpha.41"></a>
# [2.0.0-alpha.41](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.40...v2.0.0-alpha.41) (2018-10-18)


### Bug Fixes

* add null check in dispose method ([#675](https://github.com/Rebilly/ReDoc/issues/675)) ([6b7c5b7](https://github.com/Rebilly/ReDoc/commit/6b7c5b7))
* extensionHook not being used ([a4a4013](https://github.com/Rebilly/ReDoc/commit/a4a4013)), closes [#665](https://github.com/Rebilly/ReDoc/issues/665)
* fix issue with broken markdown caused by marked bug ([70cf293](https://github.com/Rebilly/ReDoc/commit/70cf293))

### Peer dependencies updates

* ReDoc now requires `styled-components@^4.0.1` to be installed if used as React component



<a name="2.0.0-alpha.40"></a>
# [2.0.0-alpha.40](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.39...v2.0.0-alpha.40) (2018-10-05)


### Bug Fixes

* **cli:** add styled-components to dependencies ([2d63fa0](https://github.com/Rebilly/ReDoc/commit/2d63fa0))
* allOf inside oneOf overwritten and not rendered ([fe3383d](https://github.com/Rebilly/ReDoc/commit/fe3383d)), closes [#660](https://github.com/Rebilly/ReDoc/issues/660)
* fix panel paddings on small screens ([f39fc98](https://github.com/Rebilly/ReDoc/commit/f39fc98))
* minor media print improvements ([fbcec82](https://github.com/Rebilly/ReDoc/commit/fbcec82))
* remove extra-padding caused by empty group sections ([974bc7d](https://github.com/Rebilly/ReDoc/commit/974bc7d))
* server overriding didn't work on Path Item object ([355764d](https://github.com/Rebilly/ReDoc/commit/355764d)), closes [#656](https://github.com/Rebilly/ReDoc/issues/656)


### Features

* new option `onlyRequiredInSamples` ([#646](https://github.com/Rebilly/ReDoc/issues/646)) ([10bca66](https://github.com/Rebilly/ReDoc/commit/10bca66))
* new option `sortPropsAlphabetically` ([b87cf0d](https://github.com/Rebilly/ReDoc/commit/b87cf0d))
* new theme options `spacing.sectionHorizontal` and `spacing.sectionVertical` ([505463f](https://github.com/Rebilly/ReDoc/commit/505463f))
* turn off code-blocks wrapping (enable using `theme.typography.code.wrap: true`) ([393681b](https://github.com/Rebilly/ReDoc/commit/393681b)), closes [#658](https://github.com/Rebilly/ReDoc/issues/658)



<a name="2.0.0-alpha.39"></a>
# [2.0.0-alpha.39](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.38...v2.0.0-alpha.39) (2018-09-14)


### Bug Fixes

* Increase badge size slightly so that "PATCH" method fits inside ([#632](https://github.com/Rebilly/ReDoc/issues/632)) ([4b3b5ba](https://github.com/Rebilly/ReDoc/commit/4b3b5ba))


### Features

* externalDocumentation rendered for tags, operations and schema fields ([#595](https://github.com/Rebilly/ReDoc/issues/595)) ([893c83e](https://github.com/Rebilly/ReDoc/commit/893c83e)), closes [#550](https://github.com/Rebilly/ReDoc/issues/550)



<a name="2.0.0-alpha.38"></a>
# [2.0.0-alpha.38](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.37...v2.0.0-alpha.38) (2018-08-24)


### Bug Fixes

* add indent to array schema internals ([865f3ce](https://github.com/Rebilly/ReDoc/commit/865f3ce))
* fix oneOf/anyOf titles ([39b930d](https://github.com/Rebilly/ReDoc/commit/39b930d)), closes [#618](https://github.com/Rebilly/ReDoc/issues/618) [#621](https://github.com/Rebilly/ReDoc/issues/621)



<a name="2.0.0-alpha.37"></a>
# [2.0.0-alpha.37](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.36...v2.0.0-alpha.37) (2018-08-22)


### Bug Fixes

* do not inherit title in allOf ([720e282](https://github.com/Rebilly/ReDoc/commit/720e282)), closes [#601](https://github.com/Rebilly/ReDoc/issues/601)
* fix crash on empty media object ([fb21212](https://github.com/Rebilly/ReDoc/commit/fb21212)), closes [#608](https://github.com/Rebilly/ReDoc/issues/608)
* make http badges font-based instead of inline png ([5d84bd4](https://github.com/Rebilly/ReDoc/commit/5d84bd4))
* use correct parent section for security definition ([f903406](https://github.com/Rebilly/ReDoc/commit/f903406))



<a name="2.0.0-alpha.36"></a>
# [2.0.0-alpha.36](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.35...v2.0.0-alpha.36) (2018-08-11)


### Bug Fixes

* broken rendering of code blocks with language in markdown ([8218a26](https://github.com/Rebilly/ReDoc/commit/8218a26))
* broken rendering of headings with regexp characters ([e660517](https://github.com/Rebilly/ReDoc/commit/e660517))



<a name="2.0.0-alpha.35"></a>
# [2.0.0-alpha.35](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.34...v2.0.0-alpha.35) (2018-08-09)


### Bug Fixes

* crash on any backticks code block without lang specified ([58ae668](https://github.com/Rebilly/ReDoc/commit/58ae668))
* fix auth requirements font size ([d13fe13](https://github.com/Rebilly/ReDoc/commit/d13fe13))


<a name="2.0.0-alpha.34"></a>
# [2.0.0-alpha.34](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.33...v2.0.0-alpha.34) (2018-08-08)


### Bug Fixes

* add some spacing between operation description and parameters ([597688e](https://github.com/Rebilly/ReDoc/commit/597688e))
* description is not rendered if doesn't contain markdown headings ([90ed717](https://github.com/Rebilly/ReDoc/commit/90ed717)), closes [#591](https://github.com/Rebilly/ReDoc/issues/591)
* download button downloads index.html instead of spec with CLI ([334f904](https://github.com/Rebilly/ReDoc/commit/334f904)), closes [#594](https://github.com/Rebilly/ReDoc/issues/594)
* fix Authentication section is not rendered ([2ecc8bc](https://github.com/Rebilly/ReDoc/commit/2ecc8bc)), closes [#590](https://github.com/Rebilly/ReDoc/issues/590)
* fix linebreaks in multiparagraph field descriptions ([8fb9cd6](https://github.com/Rebilly/ReDoc/commit/8fb9cd6))
* preserve md heading level in description ([23559fb](https://github.com/Rebilly/ReDoc/commit/23559fb))
* render additionalProperties set to true ([#597](https://github.com/Rebilly/ReDoc/issues/597)) ([f70ac08](https://github.com/Rebilly/ReDoc/commit/f70ac08)), closes [#596](https://github.com/Rebilly/ReDoc/issues/596)
* schemes without type: object are not expandable ([97e1620](https://github.com/Rebilly/ReDoc/commit/97e1620)), closes [#599](https://github.com/Rebilly/ReDoc/issues/599)


### Features

* Add x-logo alt text support ([#584](https://github.com/Rebilly/ReDoc/issues/584)) ([568ce74](https://github.com/Rebilly/ReDoc/commit/568ce74)), closes [#546](https://github.com/Rebilly/ReDoc/issues/546)
* support label for x-code-samples ([00bd966](https://github.com/Rebilly/ReDoc/commit/00bd966)), closes [#586](https://github.com/Rebilly/ReDoc/issues/586)



<a name="2.0.0-alpha.33"></a>
# [2.0.0-alpha.33](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.32...v2.0.0-alpha.33) (2018-07-31)


### Bug Fixes

* long endpoint url overflow ([d99e918](https://github.com/Rebilly/ReDoc/commit/d99e918))
* allow word-break in code strings in md ([15dfe44](https://github.com/Rebilly/ReDoc/commit/15dfe44))
* show examples for response headers ([ba22b1e](https://github.com/Rebilly/ReDoc/commit/ba22b1e))

<a name="2.0.0-alpha.32"></a>
# [2.0.0-alpha.32](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.31...v2.0.0-alpha.32) (2018-07-26)


### Bug Fixes

* **cli:** add mobx to dependencies ([75ced44](https://github.com/Rebilly/ReDoc/commit/75ced44))
* fix  resolving issue by upgrading to json-schema-ref-parser@5.1.1 ([0045958](https://github.com/Rebilly/ReDoc/commit/0045958)), closes [#541](https://github.com/Rebilly/ReDoc/issues/541)
* remove break-all from code samples ([d74578d](https://github.com/Rebilly/ReDoc/commit/d74578d))
* wrong display when combining multiple auth requirements ([f96c481](https://github.com/Rebilly/ReDoc/commit/f96c481)), closes [#577](https://github.com/Rebilly/ReDoc/issues/577)



<a name="2.0.0-alpha.31"></a>
# [2.0.0-alpha.31](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.30...v2.0.0-alpha.31) (2018-07-23)


### Bug Fixes

* server url contains spec name if not specified in the spec ([b41b181](https://github.com/Rebilly/ReDoc/commit/b41b181))


### Features

* simple variable substitution support ([9d6b30c](https://github.com/Rebilly/ReDoc/commit/9d6b30c)), closes [#565](https://github.com/Rebilly/ReDoc/issues/565)



<a name="2.0.0-alpha.30"></a>
# [2.0.0-alpha.30](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.29...v2.0.0-alpha.30) (2018-07-19)


### Bug Fixes

* fix usage with CRA by transpiling swagger2openapi deps ([6473e62](https://github.com/Rebilly/ReDoc/commit/6473e62)), closes [#566](https://github.com/Rebilly/ReDoc/issues/566)


### Features

* theme reshape and new options ([58bddc8](https://github.com/Rebilly/ReDoc/commit/58bddc8))



<a name="2.0.0-alpha.29"></a>
# [2.0.0-alpha.29](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2018-07-18)


### Bug Fixes

* **cli:** cli output crashes if script closing tag is in the spec ([76906eb](https://github.com/Rebilly/ReDoc/commit/76906eb)), closes [#563](https://github.com/Rebilly/ReDoc/issues/563)
* different output of cli bundle and redoc ([89aa754](https://github.com/Rebilly/ReDoc/commit/89aa754)), closes [#547](https://github.com/Rebilly/ReDoc/issues/547)
* fix broken link in CLI help ([bab3e7d](https://github.com/Rebilly/ReDoc/commit/bab3e7d)), closes [#559](https://github.com/Rebilly/ReDoc/issues/559)
* fix Download button url when spec as object was provided ([c35925a](https://github.com/Rebilly/ReDoc/commit/c35925a)), closes [#462](https://github.com/Rebilly/ReDoc/issues/462) [#540](https://github.com/Rebilly/ReDoc/issues/540)
* fix non-scalar query/path/header params are not expandable ([dcca44a](https://github.com/Rebilly/ReDoc/commit/dcca44a)), closes [#561](https://github.com/Rebilly/ReDoc/issues/561)
* properly host oneOf inside allOf ([7e5b6d9](https://github.com/Rebilly/ReDoc/commit/7e5b6d9)), closes [#507](https://github.com/Rebilly/ReDoc/issues/507) [#528](https://github.com/Rebilly/ReDoc/issues/528)
* regression - broken urls for operations without operationId ([c0c44bc](https://github.com/Rebilly/ReDoc/commit/c0c44bc))
* use original tag name when slugified one is not valid ([#553](https://github.com/Rebilly/ReDoc/issues/553)) ([8817d9c](https://github.com/Rebilly/ReDoc/commit/8817d9c))


### Features

* new option disableSearch ([d4ab5ad](https://github.com/Rebilly/ReDoc/commit/d4ab5ad))



<a name="2.0.0-alpha.28"></a>
# [2.0.0-alpha.28](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2018-06-29)


### Bug Fixes

* inline markdown regression ([e1c9e19](https://github.com/Rebilly/ReDoc/commit/e1c9e19))



<a name="2.0.0-alpha.27"></a>
# [2.0.0-alpha.27](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.25...v2.0.0-alpha.27) (2018-06-29)


### Bug Fixes

* change default font weight to 400 ([11947ed](https://github.com/Rebilly/ReDoc/commit/11947ed))
* do not uppercase menu items by default ([0d45cc2](https://github.com/Rebilly/ReDoc/commit/0d45cc2))
* fix link colors in json samples ([aaaa899](https://github.com/Rebilly/ReDoc/commit/aaaa899))


### Features

* display Value instead of Enum for one-item enum ([78fa312](https://github.com/Rebilly/ReDoc/commit/78fa312))
* experimental temporary support for tags in md ([06ef51c](https://github.com/Rebilly/ReDoc/commit/06ef51c))
* theme hooks experimental hooks ([55bd853](https://github.com/Rebilly/ReDoc/commit/55bd853))



<a name="2.0.0-alpha.26"></a>
# [2.0.0-alpha.26](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2018-06-28)


### Bug Fixes

* change default font weight to 400 ([11947ed](https://github.com/Rebilly/ReDoc/commit/11947ed))
* do not uppercase menu items by default ([0d45cc2](https://github.com/Rebilly/ReDoc/commit/0d45cc2))
* fix link colors in json samples ([aaaa899](https://github.com/Rebilly/ReDoc/commit/aaaa899))


### Features

* display Value instead of Enum for one-item enum ([78fa312](https://github.com/Rebilly/ReDoc/commit/78fa312))
* experimental temporary support for tags in md ([06ef51c](https://github.com/Rebilly/ReDoc/commit/06ef51c))



<a name="2.0.0-alpha.24"></a>
# [2.0.0-alpha.24](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.23...v2.0.0-alpha.24) (2018-06-01)


### Bug Fixes

* temporary downgrade marked as it introduced breaking changes and a few bugs ([902f97a](https://github.com/Rebilly/ReDoc/commit/902f97a))



<a name="2.0.0-alpha.23"></a>
# [2.0.0-alpha.23](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2018-05-31)


### Bug Fixes

* **cli:** make positional arguments required and handle errors in serve and bundle manually ([#518](https://github.com/Rebilly/ReDoc/issues/518)) ([370d08a](https://github.com/Rebilly/ReDoc/commit/370d08a))
* fix typings on npm ([d957ad7](https://github.com/Rebilly/ReDoc/commit/d957ad7))
* fix vertical line misaligned in firefox ([bde08f1](https://github.com/Rebilly/ReDoc/commit/bde08f1)), closes [#503](https://github.com/Rebilly/ReDoc/issues/503)
* mergeAllOf takes items into account ([#511](https://github.com/Rebilly/ReDoc/issues/511)) ([47b2177](https://github.com/Rebilly/ReDoc/commit/47b2177))



<a name="2.0.0-alpha.22"></a>
# [2.0.0-alpha.22](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2018-05-29)


### Bug Fixes

* **cli:** create directories when a path is specified in the --output option ([#513](https://github.com/Rebilly/ReDoc/issues/513)) ([ac7372b](https://github.com/Rebilly/ReDoc/commit/ac7372b)), closes [#512](https://github.com/Rebilly/ReDoc/issues/512)
* **cli:** return 1 as exit code if an error happens in the cli ([#516](https://github.com/Rebilly/ReDoc/issues/516)) ([720c304](https://github.com/Rebilly/ReDoc/commit/720c304))
* fix font-weight inconsistency ([6ea2b7b](https://github.com/Rebilly/ReDoc/commit/6ea2b7b)), closes [#506](https://github.com/Rebilly/ReDoc/issues/506)
* HEAD http verb support in menu badges ([2eb1952](https://github.com/Rebilly/ReDoc/commit/2eb1952)), closes [#493](https://github.com/Rebilly/ReDoc/issues/493)
* more descriptive message for wrong discriminator use ([3c6de2c](https://github.com/Rebilly/ReDoc/commit/3c6de2c)), closes [#505](https://github.com/Rebilly/ReDoc/issues/505)


### Features

* add new experimental option unstable_ignoreMimeParameters ([d162bab](https://github.com/Rebilly/ReDoc/commit/d162bab))
* support x-discriminator for OpenAPI 2 ([aaff311](https://github.com/Rebilly/ReDoc/commit/aaff311)), closes [#496](https://github.com/Rebilly/ReDoc/issues/496)



<a name="2.0.0-alpha.21"></a>
# [2.0.0-alpha.21](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2018-05-28)


### Bug Fixes

* add tslib dependency ([8e1a5cb](https://github.com/Rebilly/ReDoc/commit/8e1a5cb))
* **cli:** escape \u2029 \u2028 characters ([5018473](https://github.com/Rebilly/ReDoc/commit/5018473)), closes [#475](https://github.com/Rebilly/ReDoc/issues/475)
* reduce search index size ([a1fa4b4](https://github.com/Rebilly/ReDoc/commit/a1fa4b4))
* replace "oops" with field name 🙈 ([6b1e8e7](https://github.com/Rebilly/ReDoc/commit/6b1e8e7))
* specify caption-side ([64801b0](https://github.com/Rebilly/ReDoc/commit/64801b0)), closes [#509](https://github.com/Rebilly/ReDoc/issues/509)


### Features

* export TypeScript typings ([9115be8](https://github.com/Rebilly/ReDoc/commit/9115be8))
* new theme colors: code and codeBg ([f8b793d](https://github.com/Rebilly/ReDoc/commit/f8b793d))
* new theme option: nestingSpacing ([782ef77](https://github.com/Rebilly/ReDoc/commit/782ef77))



<a name="2.0.0-alpha.20"></a>
# [2.0.0-alpha.20](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2018-05-14)


### Bug Fixes

* fix worker is not defined in lib bundle ([6a5513e](https://github.com/Rebilly/ReDoc/commit/6a5513e))



<a name="2.0.0-alpha.19"></a>
# [2.0.0-alpha.19](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.18...v2.0.0-alpha.19) (2018-05-14)


### Bug Fixes

* change look of additionalProperties ([126c6a6](https://github.com/Rebilly/ReDoc/commit/126c6a6))
* disable chrome tap-highlight on mobile ([09cbe88](https://github.com/Rebilly/ReDoc/commit/09cbe88))
* fix [@observer](https://github.com/observer) on PureComponent warning ([afb11d6](https://github.com/Rebilly/ReDoc/commit/afb11d6))
* fix build caused by new babel decorators syntax, fixes [#487](https://github.com/Rebilly/ReDoc/issues/487) ([01f575c](https://github.com/Rebilly/ReDoc/commit/01f575c))
* fix prism lang dependencies, fixes [#467](https://github.com/Rebilly/ReDoc/issues/467) ([42cf18e](https://github.com/Rebilly/ReDoc/commit/42cf18e))
* fix spelling in error message ([#455](https://github.com/Rebilly/ReDoc/issues/455)) ([64119c4](https://github.com/Rebilly/ReDoc/commit/64119c4))
* limit height of discriminator dropdown, fixes [#484](https://github.com/Rebilly/ReDoc/issues/484) ([6d1a9e5](https://github.com/Rebilly/ReDoc/commit/6d1a9e5))
* path parameters are not correctly override, fixes [#481](https://github.com/Rebilly/ReDoc/issues/481) ([2cf4c3c](https://github.com/Rebilly/ReDoc/commit/2cf4c3c))


### Features

* display scope description as markdown, fixes [#466](https://github.com/Rebilly/ReDoc/issues/466) ([0d6deff](https://github.com/Rebilly/ReDoc/commit/0d6deff))



<a name="2.0.0-alpha.18"></a>
# [2.0.0-alpha.18](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2018-03-23)


### Bug Fixes

* fix logo width ([384c883](https://github.com/Rebilly/ReDoc/commit/384c883))
* modify the peerDependencies to reflect the need for react 16.3 ([b29c329](https://github.com/Rebilly/ReDoc/commit/b29c329))
* scroll to section sooner when SSR + simplify item ids ([d1d8042](https://github.com/Rebilly/ReDoc/commit/d1d8042))
* **cli:** don't wait for content loaded in bundled HTML ([d9ee2d0](https://github.com/Rebilly/ReDoc/commit/d9ee2d0))

<a name="2.0.0-alpha.17"></a>
# [2.0.0-alpha.17](https://github.com/Rebilly/ReDoc/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2018-03-21)


### Bug Fixes

* css fix + update theme ([05403a7](https://github.com/Rebilly/ReDoc/commit/05403a7))
* **cli:** allow to set url to the spec in SSR mode ([c9c6bc5](https://github.com/Rebilly/ReDoc/commit/c9c6bc5))
* **cli:** fix crash ([8891f5c](https://github.com/Rebilly/ReDoc/commit/8891f5c))
* **cli:** fix output option type ([c729c6c](https://github.com/Rebilly/ReDoc/commit/c729c6c))
* **cli:** rename redoc-cli bin ([06b5a00](https://github.com/Rebilly/ReDoc/commit/06b5a00))
* fix second-level heading in description ([a084532](https://github.com/Rebilly/ReDoc/commit/a084532))
* make field type color more dark (closes [#439](https://github.com/Rebilly/ReDoc/issues/439)) ([d27e61a](https://github.com/Rebilly/ReDoc/commit/d27e61a))


### Features

* **cli:** add --template option ([b7afce9](https://github.com/Rebilly/ReDoc/commit/b7afce9))
* **cli:** add options to specify redoc options ([2732c89](https://github.com/Rebilly/ReDoc/commit/2732c89))
* **cli:** add title option to bundle ([bb8a678](https://github.com/Rebilly/ReDoc/commit/bb8a678))
* add more options to theme ([cbce28a](https://github.com/Rebilly/ReDoc/commit/cbce28a))



<a name="1.21.2"></a>
## [1.21.2](https://github.com/Rebilly/ReDoc/compare/v1.21.1...v1.21.2) (2018-02-26)


### Bug Fixes

* missing properties when using complex allOf (regression) ([6ce9245](https://github.com/Rebilly/ReDoc/commit/6ce9245)), closes [#422](https://github.com/Rebilly/ReDoc/issues/422)



<a name="1.21.1"></a>
## [1.21.1](https://github.com/Rebilly/ReDoc/compare/v1.21.0...v1.21.1) (2018-02-23)


### Bug Fixes

* avoid endless recursion in schema-walker in some cases ([309cc23](https://github.com/Rebilly/ReDoc/commit/309cc23)), closes [#418](https://github.com/Rebilly/ReDoc/issues/418) [#395](https://github.com/Rebilly/ReDoc/issues/395)
* fix crash when discriminator is used incorrectly ([b1d928d](https://github.com/Rebilly/ReDoc/commit/b1d928d))



<a name="1.21.0"></a>
# [1.21.0](https://github.com/Rebilly/ReDoc/compare/v1.20.0...v1.21.0) (2018-02-18)


### Bug Fixes

* null example not used in schema samples ([420c51a](https://github.com/Rebilly/ReDoc/commit/420c51a)), closes [#415](https://github.com/Rebilly/ReDoc/issues/415)


### Features

* new option hide-download-button ([454e5bd](https://github.com/Rebilly/ReDoc/commit/454e5bd)), closes [#394](https://github.com/Rebilly/ReDoc/issues/394)



<a name="1.20.0"></a>
## [1.20.0](https://github.com/Rebilly/ReDoc/compare/v1.19.3...v1.20.0) (2018-01-21)


### Bug Fixes

* Path parameters are not correctly overridden ([c406dc5](https://github.com/Rebilly/ReDoc/commit/c406dc5)), closes [#400](https://github.com/Rebilly/ReDoc/issues/400)
* Use parentNode instead of parentElement to fix IE11 crash ([e8adb60](https://github.com/Rebilly/ReDoc/commit/e8adb60)), closes [#406](https://github.com/Rebilly/ReDoc/issues/406)


### Features

* align parameters to match up ([#375](https://github.com/Rebilly/ReDoc/issues/375)) ([d083c16](https://github.com/Rebilly/ReDoc/commit/d083c16))

### Deprecations
* Dropped bower support. No more dist files on the `releases` branch.



<a name="2.0.0-alpha.15"></a>
# [2.0.0-alpha.15](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2018-03-16)


### Bug Fixes

* fix broken css after installing polished ([6018042](https://github.com/Rebilly/Redoc/commit/6018042))


### Features

* more advanced theme engine ([1df690a](https://github.com/Rebilly/Redoc/commit/1df690a))



<a name="2.0.0-alpha.14"></a>
# [2.0.0-alpha.14](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2018-03-15)


### Bug Fixes

* fix CLI crash + build it on travis ([7769ba8](https://github.com/Rebilly/Redoc/commit/7769ba8))



<a name="2.0.0-alpha.13"></a>
# [2.0.0-alpha.13](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2018-03-15)


### Bug Fixes

* A couple minor bug fixes ([#436](https://github.com/Rebilly/Redoc/issues/436)) ([5dc21af](https://github.com/Rebilly/Redoc/commit/5dc21af))
* add extra null-check + warning ([8757fa5](https://github.com/Rebilly/Redoc/commit/8757fa5))
* add logo width to the theme ([28f2391](https://github.com/Rebilly/Redoc/commit/28f2391))
* align logo by center ([18ec3ac](https://github.com/Rebilly/Redoc/commit/18ec3ac))
* discriminator dropdown showing incorrect field if sorted ([bcf39dc](https://github.com/Rebilly/Redoc/commit/bcf39dc))
* fix crash when referencing non-existing security scheme ([1f7fc44](https://github.com/Rebilly/Redoc/commit/1f7fc44))
* fix overflowing content in JSON samples ([02c2413](https://github.com/Rebilly/Redoc/commit/02c2413))
* fix right-panel blinking when scrolling + css improvements ([a78f9ab](https://github.com/Rebilly/Redoc/commit/a78f9ab))
* fix search-indexing for SSR ([1428fb5](https://github.com/Rebilly/Redoc/commit/1428fb5))
* fix the media queries utils so it gets the values from the current theme ([#420](https://github.com/Rebilly/Redoc/issues/420)) ([3924d3c](https://github.com/Rebilly/Redoc/commit/3924d3c))
* fix worker import ([4896346](https://github.com/Rebilly/Redoc/commit/4896346))
* make ReactStandalone react on props changes ([0cb0af2](https://github.com/Rebilly/Redoc/commit/0cb0af2))
* merge inner properties of allOf ([8926dd4](https://github.com/Rebilly/Redoc/commit/8926dd4))
* one-of dropdown not switching ([0f1b6a6](https://github.com/Rebilly/Redoc/commit/0f1b6a6))
* referenced header name is empty ([13165fb](https://github.com/Rebilly/Redoc/commit/13165fb))
* skipReadOnly/skipWritOnly not passing down to nested array ([6df8127](https://github.com/Rebilly/Redoc/commit/6df8127))
* skipReadOnly/skipWritOnly not passing down to nested OneOf ([2462639](https://github.com/Rebilly/Redoc/commit/2462639))
* various search fixes ([b797c96](https://github.com/Rebilly/Redoc/commit/b797c96))
* writeOnly not respected in response samples ([87abdf7](https://github.com/Rebilly/Redoc/commit/87abdf7))


### Features

* add clear icon to searchbox ([825162e](https://github.com/Rebilly/Redoc/commit/825162e))
* add hideDownloadButton option ([8dbe938](https://github.com/Rebilly/Redoc/commit/8dbe938))
* add marker ([1ff2bd8](https://github.com/Rebilly/Redoc/commit/1ff2bd8))
* arrow navigation in search results ([fe3245a](https://github.com/Rebilly/Redoc/commit/fe3245a))
* basis search ([6990cd2](https://github.com/Rebilly/Redoc/commit/6990cd2))
* ReDoc CLI ✨ ([390f6c1](https://github.com/Rebilly/Redoc/commit/390f6c1))
* reqired-first sort order for params ([ecf33d2](https://github.com/Rebilly/Redoc/commit/ecf33d2))
* serialize search-index ([e94f842](https://github.com/Rebilly/Redoc/commit/e94f842))



<a name="2.0.0-alpha.12"></a>
# [2.0.0-alpha.12](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2018-02-07)


### Bug Fixes

* basic responsiveness ([a29c3cc](https://github.com/Rebilly/Redoc/commit/a29c3cc))
* crash in MarkdownRenderer on non-string ([dead161](https://github.com/Rebilly/Redoc/commit/dead161))
* discriminator fix ([ff3bb24](https://github.com/Rebilly/Redoc/commit/ff3bb24))
* filter out non-existing security schemas + warn ([ee822f6](https://github.com/Rebilly/Redoc/commit/ee822f6))
* fix oneOf title for array ([1f3701d](https://github.com/Rebilly/Redoc/commit/1f3701d))
* fix tbody > tr nesting warning ([a3cbb14](https://github.com/Rebilly/Redoc/commit/a3cbb14))
* improve copy tooltip perf ([29207cf](https://github.com/Rebilly/Redoc/commit/29207cf))
* resolve menu synchronization issue (use proper throttle) ([84d1c7b](https://github.com/Rebilly/Redoc/commit/84d1c7b))


### Features

* responsive side menu ([3aab2d9](https://github.com/Rebilly/Redoc/commit/3aab2d9))



<a name="2.0.0-alpha.11"></a>
# [2.0.0-alpha.11](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2018-01-29)


### Bug Fixes

* courier misspelling ([#409](https://github.com/Rebilly/Redoc/issues/409)) ([96fb7ce](https://github.com/Rebilly/Redoc/commit/96fb7ce))
* crash on 2-level md heading at the beginning ([e9f23f7](https://github.com/Rebilly/Redoc/commit/e9f23f7))
* make active tab more clear ([4b5df22](https://github.com/Rebilly/Redoc/commit/4b5df22))
* perfect scroll not working ([199f240](https://github.com/Rebilly/Redoc/commit/199f240))
* use array items example ([12f79f0](https://github.com/Rebilly/Redoc/commit/12f79f0)), closes [#408](https://github.com/Rebilly/Redoc/issues/408)
* wrap text in code samples ([6c71a66](https://github.com/Rebilly/Redoc/commit/6c71a66))


### Features

* port "copy to clipboard" / "expand/collapse all" functionality ([5bb0bdf](https://github.com/Rebilly/Redoc/commit/5bb0bdf)), closes [#410](https://github.com/Rebilly/Redoc/issues/410)



<a name="2.0.0-alpha.9"></a>
# [2.0.0-alpha.9](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2018-01-11)


### Bug Fixes

* handle scrollYOffset in ScrollService ([dcab770](https://github.com/Rebilly/Redoc/commit/dcab770))



<a name="2.0.0-alpha.8"></a>
# [2.0.0-alpha.8](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2018-01-10)


### Bug Fixes

* undo section id + some minor fixes ([0253c5d](https://github.com/Rebilly/Redoc/commit/0253c5d))



<a name="2.0.0-alpha.7"></a>
# [2.0.0-alpha.7](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2018-01-10)


### Bug Fixes

* add id attr to headers to work before react is loaded if ssr ([1743453](https://github.com/Rebilly/Redoc/commit/1743453))
* crate spec as data/base64 link when ssr ([33678e6](https://github.com/Rebilly/Redoc/commit/33678e6))
* example value is not showed if it is false ([9756364](https://github.com/Rebilly/Redoc/commit/9756364))



<a name="2.0.0-alpha.6"></a>
# [2.0.0-alpha.6](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2018-01-10)


### Bug Fixes

* allOf and deref exit not only named refs ([435cccd](https://github.com/Rebilly/Redoc/commit/435cccd))
* do not ignore path level parameters ([14f8408](https://github.com/Rebilly/Redoc/commit/14f8408))
* improve rendering of types ([17da7b7](https://github.com/Rebilly/Redoc/commit/17da7b7))
* move title propagation to the correct place ([0b0bc99](https://github.com/Rebilly/Redoc/commit/0b0bc99))
* overwrite text-align to left ([bfee3ed](https://github.com/Rebilly/Redoc/commit/bfee3ed))


### Features

* initial display security requirements ([50e2a58](https://github.com/Rebilly/Redoc/commit/50e2a58))



<a name="2.0.0-alpha.5"></a>
# [2.0.0-alpha.5](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2017-12-07)


### Bug Fixes

* correct pointer for the schema ([4ae1574](https://github.com/Rebilly/Redoc/commit/4ae1574))
* bundle in reftools in lib build (do not crash on prod builds in create-react-app) ([57129d3](https://github.com/Rebilly/Redoc/commit/57129d3))


<a name="2.0.0-alpha.4"></a>
# [2.0.0-alpha.4](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2017-11-24)


### Bug Fixes

* add ellipsis for menu items with long words ([3421be2](https://github.com/Rebilly/Redoc/commit/3421be2))
* crashes on some dereferencing/allOf merging cases ([335deb9](https://github.com/Rebilly/Redoc/commit/335deb9))
* do not auto-append security-definitions if they are not in the spec ([426e5b6](https://github.com/Rebilly/Redoc/commit/426e5b6))
* don't display operations without tags as tag items in menu ([ca81b6d](https://github.com/Rebilly/Redoc/commit/ca81b6d))



<a name="2.0.0-alpha.3"></a>
# [2.0.0-alpha.3](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2017-11-23)


### Bug Fixes

* crash when $ref is url encoded ([bdf6079](https://github.com/Rebilly/Redoc/commit/bdf6079))
* make oneOf not skip fields defined alongside ([8680775](https://github.com/Rebilly/Redoc/commit/8680775))



<a name="2.0.0-alpha.2"></a>
# 2.0.0-alpha.2 (2017-11-23)

### Bug Fixes
* Fix crash when using type `file` in OpenAPI 2.0 in some places

<a name="2.0.0-alpha.1"></a>
# 2.0.0-alpha.1 (2017-11-23)

Complete rewrite of ReDoc using React so here only major changes are listed.
Complete rewrite also means that this rewrite may introduce issues, but they should be resolved before `2.0.0`.

### Features

- Basic Support for OpenAPI 3
- Usage as a React component

### Deprecations

- Fonts are not loaded by ReDoc so you should load them. Default fonts can be loaded as below:

```html
<link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
```
- no more bower releases
- no more GitHub pages-based CDN. Use [unpkg.com](https://unpkg.com/) to access ReDoc releases


### Known Regression (will be resolved before leaving alpha stage)
- `lazyLoading` option not implemented yet
- Copying to clipboard of samples not implemented yet
- Search not implemented yet

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
<a name="2.0.0-alpha.16"></a>
# [2.0.0-alpha.16](https://github.com/Rebilly/Redoc/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2018-03-18)


### Bug Fixes

* move cli to a separate npm package ([95c7585](https://github.com/Rebilly/Redoc/commit/95c7585))
* prefer `.extend` over `styled()` to make styles more predictable ([ed20ac1](https://github.com/Rebilly/Redoc/commit/ed20ac1))


### Features

* use new Context API for options ([e022349](https://github.com/Rebilly/Redoc/commit/e022349))


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
* A few more minor UI improvements

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
