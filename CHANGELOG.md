# 2.0.0-rc.76 (2022-08-30)


### Bug Fixes

* "API Docs By Redocly" overlapping last element in sidebar ([#2132](https://github.com/Redocly/redoc/issues/2132)) ([c60c6f5](https://github.com/Redocly/redoc/commit/c60c6f58917563d57c0eef650b9dfcece2e15049))
* active menu item scroll into view ([0a01e9a](https://github.com/Redocly/redoc/commit/0a01e9a0803f7641765d2505ee8dfc6ab456134f))
* add browser build for webpack 5 ([#1796](https://github.com/Redocly/redoc/issues/1796)) ([0e43ad3](https://github.com/Redocly/redoc/commit/0e43ad3102cfba8c4b30e59500ad4efc53f01c2d))
* Add debounce for 300 ms when searching ([#1089](https://github.com/Redocly/redoc/issues/1089)) ([373f018](https://github.com/Redocly/redoc/commit/373f018d0c183f83d07a4dbad4a4e2c9ab159f69))
* add extra deref step for anyOf/oneOf variants ([d81b631](https://github.com/Redocly/redoc/commit/d81b63147cd3ab912edb4d6a8ae70235dd211fd2)), closes [#810](https://github.com/Redocly/redoc/issues/810)
* add handle local files for serve command ([#1810](https://github.com/Redocly/redoc/issues/1810)) ([117071e](https://github.com/Redocly/redoc/commit/117071ee83a32d9b3350d8afe2bdb6365a44e2ec))
* add includes polyfill ([3ba622f](https://github.com/Redocly/redoc/commit/3ba622f3ab9e28c954fe05f42e7b90862fc3d544)), closes [#1530](https://github.com/Redocly/redoc/issues/1530)
* add label API docs by Redocly ([#2099](https://github.com/Redocly/redoc/issues/2099)) ([dcdab83](https://github.com/Redocly/redoc/commit/dcdab838903a5d923c5e327d07d7743214769a61))
* add missed labels to elements ([#1445](https://github.com/Redocly/redoc/issues/1445)) ([8c559bc](https://github.com/Redocly/redoc/commit/8c559bcbcde39efee7f1570b88840468bfdfb17c))
* add node version to docker ([#2005](https://github.com/Redocly/redoc/issues/2005)) ([dfacf98](https://github.com/Redocly/redoc/commit/dfacf989bcd17b9cea17bee45a38068e073bb3d6))
* add oneOf buttons vertical space when wrapped to new line ([cd9fd61](https://github.com/Redocly/redoc/commit/cd9fd61831025f994167db6012b1b600610b1362))
* add schema expansion level ([#1868](https://github.com/Redocly/redoc/issues/1868)) ([250d53a](https://github.com/Redocly/redoc/commit/250d53a59fb4bf881875ba466c5a7f3b55d80007))
* add security headers to Docker nginx config ([#1244](https://github.com/Redocly/redoc/issues/1244)) ([4512436](https://github.com/Redocly/redoc/commit/4512436f1d88bd99558fe5f8384b37aa62562480))
* add the latest tag for the CLI docker image ([#2087](https://github.com/Redocly/redoc/issues/2087)) ([80ecd0f](https://github.com/Redocly/redoc/commit/80ecd0f19746379b056bfb1b11950693f3dc3724))
* added missing semicolon to styling ([#1578](https://github.com/Redocly/redoc/issues/1578)) ([dfc4cf1](https://github.com/Redocly/redoc/commit/dfc4cf1caa131aa7bc6da6d489e3a8425d800326))
* allow docker container serving under non-root URLs ([#731](https://github.com/Redocly/redoc/issues/731)) ([cfb6f0f](https://github.com/Redocly/redoc/commit/cfb6f0fde0d5b3bc57f8eb6c7cb90e6f39017116)), closes [#730](https://github.com/Redocly/redoc/issues/730)
* attachHeadingsDescriptions match headings incorrectly ([#1845](https://github.com/Redocly/redoc/issues/1845)) ([ea8573d](https://github.com/Redocly/redoc/commit/ea8573dbd78439be50aa2b38f1c83658c16783e3))
* auth link scroll for Firerox ([#1922](https://github.com/Redocly/redoc/issues/1922)) ([fe67e9c](https://github.com/Redocly/redoc/commit/fe67e9c332fee716582a00d60fdf34767bff22d4))
* auth section appears twice ([5aa7784](https://github.com/Redocly/redoc/commit/5aa77843076558e4e6c27a922f0253d4c84de2d0)), closes [#818](https://github.com/Redocly/redoc/issues/818)
* background-color in search results ([#1531](https://github.com/Redocly/redoc/issues/1531)) ([d288165](https://github.com/Redocly/redoc/commit/d288165a4ea04aedc23dba12020a73e86f20755b))
* broken dropdowns with SSR by using forked react-dropdown-aria ([d009e4a](https://github.com/Redocly/redoc/commit/d009e4a959c9757f4c59b6d324ff354e35e3e920))
* broken headings with single quote ([51d3b9b](https://github.com/Redocly/redoc/commit/51d3b9b02ba77540022cfdc6aaf2c22e3298e3db)), closes [#955](https://github.com/Redocly/redoc/issues/955)
* broken linkify ([3df72fb](https://github.com/Redocly/redoc/commit/3df72fb99ff24fb9a551565b7568d96f8614ed6f)), closes [#1655](https://github.com/Redocly/redoc/issues/1655)
* broken paths when budle or serve using cli ([#1572](https://github.com/Redocly/redoc/issues/1572)) ([cc04106](https://github.com/Redocly/redoc/commit/cc04106a68b2d69638385ac796f666e7ee197301))
* broken schema talbes with long enums ([3a74b74](https://github.com/Redocly/redoc/commit/3a74b745b12c5e399e1fdbcbc0cb466c36f4de16))
* bump json-pointer version to avoid CVE-2021-23820 ([#1910](https://github.com/Redocly/redoc/issues/1910)) ([777efdd](https://github.com/Redocly/redoc/commit/777efdde35c1c8dc79dd714e1666279e9192dddb))
* change fontFamily for EndpointInfo ([#866](https://github.com/Redocly/redoc/issues/866)) ([851b133](https://github.com/Redocly/redoc/commit/851b1337cbf30bff1475946994df85a499dcc52f))
* change the title of "Security Scheme Type" to match "HTTP Authorization Scheme" ([#1126](https://github.com/Redocly/redoc/issues/1126)) ([289c8e6](https://github.com/Redocly/redoc/commit/289c8e6ae1ff00371f86d3f2646607c64bc30050))
* changed several components style font-family to monospace ([#1063](https://github.com/Redocly/redoc/issues/1063)) ([0c20e64](https://github.com/Redocly/redoc/commit/0c20e641783581d227e6d97840c3434c04d73880)), closes [#909](https://github.com/Redocly/redoc/issues/909)
* clean up field values display ([#855](https://github.com/Redocly/redoc/issues/855)) ([5c91590](https://github.com/Redocly/redoc/commit/5c915906c84a81121876c135f26eb3a24725077b))
* clicking on group title breaks first tag ([4649683](https://github.com/Redocly/redoc/commit/4649683785ac36320084e6f425cb3e23f053951b)), closes [#1034](https://github.com/Redocly/redoc/issues/1034)
* constraints label details ([eb0917d](https://github.com/Redocly/redoc/commit/eb0917d002e57353027fee9c8f07605de8f1ff6f))
* correct URLs of OperationModel servers for static site generation ([#2081](https://github.com/Redocly/redoc/issues/2081)) ([b1afd08](https://github.com/Redocly/redoc/commit/b1afd08bcf83770b537ed1eb9c90341de0162a1c))
* crash in node due to broken URL parsing ([8df2b97](https://github.com/Redocly/redoc/commit/8df2b97a669485d9a15a45ef252c26888df778f8))
* crash on multiple examples on parameter object ([0dce880](https://github.com/Redocly/redoc/commit/0dce880dce1e489c7e8963e352d97603262f4b86)), closes [#1485](https://github.com/Redocly/redoc/issues/1485)
* crash to wrong spelling in localeCompare ([3908a7c](https://github.com/Redocly/redoc/commit/3908a7c46448d277b82318659cdea65db52f9e70)), closes [#1218](https://github.com/Redocly/redoc/issues/1218)
* crash with empty servers with redoc-cli ([3d52b39](https://github.com/Redocly/redoc/commit/3d52b392745fa2151b524ee40903347c6261b92b))
* deep linking sometimes not working when sent over messengers ([2491d97](https://github.com/Redocly/redoc/commit/2491d970def837b2f5a0743c5eb73d7ca768fe88))
* Default boolean property value not rendered [#1779](https://github.com/Redocly/redoc/issues/1779) ([#1781](https://github.com/Redocly/redoc/issues/1781)) ([734080c](https://github.com/Redocly/redoc/commit/734080c35471d16f87004f7f9a51dcdeee1278a6))
* default style and explode for params ([633d712](https://github.com/Redocly/redoc/commit/633d71293fa9af2bda3bf456a9258625ee2b94a1)), closes [#1016](https://github.com/Redocly/redoc/issues/1016)
* definition name util ([#1865](https://github.com/Redocly/redoc/issues/1865)) ([95a7347](https://github.com/Redocly/redoc/commit/95a734793158d4749e98ee4a7e90e70713a04ced))
* depreacate x-code-samples, rename to x-codeSamples for consistency ([becc2f5](https://github.com/Redocly/redoc/commit/becc2f58568388b6500e6476874f27f62ff58ba9))
* discriminator and oneOf title fix ([a3d7d7a](https://github.com/Redocly/redoc/commit/a3d7d7a32c2e95952348c16b5f295cbc1030e697))
* display response code at the top after adding a line break ([#1374](https://github.com/Redocly/redoc/issues/1374)) ([c801b87](https://github.com/Redocly/redoc/commit/c801b87d2aea5e17d35093e2548e1f51f42b1ee3))
* do not add extra slashes to pattern ([70d1ee9](https://github.com/Redocly/redoc/commit/70d1ee9eddebf0dacce5443ed878236db5f6257c)), closes [#983](https://github.com/Redocly/redoc/issues/983)
* do not collapse top level on Collapse All in json samples ([#1209](https://github.com/Redocly/redoc/issues/1209)) ([830371b](https://github.com/Redocly/redoc/commit/830371b5d1edf4ba7a138b3b3d78148d020e0349))
* do not crash for invalid parameter.in value ([addf895](https://github.com/Redocly/redoc/commit/addf8956e33654a1586a8ac6ed7325519cd99da8)), closes [#1340](https://github.com/Redocly/redoc/issues/1340)
* do not crash on empty scopes ([e787d9e](https://github.com/Redocly/redoc/commit/e787d9e276ea85958a3b0258b8443ad3067efaf4)), closes [#1044](https://github.com/Redocly/redoc/issues/1044)
* do not crash on incompatible allOf, console.warn instead ([6e607b9](https://github.com/Redocly/redoc/commit/6e607b9a2928b062c7705087432c0f0d88e74f5d)), closes [#1156](https://github.com/Redocly/redoc/issues/1156)
* do not display long regexps ([#1295](https://github.com/Redocly/redoc/issues/1295)) ([2ede22c](https://github.com/Redocly/redoc/commit/2ede22c45cc970ea1ac296adbae1f6032744f823))
* do not load SearchWorker if disableSearch is `true` ([#1191](https://github.com/Redocly/redoc/issues/1191)) ([af415e8](https://github.com/Redocly/redoc/commit/af415e89e8c074a3f7c84f76f24020a7bd545483)), closes [#764](https://github.com/Redocly/redoc/issues/764)
* do not process oneOf if inherited from parent with discriminator ([5248415](https://github.com/Redocly/redoc/commit/52484157912d908daea8255d0b7d684b33258d7a))
* do not URI-encode parameter values for better readability ([6aeb0bf](https://github.com/Redocly/redoc/commit/6aeb0bf68df3f03f2ca1317f8b5787545bd363f1)), closes [#1138](https://github.com/Redocly/redoc/issues/1138)
* download button opens in new tab instead of downloading ([b59faad](https://github.com/Redocly/redoc/commit/b59faada8210a4c8f61fa0e850b7d844574a46d1)), closes [#1247](https://github.com/Redocly/redoc/issues/1247)
* dropdown fixes related to object description ([0504ad4](https://github.com/Redocly/redoc/commit/0504ad4b76aacf3aae098b5610c2a6250bf2f30c))
* duplicate keys in request samples ([3ce5bff](https://github.com/Redocly/redoc/commit/3ce5bff4380e726ffdd529d168bd7d336a76a2d0)), closes [#815](https://github.com/Redocly/redoc/issues/815)
* duplication of title ([#2119](https://github.com/Redocly/redoc/issues/2119)) ([40ebfd2](https://github.com/Redocly/redoc/commit/40ebfd2d63758b37665e2e4447732f671811e2a5))
* empty servers behaviour per OAS spec ([ed1db0c](https://github.com/Redocly/redoc/commit/ed1db0c9027087ae0ae923e390e3e1d638a647ae)), closes [#1151](https://github.com/Redocly/redoc/issues/1151)
* encode URLs in json samples linkify (xss) ([62c01da](https://github.com/Redocly/redoc/commit/62c01da420fca2137674ae562d4ecba54db97da9))
* encode x-www-form-urlencoded examples correctly ([65930ad](https://github.com/Redocly/redoc/commit/65930ad7ee8c1bf566582490772b2c07e9f7f269)), closes [#870](https://github.com/Redocly/redoc/issues/870)
* encoding issue in CDN responses ([#2130](https://github.com/Redocly/redoc/issues/2130)) ([7816902](https://github.com/Redocly/redoc/commit/781690284a45b2b8af9eb525757632d0d19ef453))
* enum duplication values when schema uses a specific combination of oneOf and allOf([#2088](https://github.com/Redocly/redoc/issues/2088)) ([e411847](https://github.com/Redocly/redoc/commit/e4118479f69209c5dd09a2be0e978834dcd9eb8f))
* enum list doesn't wrap ([bfbb0c1](https://github.com/Redocly/redoc/commit/bfbb0c178779288acd24c0d319e9c4c4a43141b9)), closes [#993](https://github.com/Redocly/redoc/issues/993)
* escape backslashes in string literals ([#823](https://github.com/Redocly/redoc/issues/823)) ([70faca1](https://github.com/Redocly/redoc/commit/70faca17b68a3aa3e78a51a238d8090535ae1961)), closes [#822](https://github.com/Redocly/redoc/issues/822)
* escape quotes in string values ([0473165](https://github.com/Redocly/redoc/commit/04731656db14d4851c07a2264aac71f6e9a5ba02)), closes [#882](https://github.com/Redocly/redoc/issues/882)
* examples in json schemas ([5b9aa27](https://github.com/Redocly/redoc/commit/5b9aa27af03a1c4616f7e0195afeba47d1deeaa0))
* exclusiveMin/Max shows incorect range ([#1799](https://github.com/Redocly/redoc/issues/1799)) ([b604bd8](https://github.com/Redocly/redoc/commit/b604bd8da874f07e9e9f8b193ad10117a5f5059c))
* Expand/Collapse all buttons disappears for flat structures ([#1424](https://github.com/Redocly/redoc/issues/1424)) ([2ca8e08](https://github.com/Redocly/redoc/commit/2ca8e081baea6996eb01b5df27b8cd88331d5c96))
* external ref in schema definition ([#1894](https://github.com/Redocly/redoc/issues/1894)) ([57cdd9f](https://github.com/Redocly/redoc/commit/57cdd9f6da38418d6214ac3c6480c5847ecd0228))
* false-positive recursive detection with allOf at the same level ([faa74d6](https://github.com/Redocly/redoc/commit/faa74d60026bf1900309f5bb7b1e9a331f7a2d96))
* false-positive recursive detection with oneOf ([59eaa8d](https://github.com/Redocly/redoc/commit/59eaa8d63309111a2c1c103df7f13891216acaa4)), closes [#723](https://github.com/Redocly/redoc/issues/723) [#585](https://github.com/Redocly/redoc/issues/585)
* false-positive recursive tag case when using oneOf + allOf ([#1534](https://github.com/Redocly/redoc/issues/1534)) ([8270481](https://github.com/Redocly/redoc/commit/8270481e9f0f381b392f7921d21cb06e0e673b6d))
* fix accidentally removed onLoaded ([b41a8b4](https://github.com/Redocly/redoc/commit/b41a8b4ac714084dc25de7914fa1f99386e907e2)), closes [#1656](https://github.com/Redocly/redoc/issues/1656)
* fix arrow color in responses ([#1452](https://github.com/Redocly/redoc/issues/1452)) ([6bedcf9](https://github.com/Redocly/redoc/commit/6bedcf94b26d820101ab510b28d2b76a38999eea))
* fix broken CLI again ([4e12b5d](https://github.com/Redocly/redoc/commit/4e12b5dbd65ce47e9f961738fb20dcb49694cbee))
* fix broken md headings with ampersand ([8460659](https://github.com/Redocly/redoc/commit/846065916d58cf628f0bc93c74be429ecdea12e7)), closes [#1173](https://github.com/Redocly/redoc/issues/1173)
* fix broken observable after mobx upgrade ([#1415](https://github.com/Redocly/redoc/issues/1415)) ([26c407b](https://github.com/Redocly/redoc/commit/26c407bd0f2bc1ec9881e0a3668e09e645fc0cc0))
* fix broken sticky sidebar in Chrome 80 ([1a2a7dd](https://github.com/Redocly/redoc/commit/1a2a7dd8331cedd6ced4c18accf0b417549b3ff3)), closes [#1167](https://github.com/Redocly/redoc/issues/1167)
* fix contrast ratio for response titles ([47c6319](https://github.com/Redocly/redoc/commit/47c63192062d87b2b3205b915472930eaff6cc03))
* fix deref logic for oas3.1 ([#1767](https://github.com/Redocly/redoc/issues/1767)) ([4fb9c83](https://github.com/Redocly/redoc/commit/4fb9c835256b9e44bcecabde7baf0f0f3e5beb3f))
* fix displaying response title ([#1376](https://github.com/Redocly/redoc/issues/1376)) ([f3e8ab4](https://github.com/Redocly/redoc/commit/f3e8ab4f8e5522c9ea1ddedb143e23c7d62f5807))
* fix displaying top-level object without any properties ([a5468fb](https://github.com/Redocly/redoc/commit/a5468fb7bb99fcfe33724af939b1a589c1219052))
* fix duplicated content in tags when using md headings ([a260c84](https://github.com/Redocly/redoc/commit/a260c8414c34a259a70a20ebcd20ecbb06c3d250)), closes [#1150](https://github.com/Redocly/redoc/issues/1150) [#1152](https://github.com/Redocly/redoc/issues/1152)
* fix escaping JSON string values ([58cb20d](https://github.com/Redocly/redoc/commit/58cb20d4b253471515886f3901f864080aa88212)), closes [#999](https://github.com/Redocly/redoc/issues/999)
* fix expand variable for vars with hyphens or dots ([0904b3f](https://github.com/Redocly/redoc/commit/0904b3fec24edc56c4a4951501fe02ae22fd852b)), closes [#926](https://github.com/Redocly/redoc/issues/926)
* fix fields table overflow if deeply nested with long title ([12b7057](https://github.com/Redocly/redoc/commit/12b7057055686f59c8932b0b1a43a1d52b549ca8))
* fix logo gutter bg ([81896d3](https://github.com/Redocly/redoc/commit/81896d32b81b6258fd5c7a19b3b4be62f2697930))
* fix logo gutter bg ([4c59628](https://github.com/Redocly/redoc/commit/4c59628e142769fe838b96fc935ac04f23710840))
* fix major search performance due to wrong marker element ([8c053cc](https://github.com/Redocly/redoc/commit/8c053cc474e88befc3338307317c0702d212d4c3)), closes [#1109](https://github.com/Redocly/redoc/issues/1109)
* fix missing parameters ([942d782](https://github.com/Redocly/redoc/commit/942d782b5a8d08767a7538741b75587cf1e67f44)), closes [#1142](https://github.com/Redocly/redoc/issues/1142)
* fix passing boolean value to showExtensions options ([#1211](https://github.com/Redocly/redoc/issues/1211)) ([c6eaa02](https://github.com/Redocly/redoc/commit/c6eaa0281bb0f62b019c865e4aefb863ce84d628))
* fix redoc-cli broken dependencies ([81a7568](https://github.com/Redocly/redoc/commit/81a756864dbe82f2f945d8e09fef1dce91e42566))
* fix regression double slashes added to full URL display ([f29a4fe](https://github.com/Redocly/redoc/commit/f29a4fe2eee39f7ef018c125d460ee8898856ce4))
* fix scroll in example dropdown ([#1803](https://github.com/Redocly/redoc/issues/1803)) ([bc2d9a7](https://github.com/Redocly/redoc/commit/bc2d9a7d9cd530274483fecd136db290a5b46ff7))
* fix scrollYOffset when SSR ([d09c1c1](https://github.com/Redocly/redoc/commit/d09c1c1086377e1c74232ccb03e33491606fe95b))
* fix scrollYOffset when SSR ([21258a5](https://github.com/Redocly/redoc/commit/21258a5b617f70299b2e0ef539d797dd46080e78))
* fix sortByRequired (stabilise sort) ([#1136](https://github.com/Redocly/redoc/issues/1136)) ([d92434d](https://github.com/Redocly/redoc/commit/d92434d11b08e8b0f6be5453ec69aa1d0e0df79f)), closes [#1104](https://github.com/Redocly/redoc/issues/1104) [#1121](https://github.com/Redocly/redoc/issues/1121) [#1061](https://github.com/Redocly/redoc/issues/1061)
* fix SourceCodeWithCopy component to be non-pure ([040ce72](https://github.com/Redocly/redoc/commit/040ce72a8ae0c1ca7504e10e44d0b2ac7ba04977))
* fix spacing with nested markdown lists ([f2f6909](https://github.com/Redocly/redoc/commit/f2f6909835ddfe8d9d0611a93cbf48280846ea41)), closes [#718](https://github.com/Redocly/redoc/issues/718)
* fix ssr usage after migrating to esbuild pipeline ([8ded769](https://github.com/Redocly/redoc/commit/8ded7699eed82346244308a5018526cd91cb4b24))
* fix the name of OpenID Connect security scheme ([#1425](https://github.com/Redocly/redoc/issues/1425)) ([c11f679](https://github.com/Redocly/redoc/commit/c11f679f82586a96225488c8a96d0c908bfd2e09))
* h2 padding on mobile ([7ed1a7e](https://github.com/Redocly/redoc/commit/7ed1a7ef0e7978a0dfb40afcc72c3362466f9624)), closes [#1118](https://github.com/Redocly/redoc/issues/1118)
* handle empty object in security array ([#1678](https://github.com/Redocly/redoc/issues/1678)) ([9e1ea70](https://github.com/Redocly/redoc/commit/9e1ea703e56a71567b13d0d22e2d69945a22de4d))
* handle error if security scopes is invalid ([#2113](https://github.com/Redocly/redoc/issues/2113)) ([428fd69](https://github.com/Redocly/redoc/commit/428fd6983dc257f524121d98aeb1c58b39cf81f7))
* handle error when definition load fails ([#1979](https://github.com/Redocly/redoc/issues/1979)) ([508ebd5](https://github.com/Redocly/redoc/commit/508ebd58a3d66f2337e9641852322458a1bd9e6b))
* handled style change in ServerUrl and ServersOverlay dynamically ([#1989](https://github.com/Redocly/redoc/issues/1989)) ([a366de4](https://github.com/Redocly/redoc/commit/a366de4cf67fb94baa33b7b5c311cc1f54a63e53))
* hide dropdown input on IE 11 ([#1403](https://github.com/Redocly/redoc/issues/1403)) ([6632d84](https://github.com/Redocly/redoc/commit/6632d844536532227cb92290f9fc2b6b2f913270))
* hide empty example when it is not defined ([4bd499f](https://github.com/Redocly/redoc/commit/4bd499f0e968c15d9cb1fb870e0985fd8b07fcbc))
* hideLoading options in redoc standalone ([#1709](https://github.com/Redocly/redoc/issues/1709)) ([6a52a16](https://github.com/Redocly/redoc/commit/6a52a16d5b75a2955da7217c4a264f0fa8e98c89))
* highlight json keys using different color ([#1287](https://github.com/Redocly/redoc/issues/1287)) ([c9596d4](https://github.com/Redocly/redoc/commit/c9596d4b6cd9dced9fdee77525e0da90960c562a))
* highlight text syntax ([#2069](https://github.com/Redocly/redoc/issues/2069)) ([4fc6aa0](https://github.com/Redocly/redoc/commit/4fc6aa0859c94e25fd30c4a4250455e44cc76488))
* IE11 add missing fetch and URL polyfills ([d2ce1bd](https://github.com/Redocly/redoc/commit/d2ce1bd928ed53db80314fefd5a9e99f8a556e8f)), closes [#875](https://github.com/Redocly/redoc/issues/875)
* IE11, add missing Object.assign polyfill ([888f04e](https://github.com/Redocly/redoc/commit/888f04e87204b19530294e5dcb91173bb0dd313d))
* ignore empty x-tagGroups array ([#869](https://github.com/Redocly/redoc/issues/869)) ([4366a0d](https://github.com/Redocly/redoc/commit/4366a0d1223d493b6b286dca45e2bf03893ea29c))
* improve customization fab ([#1891](https://github.com/Redocly/redoc/issues/1891)) ([635f379](https://github.com/Redocly/redoc/commit/635f379eb086268c91eef715148eca8f080cfb86))
* improve markdown render with CRLF ([#1953](https://github.com/Redocly/redoc/issues/1953)) ([aba2d1a](https://github.com/Redocly/redoc/commit/aba2d1ad2d8dda9f52055c36ebde1323457dfd3e))
* improve mime-type dropdown font ([ce885f8](https://github.com/Redocly/redoc/commit/ce885f864a4da300dd54e28242c3dc4a99db08aa))
* improve names for some theme settings ([a0bd27c](https://github.com/Redocly/redoc/commit/a0bd27c75427a39abc9c753b0654678eed2f3851))
* improve openapi 3.1 ([#1700](https://github.com/Redocly/redoc/issues/1700)) ([cd2d6f7](https://github.com/Redocly/redoc/commit/cd2d6f76e87c8385786a9c8e51c0d11c79d9707c))
* improve publish action scripts ([#1729](https://github.com/Redocly/redoc/issues/1729)) ([952c05c](https://github.com/Redocly/redoc/commit/952c05c6b4b95fe6082611fed9e2f0913272b904))
* incorrect detected schema title for deeply inherited schemas ([7d7b4e3](https://github.com/Redocly/redoc/commit/7d7b4e3fb870e70b2ed95338769dfbf8bd42ec14))
* incorrect serialization of parameter sample with hypen ([f7dd658](https://github.com/Redocly/redoc/commit/f7dd658a01158fb038fe3a7cea210657dcebff52))
* incorrect serialization of some parameter samples ([aba45db](https://github.com/Redocly/redoc/commit/aba45dbbe6a15af5419e0d2bf38d5aac5e5a9030)), closes [#992](https://github.com/Redocly/redoc/issues/992)
* increase colors contrast to make them more accessible ([#1433](https://github.com/Redocly/redoc/issues/1433)) ([e2de5b0](https://github.com/Redocly/redoc/commit/e2de5b065eabd00d301ea61106ddafc65bd83afa))
* invalid discriminator dropdown behaviour with enum ([be07197](https://github.com/Redocly/redoc/commit/be07197e6d1e85a3fd3e61189a36b288751c077d))
* invalid url when href is empty ([#2105](https://github.com/Redocly/redoc/issues/2105)) ([e5f0235](https://github.com/Redocly/redoc/commit/e5f02359851a3797283ee513d734ab8e27266b92))
* invalidate cache action ([#2138](https://github.com/Redocly/redoc/issues/2138)) ([c7d5ae0](https://github.com/Redocly/redoc/commit/c7d5ae03efb42579e832beefd4f8d1732fc5257d))
* issue with navigation when operationId contains backslash or quotes ([#1513](https://github.com/Redocly/redoc/issues/1513)) ([8f7e56c](https://github.com/Redocly/redoc/commit/8f7e56c747d88be5c5eb5c4bbaee0ff69e9cb2ec))
* keep 3-column layout on 13-inch mbp ([8d1d4c8](https://github.com/Redocly/redoc/commit/8d1d4c82e1377aecf936985ac13fa9bf5257562a))
* large text in examples value ([#1974](https://github.com/Redocly/redoc/issues/1974)) ([60bc603](https://github.com/Redocly/redoc/commit/60bc603e9bb85a0c9c7ac38f7014876d397f0191))
* left menu item before group is not highligted ([67e2a8f](https://github.com/Redocly/redoc/commit/67e2a8fb797a525ae80782c10c0ab030da0367a0)), closes [#1033](https://github.com/Redocly/redoc/issues/1033)
* limit autogen json samples depth to 10 ([d09e744](https://github.com/Redocly/redoc/commit/d09e744d1567fd8bd288d662b4a9c94a4061ed29))
* make callbacks expandable by keyboard ([#1354](https://github.com/Redocly/redoc/issues/1354)) ([46eee7b](https://github.com/Redocly/redoc/commit/46eee7b70c8ee9da0d8857a823c4df39a5f18b53))
* make dropdowns accessible by keyboard ([e8a0d10](https://github.com/Redocly/redoc/commit/e8a0d105ca52204b0d6fd61f5e909d9dbbe6f147))
* make elements accessible by keyboard navigation tools ([#1339](https://github.com/Redocly/redoc/issues/1339)) ([2ce7189](https://github.com/Redocly/redoc/commit/2ce71895bc14f9189b4e6cbdb6d838898717823f))
* make endpoint dropdown accessible ([3d25005](https://github.com/Redocly/redoc/commit/3d25005f084f06ac01b8fa13eb1d69092e99fd27))
* make example/defaults badge consistent with code blocks ([fa39ce4](https://github.com/Redocly/redoc/commit/fa39ce4eef5eaecb046d7c14a874a1134c804989))
* make padding for md code blocks and code samples consistent ([007752d](https://github.com/Redocly/redoc/commit/007752dfc41c56646717f20dfe63e32ac874952f))
* make properties focusable ([05fd754](https://github.com/Redocly/redoc/commit/05fd7543a29e0aeb364c1ba3f2d736656de7b3b7))
* make response sections focusable ([442014c](https://github.com/Redocly/redoc/commit/442014c06d6a7d2260adf7bc5798dd29869f10c9))
* make sample controls focusable ([006031c](https://github.com/Redocly/redoc/commit/006031c51787b617f2b0aed80a4b8486c5d2d3ca))
* make samples accessible by keyboard ([#1401](https://github.com/Redocly/redoc/issues/1401)) ([146b38c](https://github.com/Redocly/redoc/commit/146b38c9d0b926765d8e00dd37204c30bf3ac4e0))
* make schema layout more responsive on small screen ([#1411](https://github.com/Redocly/redoc/issues/1411)) ([84ab95d](https://github.com/Redocly/redoc/commit/84ab95ddc7b5dc159098aecf82ad922ffd4a3093))
* make syntax highlighting for md js code blocks same as for payload samples ([d197c0f](https://github.com/Redocly/redoc/commit/d197c0feda1b789d6076e615273e1880282302e9))
* markdown in examples descriptions + minor ui tweaks ([f52d9e8](https://github.com/Redocly/redoc/commit/f52d9e875b371295d2df19e8abdf06604a5a9d78))
* merge allOf in correct order ([#2020](https://github.com/Redocly/redoc/issues/2020)) ([1e4ea03](https://github.com/Redocly/redoc/commit/1e4ea03d4a9b7eddf3e4cc7cbdbd4d913583e837))
* merge reference for openapi 3.1 ([#2063](https://github.com/Redocly/redoc/issues/2063)) ([87541e4](https://github.com/Redocly/redoc/commit/87541e45dc2526696deb32a6350a14a44a709b54))
* mobile view in docker image ([#1795](https://github.com/Redocly/redoc/issues/1795)) ([ad652b9](https://github.com/Redocly/redoc/commit/ad652b9c7fbcd84a6e83397272de64e57213fe9a))
* move comma out of code block in SecurityRequirement.tsx ([#1924](https://github.com/Redocly/redoc/issues/1924)) ([ab3e8a8](https://github.com/Redocly/redoc/commit/ab3e8a8f80f453066c5495e73ac932a8fef0830a))
* move swagger2openapi to deps because of missing transitive deps ([ed9b878](https://github.com/Redocly/redoc/commit/ed9b878efe9566ef7aad7b20c74fc3366a566335))
* nested items with refs ([#2035](https://github.com/Redocly/redoc/issues/2035)) ([51127aa](https://github.com/Redocly/redoc/commit/51127aadc3e6b0f8e4066afb1c3b2ea6db453da2))
* nested patternProperties ([#2073](https://github.com/Redocly/redoc/issues/2073)) ([9920991](https://github.com/Redocly/redoc/commit/99209910806b85289a89fb3131049ed79118bc72))
* No match scenario in search ([#1667](https://github.com/Redocly/redoc/issues/1667)) ([352a851](https://github.com/Redocly/redoc/commit/352a8518576dfb6b240ec41212a64f1c7312ab67))
* No maxLength label is displayed for arrays of items [#1701](https://github.com/Redocly/redoc/issues/1701) ([#1765](https://github.com/Redocly/redoc/issues/1765)) ([6c7685e](https://github.com/Redocly/redoc/commit/6c7685e5fa04314328a445d7077600692c49489c))
* no quotes for default values in header fields. ([#1059](https://github.com/Redocly/redoc/issues/1059)) ([b5af71d](https://github.com/Redocly/redoc/commit/b5af71da5f57fc7dc484e2b9f939ef67dbe930c4))
* not show scopes if keys empty or not exist ([#1975](https://github.com/Redocly/redoc/issues/1975)) ([4e793f0](https://github.com/Redocly/redoc/commit/4e793f07a81fa8bcd4ad384d1f87b3e6c290edb7))
* nullable object's fields were missing ([#1721](https://github.com/Redocly/redoc/issues/1721)) ([ddf297b](https://github.com/Redocly/redoc/commit/ddf297b11269ef515bd62771912a5609721d5e39))
* Only display API version if present ([#773](https://github.com/Redocly/redoc/issues/773)) ([fb3cb36](https://github.com/Redocly/redoc/commit/fb3cb3627bceb93297eddf3a8ab70f7c4defc990))
* OpenAPI 3.1: Missing description when $ref used [#1727](https://github.com/Redocly/redoc/issues/1727) ([fe6909e](https://github.com/Redocly/redoc/commit/fe6909ed80dd6053b48c30f63a2460614bf957a9))
* OpenAPI 3.1: Missing description when $ref used [#1727](https://github.com/Redocly/redoc/issues/1727) ([35f7787](https://github.com/Redocly/redoc/commit/35f77878de7d1dd250040771f17757a5a6ce85f9))
* operation url in static page ([#2093](https://github.com/Redocly/redoc/issues/2093)) ([98eec19](https://github.com/Redocly/redoc/commit/98eec19647b63f3598ec30fdeb428f614cf93ad4))
* Optional authentication not rendered properly ([#2117](https://github.com/Redocly/redoc/issues/2117)) ([#2134](https://github.com/Redocly/redoc/issues/2134)) ([efd5e09](https://github.com/Redocly/redoc/commit/efd5e09c907b36a3999f4c9c3165b6b2bdc1d536))
* organize response examples in dropdown and display description ([995e557](https://github.com/Redocly/redoc/commit/995e557d6d1a4759045415754628f962146d0a3b))
* package-lock ([#1888](https://github.com/Redocly/redoc/issues/1888)) ([b474d67](https://github.com/Redocly/redoc/commit/b474d679b53cb6b4bfc97f829ad487e6c07dde9f))
* parse json theme string for standalone tag ([#1492](https://github.com/Redocly/redoc/issues/1492)) ([d7a0a4d](https://github.com/Redocly/redoc/commit/d7a0a4da17241dd9c089202dba76a8312248616e))
* pass boolean and number values as a string in highlight function ([#1512](https://github.com/Redocly/redoc/issues/1512)) ([c874a59](https://github.com/Redocly/redoc/commit/c874a5942c3bf9f6a2dc5909e31d57925d40aa86))
* pattern constrain spacing ([c7436f2](https://github.com/Redocly/redoc/commit/c7436f2ceec8bc4edd9e007c1afd14f8d7c83bb3))
* pin lunr version in ReDoc ([178ff4c](https://github.com/Redocly/redoc/commit/178ff4c3651871c8e452c252051158f1ee883f1d)), closes [#844](https://github.com/Redocly/redoc/issues/844)
* pluralize arrray of types ([fdcac30](https://github.com/Redocly/redoc/commit/fdcac3082926c81339841500fda92fc8f652d7bd))
* prefix operation ids with parent id ([#1245](https://github.com/Redocly/redoc/issues/1245)) ([fd8917e](https://github.com/Redocly/redoc/commit/fd8917e5c109840c1bfa4c2c0902b6dcec200286))
* prevent body scrolling when user scrolls side menu ([#1300](https://github.com/Redocly/redoc/issues/1300)) ([865a56a](https://github.com/Redocly/redoc/commit/865a56a2a9a105ef7b3b9150767399ca7339195a))
* proper search-index dispose ([9dd129d](https://github.com/Redocly/redoc/commit/9dd129d90b87f24ad20f084c44d48be50d750c94))
* property with nested allOf ([#2083](https://github.com/Redocly/redoc/issues/2083)) ([7cc0500](https://github.com/Redocly/redoc/commit/7cc0500f3c1ddd1da17ee31278468207093f9281))
* publishing docker image to github packages ([#2115](https://github.com/Redocly/redoc/issues/2115)) ([250f6d1](https://github.com/Redocly/redoc/commit/250f6d12b2d31d2166990bd9cb83ca1c63509686))
* python comment stripped in headings ([4a25aae](https://github.com/Redocly/redoc/commit/4a25aaef69fad814836392ea7e41eb32c182a261)), closes [#1116](https://github.com/Redocly/redoc/issues/1116)
* recursion for boolean items ([#2097](https://github.com/Redocly/redoc/issues/2097)) ([a5804db](https://github.com/Redocly/redoc/commit/a5804db1ce60ee6d90db8a3b54138eb1ca420c6f))
* Redoc spelling ([c87600d](https://github.com/Redocly/redoc/commit/c87600d520f037d291169b44b5803a35af16b5a5))
* Redocly logo ([#2109](https://github.com/Redocly/redoc/issues/2109)) ([a35bb3f](https://github.com/Redocly/redoc/commit/a35bb3ff26bf10b0e54383222df283800d6ee2c8))
* remove dropdown-aria and use native select ([#1954](https://github.com/Redocly/redoc/issues/1954)) ([186f5a9](https://github.com/Redocly/redoc/commit/186f5a98bd466b1820121aadb865291bef8c6755))
* remove duplicated slash if hideHostname option enabled ([#1448](https://github.com/Redocly/redoc/issues/1448)) ([4729fc3](https://github.com/Redocly/redoc/commit/4729fc3d8fc83f4af087cd7932adf500b45bab4e))
* remove excessive whitespace between md sections on small screens ([e318fb3](https://github.com/Redocly/redoc/commit/e318fb3381557e71683d6473a5a4d6ba9a0a9055)), closes [#874](https://github.com/Redocly/redoc/issues/874)
* remove hardcoded fontFamily for oneOf labels ([094ce91](https://github.com/Redocly/redoc/commit/094ce914e3f9cfe567b39db4ea88208014d8b686)), closes [#1120](https://github.com/Redocly/redoc/issues/1120)
* remove huge space after Authentication section ([548fae3](https://github.com/Redocly/redoc/commit/548fae3cbcfc3999cfdb1c8ac582bad30b0afe97)), closes [#872](https://github.com/Redocly/redoc/issues/872)
* remove implicit discriminator mapping when explicit is present ([cbb9f50](https://github.com/Redocly/redoc/commit/cbb9f50fa02da6c05c9bdd0c5d3859e37a5bb1b2))
* remove query string from server URL ([#895](https://github.com/Redocly/redoc/issues/895)) ([64453ff](https://github.com/Redocly/redoc/commit/64453ff6cdb67079e9413ad97d690d635b55ab6b))
* remove tabs top margin ([5c187f3](https://github.com/Redocly/redoc/commit/5c187f34c9f6759b02eae127e1b0c3b90fa5be92))
* rename bandle command and add deprecate notice ([#1935](https://github.com/Redocly/redoc/issues/1935)) ([eb096b6](https://github.com/Redocly/redoc/commit/eb096b69be52568fc581027161c7d0c4b26c56c1))
* rename ObjectDescription to SchemaDefinition as discussed ([4496622](https://github.com/Redocly/redoc/commit/4496622438a1a314300ed796b4be267699869d13))
* resolve dependency conflict in installing ([#2060](https://github.com/Redocly/redoc/issues/2060)) ([e26c8b2](https://github.com/Redocly/redoc/commit/e26c8b23d9b36abd5572bd0fe350d74a5cf65afb))
* Response objects couldn't open ([#1867](https://github.com/Redocly/redoc/issues/1867)) ([18f943d](https://github.com/Redocly/redoc/commit/18f943d2b5668f1552d212dee1c3a2ed59054095))
* restore old variant security injections ([#2075](https://github.com/Redocly/redoc/issues/2075)) ([1a1bc26](https://github.com/Redocly/redoc/commit/1a1bc26503c06b6a7022289e5b9353bd59e48a9a))
* revert expanding default server variables ([7849f7f](https://github.com/Redocly/redoc/commit/7849f7f6b7517275f2b283085ac8174f83dc055d))
* rewrite recursive checks ([#2072](https://github.com/Redocly/redoc/issues/2072)) ([2970f95](https://github.com/Redocly/redoc/commit/2970f959cfa31cb4d5288ca23ca05cd34357dcec))
* right absolute path for load and bundle definition ([#1579](https://github.com/Redocly/redoc/issues/1579)) ([ab2d57a](https://github.com/Redocly/redoc/commit/ab2d57a5a2ac5df007d76be0d664f3fb5f909566))
* right panel code samples bg color ([de2aed2](https://github.com/Redocly/redoc/commit/de2aed21e7f38467dce52bc2adf6f071cfcb3c5e))
* sanitize array of items ([#1920](https://github.com/Redocly/redoc/issues/1920)) ([059bd80](https://github.com/Redocly/redoc/commit/059bd8000e5fd65753d5ca9e0c47940394e0c79b))
* scale sideMenu labels according to computed font size ([#1356](https://github.com/Redocly/redoc/issues/1356)) ([fed9a06](https://github.com/Redocly/redoc/commit/fed9a061d59592ec17cedbe4fd392e1f74c21527))
* Schema for events incorrectly omits readOnly and includes writeOnly ([#1720](https://github.com/Redocly/redoc/issues/1720) [#1540](https://github.com/Redocly/redoc/issues/1540)) ([a8e0c29](https://github.com/Redocly/redoc/commit/a8e0c296852661dec1dcad2388d7589f9e0d3609))
* scroll in sidebar ([b5b0d61](https://github.com/Redocly/redoc/commit/b5b0d61b3568ac2a8aaceafa96ffa6d2f86ed323))
* Scrolling keeps rewriting url after a Redoc element was removed [#2051](https://github.com/Redocly/redoc/issues/2051) ([#2085](https://github.com/Redocly/redoc/issues/2085)) ([0045be0](https://github.com/Redocly/redoc/commit/0045be0b753b8fb7d8d58a4e511783a6ba858444))
* scrolling to the first item ([#1753](https://github.com/Redocly/redoc/issues/1753)) ([bccd213](https://github.com/Redocly/redoc/commit/bccd21394ef79940c2efbe24a0d866c7af103d94))
* search and navigate error ([cfd810f](https://github.com/Redocly/redoc/commit/cfd810fdf9d37862e07458fa1c3c04046e22f315))
* search-box use theme ([1bf490c](https://github.com/Redocly/redoc/commit/1bf490c05b343d262f8819bf1ddc433e070be1b9))
* serialize parameter example values according to the spec ([#917](https://github.com/Redocly/redoc/issues/917)) ([3939286](https://github.com/Redocly/redoc/commit/39392869f414e86049e0123839f06a5d520cd1de))
* set last section min-height ([4dd79cd](https://github.com/Redocly/redoc/commit/4dd79cd840e8c1ab7bae688e45320a6173fb5c66)), closes [#820](https://github.com/Redocly/redoc/issues/820)
* show long pattern and add toggle button ([#1375](https://github.com/Redocly/redoc/issues/1375)) ([a6b41aa](https://github.com/Redocly/redoc/commit/a6b41aa00b7592512fdaa7532d9f5d85238db29b))
* sibling for openapi 3.1 ([#2112](https://github.com/Redocly/redoc/issues/2112)) ([0b1a790](https://github.com/Redocly/redoc/commit/0b1a79009010f0640a3030093b7c0dcf8caa49e4))
* sidebar navigation issues when scrollYOffset is float number ([c04f387](https://github.com/Redocly/redoc/commit/c04f387378e661108dd39d9cd13a9e921b8f9d41)), closes [#748](https://github.com/Redocly/redoc/issues/748)
* sort discriminator entries by mapping order ([#1216](https://github.com/Redocly/redoc/issues/1216)) ([ac4f915](https://github.com/Redocly/redoc/commit/ac4f915494f289d1c97ffdfe3af59efd94734f8c))
* styled-component style error in tabs ([#946](https://github.com/Redocly/redoc/issues/946)) ([c488bbf](https://github.com/Redocly/redoc/commit/c488bbf3058337edd891021d69bef5d369413b5c))
* support discriminator mapping 1-n ([6e390f9](https://github.com/Redocly/redoc/commit/6e390f9c7909da0b5d1d6fc571ab4ad92e715d6e)), closes [#1111](https://github.com/Redocly/redoc/issues/1111)
* support json serialization for parameter examples ([1367380](https://github.com/Redocly/redoc/commit/1367380a88e6da91704662d680d66ea8aca587f2)), closes [#934](https://github.com/Redocly/redoc/issues/934)
* The number of items in the array in the array is incorrect [#1762](https://github.com/Redocly/redoc/issues/1762) ([#1763](https://github.com/Redocly/redoc/issues/1763)) ([3b8d644](https://github.com/Redocly/redoc/commit/3b8d6441bd9978b849a53021d40fd4fe150272ea))
* theme improvments by [@stasiukanya](https://github.com/stasiukanya) ([e2d0cd5](https://github.com/Redocly/redoc/commit/e2d0cd5b18e9f39ce28c743bc04ca4f7ba499f8e))
* tidy up non-redoc vendor extension presentation ([#847](https://github.com/Redocly/redoc/issues/847)) ([b21cd3d](https://github.com/Redocly/redoc/commit/b21cd3d3668085ddd9bf29e434f9ffb01e61bc96))
* types over-pluralization ([#1057](https://github.com/Redocly/redoc/issues/1057)) ([4494f80](https://github.com/Redocly/redoc/commit/4494f80dbc41b7bfe2eb64bbd727271658860898)), closes [#1053](https://github.com/Redocly/redoc/issues/1053)
* unify accordion icons for responses section ([2afc2e4](https://github.com/Redocly/redoc/commit/2afc2e4921b8f8cf4800fe624225938c75fbab07)), closes [#975](https://github.com/Redocly/redoc/issues/975)
* unit test for deployment ([#2003](https://github.com/Redocly/redoc/issues/2003)) ([ed7b665](https://github.com/Redocly/redoc/commit/ed7b665c126530b55cd5313cee3127b96e883423))
* update apiKey in to be titleize ([#902](https://github.com/Redocly/redoc/issues/902)) ([35df477](https://github.com/Redocly/redoc/commit/35df477388cb2707d380515a3493aae73d426ae0))
* update EnumValues component ([#1324](https://github.com/Redocly/redoc/issues/1324)) ([de27ac0](https://github.com/Redocly/redoc/commit/de27ac03081d55967f5a479fb1352a83b8ceb8b2))
* update focus styling ([30a27c1](https://github.com/Redocly/redoc/commit/30a27c116b366428570d0b5516b5b2b4bcd0c5fc))
* update snapshot ([#1956](https://github.com/Redocly/redoc/issues/1956)) ([1e80dd6](https://github.com/Redocly/redoc/commit/1e80dd69a3687d2f97d070104126d17950222ff8))
* update to core.js 3 ([9e3375d](https://github.com/Redocly/redoc/commit/9e3375d12d21970e5c0c8807ae8448518bc4f314)), closes [#997](https://github.com/Redocly/redoc/issues/997)
* use mobile menu background color value from theme ([#1144](https://github.com/Redocly/redoc/issues/1144)) ([41a9b3c](https://github.com/Redocly/redoc/commit/41a9b3c18228d236d182d3c15c9abc35ae72a0d5))
* use operation path if operation summary/description is not provided ([#1596](https://github.com/Redocly/redoc/issues/1596)) ([4b072be](https://github.com/Redocly/redoc/commit/4b072be8d1c0dc4f1fa627168eebaed0a0213e08)), closes [#1270](https://github.com/Redocly/redoc/issues/1270)
* use shrinkwrap for cli package ([#1446](https://github.com/Redocly/redoc/issues/1446)) ([4567534](https://github.com/Redocly/redoc/commit/4567534cbb26f13a72a64d49faca64fc992d6dd8))
* use url-template dependency ([#1008](https://github.com/Redocly/redoc/issues/1008)) ([32a464a](https://github.com/Redocly/redoc/commit/32a464aaa80696dbd926f28da6ceee5b761d4fa0)), closes [#1007](https://github.com/Redocly/redoc/issues/1007)
* wrap json examples in code tag ([#1064](https://github.com/Redocly/redoc/issues/1064)) ([dc5430e](https://github.com/Redocly/redoc/commit/dc5430e53def780a81612d269cc3aea3f8785eea))
* writeOnly params displaying in webhook ([#1866](https://github.com/Redocly/redoc/issues/1866)) ([5694913](https://github.com/Redocly/redoc/commit/5694913e71f0e8c3a5d9393f1b4ae92534127841))
* wrong base url format causing error when constructing new URL ([#1996](https://github.com/Redocly/redoc/issues/1996)) ([d2cdaa1](https://github.com/Redocly/redoc/commit/d2cdaa1221b6a5e7b5da2418414bce1586069deb))
* x-examples for request body param does not display [#1743](https://github.com/Redocly/redoc/issues/1743) ([#1826](https://github.com/Redocly/redoc/issues/1826)) ([aaa3b32](https://github.com/Redocly/redoc/commit/aaa3b3280c8422d450e8849ae02135dde199d6d5))
* **cli:** add node-libs-browser to the deps ([6c79901](https://github.com/Redocly/redoc/commit/6c79901a25bd2bf80d9c5a37d991534d771fb006)), closes [#850](https://github.com/Redocly/redoc/issues/850)
* add null check in dispose method ([#675](https://github.com/Redocly/redoc/issues/675)) ([6b7c5b7](https://github.com/Redocly/redoc/commit/6b7c5b7df3f17c79f398dfa9d3b0a3e662570cb5))
* add some spacing between operation description and parameters ([597688e](https://github.com/Redocly/redoc/commit/597688e7208159864c0d5964237df6fb3445e2b7))
* addd indent to array schema internals ([865f3ce](https://github.com/Redocly/redoc/commit/865f3ced4b7fc3134685e2bc6387f3136bc38fbe))
* allOf inside oneOf overwritten and not rendered ([fe3383d](https://github.com/Redocly/redoc/commit/fe3383d1a395ff003bd1765b7c1515d50f2019cb)), closes [#660](https://github.com/Redocly/redoc/issues/660)
* allow word-break in code strings in md ([15dfe44](https://github.com/Redocly/redoc/commit/15dfe44d4ead155a0a3890d70825c8135c579dd9))
* broken rendering of code blocks with language in markdown ([8218a26](https://github.com/Redocly/redoc/commit/8218a2694d12f9e61b3e6b9e5085ada0ca1fc8d6))
* broken rendering of headings with regexp characters ([e660517](https://github.com/Redocly/redoc/commit/e660517a2afe192c6dae74c98d6f9517a8f57fa3))
* change default font weight to 400 ([11947ed](https://github.com/Redocly/redoc/commit/11947ed68efa79c886011b0b5e36b93baf212396))
* crash on any backticks code block without lang specified ([58ae668](https://github.com/Redocly/redoc/commit/58ae668f6486a0a46bd22fc21547ab7351c7e68d))
* default false not displaying ([4e5282e](https://github.com/Redocly/redoc/commit/4e5282e206ca64f3365ee6a9e8e2a0c3b36072e6)), closes [#544](https://github.com/Redocly/redoc/issues/544)
* description is not rendered if doesn't containt markdown headings ([90ed717](https://github.com/Redocly/redoc/commit/90ed717bb55699f5dc26f6bfd6b5f215b85d40ff)), closes [#591](https://github.com/Redocly/redoc/issues/591)
* different output of cli bundle and redoc ([89aa754](https://github.com/Redocly/redoc/commit/89aa7540634c7504f95afee9b0d7ceb3e863668f)), closes [#547](https://github.com/Redocly/redoc/issues/547)
* do not inherit title in allOf ([720e282](https://github.com/Redocly/redoc/commit/720e28284c6ee9878a9f8c36a29af6a3ae7a48ef)), closes [#601](https://github.com/Redocly/redoc/issues/601)
* do not uppercase menu items by default ([0d45cc2](https://github.com/Redocly/redoc/commit/0d45cc26f1e4e9c532f9e085f1e67fced8841907))
* download button downloads index.html instead of spec with CLI ([334f904](https://github.com/Redocly/redoc/commit/334f9047a860ef1b3a138e112658bfe07fec5d79)), closes [#594](https://github.com/Redocly/redoc/issues/594)
* extensionHook not being used ([a4a4013](https://github.com/Redocly/redoc/commit/a4a40135eca84caaef0a6993e8532bc814367e05)), closes [#665](https://github.com/Redocly/redoc/issues/665)
* fix  resolving issue by upgrading to json-schema-ref-parser@5.1.1 ([0045958](https://github.com/Redocly/redoc/commit/0045958d3b877f72f6c2ba08e07b2b89e986eaa8)), closes [#541](https://github.com/Redocly/redoc/issues/541)
* fix auth requirements font size ([d13fe13](https://github.com/Redocly/redoc/commit/d13fe13eb8d37dc46b9d99626dcc3ef201fb906f))
* fix Authentication section is not rendered ([2ecc8bc](https://github.com/Redocly/redoc/commit/2ecc8bc58ec6ce97538f2a07931632865356c3df)), closes [#590](https://github.com/Redocly/redoc/issues/590)
* fix broken link in CLI help ([bab3e7d](https://github.com/Redocly/redoc/commit/bab3e7dfcef5c4e5f7b4f5e1faec2e5ace517629)), closes [#559](https://github.com/Redocly/redoc/issues/559)
* fix crash on empty media object ([fb21212](https://github.com/Redocly/redoc/commit/fb212128f9fe0e63dfec7f73fa22321f66829837)), closes [#608](https://github.com/Redocly/redoc/issues/608)
* fix Download button url when spec as object was provided ([c35925a](https://github.com/Redocly/redoc/commit/c35925a3329ecbd2261b97ed72e011aa73eccaf1)), closes [#462](https://github.com/Redocly/redoc/issues/462) [#540](https://github.com/Redocly/redoc/issues/540)
* fix hideHostname also hiding basePath ([b5f3224](https://github.com/Redocly/redoc/commit/b5f32247bec3b4225c9f0e694a2a744c28e84a6d)), closes [#677](https://github.com/Redocly/redoc/issues/677)
* fix issue with broken markdown caused by marked bug ([70cf293](https://github.com/Redocly/redoc/commit/70cf29328ef1038770eba04d1470e77a3f615d65))
* fix linebreaks in multiparagraph field descriptions ([8fb9cd6](https://github.com/Redocly/redoc/commit/8fb9cd6bace87af473310b38a1b0196fbb020dda))
* fix link colors in json samples ([aaaa899](https://github.com/Redocly/redoc/commit/aaaa8999bf79ec4a364b3e055b97bcfbb2bd7eb2))
* fix non-scalar query/path/header params are not expandable ([dcca44a](https://github.com/Redocly/redoc/commit/dcca44a92dc61cad43dcaf20e32973630fdad0eb)), closes [#561](https://github.com/Redocly/redoc/issues/561)
* fix oneOf/anyOf titles ([39b930d](https://github.com/Redocly/redoc/commit/39b930d0eeb908317aef178dbf83ce21231cf1a7)), closes [#618](https://github.com/Redocly/redoc/issues/618) [#621](https://github.com/Redocly/redoc/issues/621)
* fix panel paddings on small screens ([f39fc98](https://github.com/Redocly/redoc/commit/f39fc98eabc38dcc05beafff21f07e83506e37d5))
* fix usage with CRA by transpiling swagger2openapi deps ([6473e62](https://github.com/Redocly/redoc/commit/6473e6269c405d29184ea52b5280dae6906acc72)), closes [#566](https://github.com/Redocly/redoc/issues/566)
* improve scrolling performance in Chrome with non-wrapped json examples ([a69c402](https://github.com/Redocly/redoc/commit/a69c402d9b32b86e7dce35c52e24cb67a79523b4))
* Increase badge size slightly so that "PATCH" method fits inside ([#632](https://github.com/Redocly/redoc/issues/632)) ([4b3b5ba](https://github.com/Redocly/redoc/commit/4b3b5ba974c982690d6b1712b6673ec331c030c5))
* make http badges font-based instead of inline png ([5d84bd4](https://github.com/Redocly/redoc/commit/5d84bd46564ac176f4e680e88f96c567b75745bb))
* minor media print improvements ([fbcec82](https://github.com/Redocly/redoc/commit/fbcec822756a7e1b970a02d1f60708c09b801edc))
* nested oneOf button spacing ([3673720](https://github.com/Redocly/redoc/commit/36737204975b73f6e439a0d4af168cac346b962b)), closes [#719](https://github.com/Redocly/redoc/issues/719)
* onLoaded callback not run on spec error ([e77df0c](https://github.com/Redocly/redoc/commit/e77df0ca074201762afb119345ab030ffa03e0b5)), closes [#690](https://github.com/Redocly/redoc/issues/690)
* **cli:** old peer dependency issue with styled-components ([#699](https://github.com/Redocly/redoc/issues/699)) ([9e2853c](https://github.com/Redocly/redoc/commit/9e2853c2fd67abd4b5b23c69aaf667033a252707))
* fix subsections ids so subsections with the same name are allowed ([4c76d52](https://github.com/Redocly/redoc/commit/4c76d52cc697f6b9fbdaf6fb8ff7bfb018340cc2)), closes [#529](https://github.com/Redocly/redoc/issues/529)
* remove break-all from code samples ([d74578d](https://github.com/Redocly/redoc/commit/d74578dc9b0dd902d2b7dc94f7b77a983f09758c))
* remove extra-padding caused by empty group sections ([974bc7d](https://github.com/Redocly/redoc/commit/974bc7ddb04a16818826fba1ebda11ab480e03cd))
* **cli:** add styled-components to dependencies ([2d63fa0](https://github.com/Redocly/redoc/commit/2d63fa0ba02c68c927f1ef637a67a46a59ff9bc2))
* inline markdown regression ([e1c9e19](https://github.com/Redocly/redoc/commit/e1c9e19fbc4fcb5692b92cd2f6c090cf91c1ff22))
* long endpoint url overflow ([d99e918](https://github.com/Redocly/redoc/commit/d99e9188fdefca6d483aaa5ced960ae2fd6bf77b))
* preserve md heading level in description ([23559fb](https://github.com/Redocly/redoc/commit/23559fbece2b8e4844e83a406ffcaf6fa6c5cb80))
* properly host oneOf inside allOf ([7e5b6d9](https://github.com/Redocly/redoc/commit/7e5b6d902941f2dbf770c2c7d5991e11aed1131b)), closes [#507](https://github.com/Redocly/redoc/issues/507) [#528](https://github.com/Redocly/redoc/issues/528)
* regression - broken urls for operations without operationId ([c0c44bc](https://github.com/Redocly/redoc/commit/c0c44bc4fee0b8951c11e313089a732e8e6dc89b))
* render additionalProperties set to true ([#597](https://github.com/Redocly/redoc/issues/597)) ([f70ac08](https://github.com/Redocly/redoc/commit/f70ac081fe8a3a0a3aac6851cd665e9a936c2375)), closes [#596](https://github.com/Redocly/redoc/issues/596)
* schemes without type: object are not expandable ([97e1620](https://github.com/Redocly/redoc/commit/97e16208d5dfb7a6bc52490c4494f48deb1b5b92)), closes [#599](https://github.com/Redocly/redoc/issues/599)
* server overriding didn't work on Path Item object ([355764d](https://github.com/Redocly/redoc/commit/355764dcd484d3bea8f16e7c8a10eb0775b896f4)), closes [#656](https://github.com/Redocly/redoc/issues/656)
* server url contains spec name if not specified in the spec ([b41b181](https://github.com/Redocly/redoc/commit/b41b181dd0a4ce498142126c3007e6dfa3f158ca))
* show examples for response headers ([ba22b1e](https://github.com/Redocly/redoc/commit/ba22b1e352a0b37ae05663b51c33ef2d800f1c0c)), closes [#575](https://github.com/Redocly/redoc/issues/575)
* use correct parent section for security definition ([f903406](https://github.com/Redocly/redoc/commit/f903406c14cfc0410c32aefd1ca1fa9851e385ce))
* Use item's title in array definition ([#526](https://github.com/Redocly/redoc/issues/526)) ([4694b6f](https://github.com/Redocly/redoc/commit/4694b6f9ca2126f507dd4026ecfd6575c0c75640))
* use original tag name when slugified one is not valid ([#553](https://github.com/Redocly/redoc/issues/553)) ([8817d9c](https://github.com/Redocly/redoc/commit/8817d9c9db820c0e96068e1c04a850715a7d818f))
* use pushState instead of hash replace ([83fca7d](https://github.com/Redocly/redoc/commit/83fca7d9ff947916c07e73d245ccabd4eec34725)), closes [#542](https://github.com/Redocly/redoc/issues/542)
* wrong display when combining multiple auth requirements ([f96c481](https://github.com/Redocly/redoc/commit/f96c481b34f68fd05d29f15b234c1a2172d104d4)), closes [#577](https://github.com/Redocly/redoc/issues/577)
* **cli:** add mobx to dependencies ([75ced44](https://github.com/Redocly/redoc/commit/75ced44d7c3d496150009fe2302904986be6331e))
* **cli:** cli output crashes if script closing tag is in the spec ([76906eb](https://github.com/Redocly/redoc/commit/76906eb126de728a25af0163e4d4ee71f88f6be4)), closes [#563](https://github.com/Redocly/redoc/issues/563)
* A couple minor bug fixes ([#436](https://github.com/Redocly/redoc/issues/436)) ([5dc21af](https://github.com/Redocly/redoc/commit/5dc21af28148ff6590dd8189a6fb27c309126c8c))
* add extra null-check + warning ([8757fa5](https://github.com/Redocly/redoc/commit/8757fa510a1f6e27c14aa896e82090afc2feaad9))
* add logo width to the theme ([28f2391](https://github.com/Redocly/redoc/commit/28f239114b737cd657f5eda6db97f3afa0cc0962))
* add ReDoc attribution link which was present in 1.x ([d38f2f2](https://github.com/Redocly/redoc/commit/d38f2f2a5a0d387e9788b1cc6cc5e96817e8c5df))
* add tslib dependency ([8e1a5cb](https://github.com/Redocly/redoc/commit/8e1a5cb7a186f78584681370ef14209a3e58ded4))
* align logo by center ([18ec3ac](https://github.com/Redocly/redoc/commit/18ec3ac17bfa642e085ec4fe1218bd2f1adfd907))
* change look of additionalProperties ([126c6a6](https://github.com/Redocly/redoc/commit/126c6a689a004bd5a1920f5633b5e07f549391b6))
* css fix + update theme ([05403a7](https://github.com/Redocly/redoc/commit/05403a7aa9acf809292a712cee7c3872daa5225a))
* disable chrome tap-highlight on mobiile ([09cbe88](https://github.com/Redocly/redoc/commit/09cbe884b5ae31790bf0ceab62e15029ac98e998))
* discriminator field doesn't change in examples ([5dae267](https://github.com/Redocly/redoc/commit/5dae267a546aa6bdb9f95f86181f5c6c97a41e9d)), closes [#524](https://github.com/Redocly/redoc/issues/524)
* fix [@observer](https://github.com/observer) on PureComponent warning ([afb11d6](https://github.com/Redocly/redoc/commit/afb11d6a4fae69d791aec4516fa29750047e5e9f))
* fix broken css after installing polished ([6018042](https://github.com/Redocly/redoc/commit/6018042180a48564ee04b3762a2fbcfe2842f44c))
* fix build caused by new babel decorators syntax, fixes [#487](https://github.com/Redocly/redoc/issues/487) ([01f575c](https://github.com/Redocly/redoc/commit/01f575cc73b382754b8495ef0b8a1893ce67ea36))
* fix CLI crash + build it on travis ([7769ba8](https://github.com/Redocly/redoc/commit/7769ba84fda987877f2e7b59ed5055e53308b4a8))
* fix font-weight inconsistency ([6ea2b7b](https://github.com/Redocly/redoc/commit/6ea2b7b0e67b19e60b12c20b3548a2d168c58ca7)), closes [#506](https://github.com/Redocly/redoc/issues/506)
* fix IE11 crash + remove unused polyfills ([c8a5f36](https://github.com/Redocly/redoc/commit/c8a5f36f17170ac53513cfa55936e4483dfd01bc)), closes [#448](https://github.com/Redocly/redoc/issues/448)
* fix logo width ([384c883](https://github.com/Redocly/redoc/commit/384c883bb817bb55dbfaedb29ff1ca00b7bcdb8b))
* fix overflowing content in JSON samples ([02c2413](https://github.com/Redocly/redoc/commit/02c2413da8f7315fb05e2f24a32d15be4bc6df80))
* fix prism lang dependencies, fixes [#467](https://github.com/Redocly/redoc/issues/467) ([42cf18e](https://github.com/Redocly/redoc/commit/42cf18edb33209f75b7caf62f02f548269387dd9))
* fix right-panel blinking when scrolling + css improvements ([a78f9ab](https://github.com/Redocly/redoc/commit/a78f9ab68865bfc67d953c0d8c794f634f3adacc))
* fix search-indexing for SSR ([1428fb5](https://github.com/Redocly/redoc/commit/1428fb52e09b9336708892d21e00311f807cb86a))
* fix second-level heading in description ([a084532](https://github.com/Redocly/redoc/commit/a0845325d90a3718f8b8f3f7556614754c323722))
* fix spelling in error message ([#455](https://github.com/Redocly/redoc/issues/455)) ([64119c4](https://github.com/Redocly/redoc/commit/64119c44d4da7f2d3ca54209053c833a0a609322))
* fix typings on npm ([d957ad7](https://github.com/Redocly/redoc/commit/d957ad762df22aebac899f0a96ecb79cc6f1da9d))
* fix vertical line misaligned in firefox ([bde08f1](https://github.com/Redocly/redoc/commit/bde08f128391f130500cbf037badc4f8097bf8f1)), closes [#503](https://github.com/Redocly/redoc/issues/503)
* fix worker import ([4896346](https://github.com/Redocly/redoc/commit/48963469980129f7ef0eeca89467784e899484b8))
* fix worker is not defined in lib bundle, fixes [#485](https://github.com/Redocly/redoc/issues/485) ([6f85cb1](https://github.com/Redocly/redoc/commit/6f85cb195a498f1d937ab6b63349c58660c82909))
* HEAD http verb support in menu badges ([2eb1952](https://github.com/Redocly/redoc/commit/2eb195287528e2b6c61d94038a95427a753c87d5)), closes [#493](https://github.com/Redocly/redoc/issues/493)
* limit height of discriminator dropdown, fixes [#484](https://github.com/Redocly/redoc/issues/484) ([6d1a9e5](https://github.com/Redocly/redoc/commit/6d1a9e589c45dbf7fa52bf11d845302b53daa7c9))
* make field type color more dark (closes [#439](https://github.com/Redocly/redoc/issues/439)) ([d27e61a](https://github.com/Redocly/redoc/commit/d27e61a1f7e6af47bb17c161f5eaff11219edf25))
* make ReactStandalone react on props changes ([0cb0af2](https://github.com/Redocly/redoc/commit/0cb0af2caeef5ccf8cc146d1eee319c5513406f6))
* merge inner properties of allOf ([8926dd4](https://github.com/Redocly/redoc/commit/8926dd457c440ecb5aff3cd8ea191183d4d047a0))
* MergeAll takes items into account ([#511](https://github.com/Redocly/redoc/issues/511)) ([47b2177](https://github.com/Redocly/redoc/commit/47b2177f5859e6bd3d418a2d508b8ea9fe11cde2))
* modify the peerDependencies to reflect the need for react 16.3 ([b29c329](https://github.com/Redocly/redoc/commit/b29c3293fc6999991226709dc3735e2a04122ff2))
* more descriptive message for wrong discriminator use ([3c6de2c](https://github.com/Redocly/redoc/commit/3c6de2cafceb8329a19444c034e15d70921b1dd1)), closes [#505](https://github.com/Redocly/redoc/issues/505)
* move cli to a separate npm package ([95c7585](https://github.com/Redocly/redoc/commit/95c75856286ec2f123ee24a981d769980d6a25c6))
* non-json sample crash in some cases ([209c6ca](https://github.com/Redocly/redoc/commit/209c6caca079b2192f721d75cac6b8475c2eb786)), closes [#456](https://github.com/Redocly/redoc/issues/456)
* path parameters are not correctly override, fixes [#481](https://github.com/Redocly/redoc/issues/481) ([2cf4c3c](https://github.com/Redocly/redoc/commit/2cf4c3cd7b172cd7c02224d56786351cedb48aae))
* prefer extend of styled to make styles more predictable ([ed20ac1](https://github.com/Redocly/redoc/commit/ed20ac12986ea3e5d34195f468686cd5c3332377))
* reduce search index size ([a1fa4b4](https://github.com/Redocly/redoc/commit/a1fa4b47a8cc76aa3a1408e64a2854476477e91e))
* replace "oops" with field name 🙈 ([6b1e8e7](https://github.com/Redocly/redoc/commit/6b1e8e75b030f5a19b5f8bb90438baac17f696c8))
* scroll to section sooner when SSR + simplify item ids ([d1d8042](https://github.com/Redocly/redoc/commit/d1d80422a42fad25ca1d703aba9aa4f84b190ec3))
* skipReadOnly/skipWritOnly not passing down to nested array ([6df8127](https://github.com/Redocly/redoc/commit/6df8127e7728c0a745fb27ec9609397f445bf05f))
* specify caption-side ([64801b0](https://github.com/Redocly/redoc/commit/64801b039f8f9e3fc68ddc35309d9dab97e726f5)), closes [#509](https://github.com/Redocly/redoc/issues/509)
* support wildcard status codes ([c0b0cd4](https://github.com/Redocly/redoc/commit/c0b0cd49b55592799fcf693e5c5541bf52e76a39)), closes [#531](https://github.com/Redocly/redoc/issues/531)
* temporary downgrade marked as it introduced breaking changes and a few bugs ([902f97a](https://github.com/Redocly/redoc/commit/902f97a5b9578bd2a8a6b2050620738723742237))
* **cli:** allow to set url to the spec in SSR mode ([c9c6bc5](https://github.com/Redocly/redoc/commit/c9c6bc5255d4548728cd640db8d3ec99bc9d7c86))
* **cli:** create directories when a path is specified in the --output option ([#513](https://github.com/Redocly/redoc/issues/513)) ([ac7372b](https://github.com/Redocly/redoc/commit/ac7372be6f605073afdd76624f60d2b00d558552)), closes [#512](https://github.com/Redocly/redoc/issues/512)
* **cli:** don't wait for content loaded in bundled HTML ([d9ee2d0](https://github.com/Redocly/redoc/commit/d9ee2d0d89e88ce721297368782d1caac5f9294b))
* **cli:** escape \u2029 \u2028 characters ([5018473](https://github.com/Redocly/redoc/commit/50184739c7f2e30aeda1fc9067ae8887149e15f5)), closes [#475](https://github.com/Redocly/redoc/issues/475)
* **cli:** fix crash ([8891f5c](https://github.com/Redocly/redoc/commit/8891f5c97daaa7b5aa3b3e80a725fc3ef4123b3c))
* **cli:** fix output option type ([c729c6c](https://github.com/Redocly/redoc/commit/c729c6c75b14026d5dd10998202571823349c12a))
* **cli:** make positional arguments required and handle errors in serve and bundle manually ([#518](https://github.com/Redocly/redoc/issues/518)) ([370d08a](https://github.com/Redocly/redoc/commit/370d08aa1a66ab04be606ce75edc6fa068236222))
* **cli:** rename redoc-cli bin ([06b5a00](https://github.com/Redocly/redoc/commit/06b5a00a8b326937ccdf0f77523b679dcb1e4dea))
* **cli:** return 1 as exit code if an error happens in the cli ([#516](https://github.com/Redocly/redoc/issues/516)) ([720c304](https://github.com/Redocly/redoc/commit/720c3044841406f6e58d23e658c20459b5b844d7))
* ([#276](https://github.com/Redocly/redoc/issues/276)) Issue with stick sidebar when there is content above reDoc ([#277](https://github.com/Redocly/redoc/issues/277)) ([f50bfb1](https://github.com/Redocly/redoc/commit/f50bfb182344e0c38f082f6d21ecdbe328e46dc8))
* (second chance) firefox and IE scroll sync after deps update ([50acb98](https://github.com/Redocly/redoc/commit/50acb986f1db703362e1f5525bd4b74d6293d752))
* add ellipsis for menu items with long words ([3421be2](https://github.com/Redocly/redoc/commit/3421be2ea301cbf600363d561d1aa4785c2e041b))
* add id attr to headers to work before react is loaded if ssr ([1743453](https://github.com/Redocly/redoc/commit/174345399f7a88bb351e800ce6027c9bd11ecbb3))
* add safeguard for undefined ([aaac434](https://github.com/Redocly/redoc/commit/aaac434ebb2647e8d5383f0642580c0c4983b382)), closes [#236](https://github.com/Redocly/redoc/issues/236)
* allOf and deref exit not only named refs ([435cccd](https://github.com/Redocly/redoc/commit/435cccd72f98eddb8299f7419c44609155d7f908))
* array of label on non-trivial fields ([cd31c62](https://github.com/Redocly/redoc/commit/cd31c62ff5fab5bac0a5e890fcc2b3cf54ddb396)), closes [#274](https://github.com/Redocly/redoc/issues/274)
* avoid endless recursion in schema-walker in some cases ([309cc23](https://github.com/Redocly/redoc/commit/309cc23de617e56f93e8124b2d4316df258db6b9)), closes [#418](https://github.com/Redocly/redoc/issues/418) [#395](https://github.com/Redocly/redoc/issues/395)
* basic responsiveness ([a29c3cc](https://github.com/Redocly/redoc/commit/a29c3ccc2d9be36d50067cd3b11a435bdc66c8c6))
* broken code samples tabs in IE ([c1dbb81](https://github.com/Redocly/redoc/commit/c1dbb81aaca70f4f447a98a369e6394f6fd65545))
* broken search after previous fixes ([3e09b05](https://github.com/Redocly/redoc/commit/3e09b0588ac3e506531ad8b3d6312463a2ae4750))
* clear page fragment when scroll to the beginning ([929740a](https://github.com/Redocly/redoc/commit/929740ab287fb16feb01b904fdd0fe5ae5078ddb))
* Clearly label version compatibility ([8d849a6](https://github.com/Redocly/redoc/commit/8d849a63da5193f889d96a0a6aa0a3e06ba31122)), closes [#338](https://github.com/Redocly/redoc/issues/338)
* code block formatting in markdown list ([a9cad19](https://github.com/Redocly/redoc/commit/a9cad1994b56992c7b6a60b0526300f51ef1b623)), closes [#242](https://github.com/Redocly/redoc/issues/242)
* code samples language sync broken ([6643d09](https://github.com/Redocly/redoc/commit/6643d09a3a81e9b744f2561c7a6d04c444329005))
* copy code-samples included \n\r characters ([cd962fa](https://github.com/Redocly/redoc/commit/cd962faba43332d90425849fa467a16df9202a67)), closes [#296](https://github.com/Redocly/redoc/issues/296)
* correct pointer for the schema ([4ae1574](https://github.com/Redocly/redoc/commit/4ae1574c6cd14e6ef330c25904a77e0ccbbd3bda))
* courier misspelling ([#409](https://github.com/Redocly/redoc/issues/409)) ([96fb7ce](https://github.com/Redocly/redoc/commit/96fb7ce436f3750d61a3dc510ed800a9e739d84c))
* crash if `contact` is not in the spec ([35176b5](https://github.com/Redocly/redoc/commit/35176b5f67674f27a7170902b981b8bf93d9a6f7)), closes [#332](https://github.com/Redocly/redoc/issues/332)
* crash in MarkdownRenderer on non-string ([dead161](https://github.com/Redocly/redoc/commit/dead16199fbcc4da306ef148ec4ffb4f13122829))
* crash on 2-level md heading at the beginning ([e9f23f7](https://github.com/Redocly/redoc/commit/e9f23f76aefe5dd2d2e7ac0fa37909a97d8b6f07))
* crash when $ref is url encoded ([bdf6079](https://github.com/Redocly/redoc/commit/bdf60794f3430a26dac6284fc4f7760e0c6cbfc4))
* crashes on some dereferencing/allOf merging cases ([335deb9](https://github.com/Redocly/redoc/commit/335deb983eb5b5f92bfdce8061b7f04b929a25f6))
* crate spec as data/base64 link when ssr ([33678e6](https://github.com/Redocly/redoc/commit/33678e647e053ab0145cbd3694842f6fc5a70bc7))
* definition name ([94789e3](https://github.com/Redocly/redoc/commit/94789e31454cfae1fc0c59b33758ebc2e838a1cc))
* discriminator dropdown showing incorrect field if sorted ([bcf39dc](https://github.com/Redocly/redoc/commit/bcf39dc2cf9efa1ab7d270eb68d097cf78cfb6db))
* discriminator fix ([ff3bb24](https://github.com/Redocly/redoc/commit/ff3bb2461a747ecb5cb4c2dca1a5239caae63322))
* do not auto-append security-definitions if they are not in the spec ([426e5b6](https://github.com/Redocly/redoc/commit/426e5b67abf499209cec0852526e7bd396f7a581))
* do not crash if version is not string ([accd016](https://github.com/Redocly/redoc/commit/accd01659d61e1a280d448bae26429313319ebdc)), closes [#208](https://github.com/Redocly/redoc/issues/208)
* do not hang when swagger doesn't contain any paths ([e4f5388](https://github.com/Redocly/redoc/commit/e4f53880761b4c091fdae620d076a3aaf3bf4a8b)), closes [#216](https://github.com/Redocly/redoc/issues/216)
* do not ignore path level parameters ([14f8408](https://github.com/Redocly/redoc/commit/14f8408e8d3a0e1e72786e3875c17be77aca8426))
* do not show discriminator dropdown if it is empty ([7a5d315](https://github.com/Redocly/redoc/commit/7a5d315e09680ea969b472207dee881fd21a4314))
* don't display operations without tags as tag items in menu ([ca81b6d](https://github.com/Redocly/redoc/commit/ca81b6dfafd4b5c33b12c0655ee1ee92ad84de59))
* don't show contact if it is empty object ([6077cc6](https://github.com/Redocly/redoc/commit/6077cc6afd61747a559c917b59ba8f379233355d))
* don't show download button if initialized with an object ([476d6c4](https://github.com/Redocly/redoc/commit/476d6c44feaf1ade6f7f12c50e5f9e3ea302d516))
* endpoint link doesn't expand when click on arrow ([9248cc2](https://github.com/Redocly/redoc/commit/9248cc2490f5666d896b9d960d272d6f73a2ab6d))
* enum with single value not shown in non-body params ([87d9abd](https://github.com/Redocly/redoc/commit/87d9abd62b3a8126c3cad8e40a9fef2e4ebfe07b)), closes [#284](https://github.com/Redocly/redoc/issues/284)
* example value is not showed if it is false ([9756364](https://github.com/Redocly/redoc/commit/975636411b393622c8402c254609b42edab6120b))
* filter out non-existing security schemas + warn ([ee822f6](https://github.com/Redocly/redoc/commit/ee822f6ebec3153d215ccec32f8f3eaf31fe7d91))
* firefox and IE scroll sync after deps update ([ad04636](https://github.com/Redocly/redoc/commit/ad04636073291e5793f39a1bc9e8f1aff1bd0e40))
* first menu item keeps always selected ([1fb6967](https://github.com/Redocly/redoc/commit/1fb6967064e83c3c52921086fbef133e59e095b5))
* fix anchor links accidentally broken ([2d7d4d3](https://github.com/Redocly/redoc/commit/2d7d4d3409b6736442c3b5236e27d1961e27c8db))
* fix crash when discriminator is used incorrectly ([b1d928d](https://github.com/Redocly/redoc/commit/b1d928dbd388d0b1ac8700a02d02fe7ff43fec09))
* fix crash when referencing non-existing security scheme ([1f7fc44](https://github.com/Redocly/redoc/commit/1f7fc4429265936881bf4969561a459270c81a24))
* Fix extra slash if basePath is not present ([a5c03ab](https://github.com/Redocly/redoc/commit/a5c03abbe4d9d247c426a63ee657500a336e7bfb)), closes [#201](https://github.com/Redocly/redoc/issues/201)
* fix oneOf title for array ([1f3701d](https://github.com/Redocly/redoc/commit/1f3701d3a909a98b3cb7898a07efb6506c58dc12))
* fix tbody > tr nesting warning ([a3cbb14](https://github.com/Redocly/redoc/commit/a3cbb14f74505537c8fe9e85ec77fb8d6b161898))
* fix the media queries utils so it gets the values from the current theme ([#420](https://github.com/Redocly/redoc/issues/420)) ([3924d3c](https://github.com/Redocly/redoc/commit/3924d3c1be16ad50d2b5d612b32e8f576cf64ce8))
* handle case where items is array in indexer ([5e5db72](https://github.com/Redocly/redoc/commit/5e5db72ea412c38e18ce323500dddb601a325a7c)), closes [#304](https://github.com/Redocly/redoc/issues/304)
* handle scrollYOffset in ScrollService ([34a8fe4](https://github.com/Redocly/redoc/commit/34a8fe490660dae43381aa108acb718dab94787b))
* HEAD http verb support ([d8b6e02](https://github.com/Redocly/redoc/commit/d8b6e022b7d293335dece6f932107c109e2350cf)), closes [#342](https://github.com/Redocly/redoc/issues/342)
* html characters not escaped in code blocks (fixes [#378](https://github.com/Redocly/redoc/issues/378)) ([fef9ec4](https://github.com/Redocly/redoc/commit/fef9ec476cacd5f52ecc43dc0d35360da0a8b5b0))
* improve copy tooltip perf ([29207cf](https://github.com/Redocly/redoc/commit/29207cf0d2c6cf542ed300fbbe447182f2ae5d33))
* improve rendering of types ([17da7b7](https://github.com/Redocly/redoc/commit/17da7b74db17c2f94ca46d764ba6d547fa879a52))
* improve x-servers dropdown animation performance ([69c7d98](https://github.com/Redocly/redoc/commit/69c7d983fb86deb887d4625919d980feef8eb563))
* Increase padding top for .api-info-wrapper when left sidebar is hiding to avoid header overlaying by top menu. ([514fc29](https://github.com/Redocly/redoc/commit/514fc297c4cafd8503de5137df190a5b1436f528))
* Ioutput dates as ISO 8601 strings in JSON Formatter ([#313](https://github.com/Redocly/redoc/issues/313)) ([86d8179](https://github.com/Redocly/redoc/commit/86d8179e4f8bdacc0612c3936f6e84acf1d81e0b))
* linkify in json formatter ([8994192](https://github.com/Redocly/redoc/commit/899419269bb1566ef52aada043ec16afdf5f221a)), closes [#267](https://github.com/Redocly/redoc/issues/267)
* links color in json sample ([b4e2e9d](https://github.com/Redocly/redoc/commit/b4e2e9d47bda7ab6234f8200e6b8ee487520bfe9))
* long paths break EndpointLink ui ([8472045](https://github.com/Redocly/redoc/commit/84720459452bc7772bc2145df5b19db0557482d7))
* make active tab more clear ([4b5df22](https://github.com/Redocly/redoc/commit/4b5df22fa0414e47d17585daa37d814c7242e722))
* make oneOf not skip fields defined alongside ([334a0a0](https://github.com/Redocly/redoc/commit/334a0a07daa84beaf0ac0b4e78c51e87b51ddb57))
* make padding between h2 sections smaller ([2c89536](https://github.com/Redocly/redoc/commit/2c8953664acf27808c3be74d7485bb28cb541db8)), closes [#291](https://github.com/Redocly/redoc/issues/291)
* markdown block text color 💅 ([0f6f035](https://github.com/Redocly/redoc/commit/0f6f0359d933e15bb9d0685db5568ff3ffd6e0e8)), closes [#255](https://github.com/Redocly/redoc/issues/255)
* menu items not full-width when short item names ([ef1b2bd](https://github.com/Redocly/redoc/commit/ef1b2bd19e718d23d7dd9a7a780d55a9a93f6713))
* menu service subscription leak + minor refactor ([bb00dc3](https://github.com/Redocly/redoc/commit/bb00dc3426dfeccc179f9a66cc096e6a10787154))
* missing properties when using complex allOf (regression) ([6ce9245](https://github.com/Redocly/redoc/commit/6ce9245c0a66d41ceb247088eb5607ca0caff9a4)), closes [#422](https://github.com/Redocly/redoc/issues/422)
* move title propagation to the correct place ([0b0bc99](https://github.com/Redocly/redoc/commit/0b0bc99f73031409c94a06c3772b44d181aaceba))
* null example not used in schema samples ([420c51a](https://github.com/Redocly/redoc/commit/420c51a4ba97eee66624902301f9022252479aec)), closes [#415](https://github.com/Redocly/redoc/issues/415)
* one-of dropdown not switching ([0f1b6a6](https://github.com/Redocly/redoc/commit/0f1b6a622e6b0f444f036ddf55b0122f9b99cd2c))
* openapi button add `download` attribute ([583c571](https://github.com/Redocly/redoc/commit/583c5719db019628d386a7af2b9f1e94fc45bcb7))
* optimize and support inherited discriminator ([64e5741](https://github.com/Redocly/redoc/commit/64e5741f6797ffe232b5377262d58f6d92b95f34))
* owerwrite text-align to left ([bfee3ed](https://github.com/Redocly/redoc/commit/bfee3ed2690a3e7c76f2438e0a985929158b9dd8))
* Path parameters are not correctly overriden ([c406dc5](https://github.com/Redocly/redoc/commit/c406dc54099f7182697aea78869dd9452e353030)), closes [#400](https://github.com/Redocly/redoc/issues/400)
* perfect scroll not working ([199f240](https://github.com/Redocly/redoc/commit/199f240e7c55f4c0ae953c02e52e9f21abc0a83a))
* prevent possible xss using `untrusted-spec` option ([c0698bb](https://github.com/Redocly/redoc/commit/c0698bb21569854a1a4c62f7b01edb8f69fc8fa1))
* readonly/writeonly not respected in nested schemas ([2d20d06](https://github.com/Redocly/redoc/commit/2d20d0650079b9ba08e24efce8f481092b7380ad))
* ready-only for nested objects samples ([be41d6d](https://github.com/Redocly/redoc/commit/be41d6d3254e3961e16f06917ff3bed3c9ac9bc3)), closes [#300](https://github.com/Redocly/redoc/issues/300)
* redoc hangs when indexing recursive discriminator-based definitions ([1e96f88](https://github.com/Redocly/redoc/commit/1e96f88ea8320523080a11e5c6ed158b8e9a8280)), closes [#228](https://github.com/Redocly/redoc/issues/228)
* ReDoc removes path if site is using history API ([c77e1a2](https://github.com/Redocly/redoc/commit/c77e1a28f7937ead8d8e6dd6cd94c603e3e6876a)), closes [#257](https://github.com/Redocly/redoc/issues/257)
* referenced header name is empty ([13165fb](https://github.com/Redocly/redoc/commit/13165fb8fca5e5f82cf0d710c5f1d932fd838aef))
* Remove `fka Swagger` text from download button label ([12b91b7](https://github.com/Redocly/redoc/commit/12b91b72ac57d5578b1bc73380e202061916116d))
* remove trailing slash from url when use x-servers ([2760a34](https://github.com/Redocly/redoc/commit/2760a3410bab67b7e9e72d461cdc5985dfa01bcf))
* resolve menu synchronization issue (use proper throttle) ([84d1c7b](https://github.com/Redocly/redoc/commit/84d1c7b2f23a462bb3d82785b3c080a776eeae49))
* response samples - render description as markdown ([4acfc11](https://github.com/Redocly/redoc/commit/4acfc11148931b57a39eb4dbb30c8e619eefc806)), closes [#190](https://github.com/Redocly/redoc/issues/190)
* response samples doesn't show only text/plain (fixes [#371](https://github.com/Redocly/redoc/issues/371)) ([00aea06](https://github.com/Redocly/redoc/commit/00aea066f08dce1a115db9d7e996e3c88109f70e))
* sample unavailable when no schema in response object ([1eedbfe](https://github.com/Redocly/redoc/commit/1eedbfeb988bd8157c3647d4275fc569e0df05bc))
* show warning for non-used in tagGroup tags ([fb3ca07](https://github.com/Redocly/redoc/commit/fb3ca07d6e20c021f9ab8bb6308240a1c77c8fa7)), closes [#215](https://github.com/Redocly/redoc/issues/215)
* skipReadOnly/skipWritOnly not passing down to nested OneOf ([2462639](https://github.com/Redocly/redoc/commit/2462639f76bc86a3d9d0387632c6286acb810b94))
* Slugifying non-ascii headers make duplicate permalinks ([#264](https://github.com/Redocly/redoc/issues/264)) ([6edbbe7](https://github.com/Redocly/redoc/commit/6edbbe7b0c899484a718c88f050d48e75ddc2492))
* snapshot failing on constructor prop ([04e8606](https://github.com/Redocly/redoc/commit/04e86065e316682aca74af487a7ac2cb7cb2c455))
* sticky sidebar fix ([2c836f8](https://github.com/Redocly/redoc/commit/2c836f8107b71af29bcccf394fff87863e664b01))
* subscription leak in side-menu ([838f233](https://github.com/Redocly/redoc/commit/838f23380ce30f671983c8af107e4aac7ca33c56))
* support discriminator with parent type ([17fb7ba](https://github.com/Redocly/redoc/commit/17fb7bad27c9d885fb8dc5c33116729817c33a26)), closes [#220](https://github.com/Redocly/redoc/issues/220)
* take snapshot of schema to not overwrite inlined references ([77bc3c4](https://github.com/Redocly/redoc/commit/77bc3c44fcf6087dda4e160683b03c84dee9c3e1)), closes [#203](https://github.com/Redocly/redoc/issues/203)
* typo in download button classname (thanks [@dwilding](https://github.com/dwilding)) ([6b363a5](https://github.com/Redocly/redoc/commit/6b363a5f44293bff7bfd43340a49898b5ae7f02a))
* ul missing css ([303b49e](https://github.com/Redocly/redoc/commit/303b49e9185082585c705e56dbb7dae17b09fbec))
* undo section id + some minor fixes ([0253c5d](https://github.com/Redocly/redoc/commit/0253c5d76d0ddd83a82f4b28d584ad1056e1b9e6))
* update content-projector to latest ng4 ([d52c7ef](https://github.com/Redocly/redoc/commit/d52c7ef8a03ee2c00883d1e4b6463a0874b00dec))
* update fix for [#276](https://github.com/Redocly/redoc/issues/276) to not use className checking ([4dd8a0a](https://github.com/Redocly/redoc/commit/4dd8a0acdff1a33057734087ac6bd534e434de03))
* URL changes so fast ([131b437](https://github.com/Redocly/redoc/commit/131b43747852290fb5780226d357a96c7068e7a6)), closes [#252](https://github.com/Redocly/redoc/issues/252)
* use array items example ([12f79f0](https://github.com/Redocly/redoc/commit/12f79f081a928a5c4676786b074186577b6a3f72)), closes [#408](https://github.com/Redocly/redoc/issues/408)
* use items description if not present on top level ([23e7847](https://github.com/Redocly/redoc/commit/23e7847a670d3ccb35d68941d5d9e380329986c5)), closes [#206](https://github.com/Redocly/redoc/issues/206)
* Use parentNode instead of parentElement to fix IE11 crash ([e8adb60](https://github.com/Redocly/redoc/commit/e8adb605c313e3f9478abdb06d4dba8a53e19e04)), closes [#406](https://github.com/Redocly/redoc/issues/406)
* use replace state instead of pushState ([4f4e748](https://github.com/Redocly/redoc/commit/4f4e7489ceb5946fff838ceb716633feecc0a1cc)), closes [#244](https://github.com/Redocly/redoc/issues/244)
* various search fixes ([b797c96](https://github.com/Redocly/redoc/commit/b797c965b2f8646644bba8dcf7df3b1407a9420a))
* view errors were not reported ([6aa3a7d](https://github.com/Redocly/redoc/commit/6aa3a7d863170c754700901048e37dbae4b6ae67))
* wrap text in code samples ([6c71a66](https://github.com/Redocly/redoc/commit/6c71a668f25cf728697d5574e7602e739482d04b))
* writeOnly not respected in response samples ([87abdf7](https://github.com/Redocly/redoc/commit/87abdf79d8c725bdec43f6e2d9d90d2736fd9b8c))
* wrong warnings for $ref not single ([193f4bf](https://github.com/Redocly/redoc/commit/193f4bfb44cab95d0315521a687273b54a632a45)), closes [#221](https://github.com/Redocly/redoc/issues/221)
* x-extendedDiscriminator not working ([4899f3e](https://github.com/Redocly/redoc/commit/4899f3e08fce5017b8f80e48590cd584efaac2e7)), closes [#217](https://github.com/Redocly/redoc/issues/217)
* **heading:** fix for headings render making failsafe, adding test, adjusting some commentary and spelling/typos ([d9bec1b](https://github.com/Redocly/redoc/commit/d9bec1bd6a9d46ce531a2eb507451a6cd2819975))


### Features

* add basic support openApi 3.1 ([#1622](https://github.com/Redocly/redoc/issues/1622)) ([823be24](https://github.com/Redocly/redoc/commit/823be24b313c3a2445df7e0801a0cc79c20bacd1))
* add clear cache for publish action ([#2129](https://github.com/Redocly/redoc/issues/2129)) ([d8093e3](https://github.com/Redocly/redoc/commit/d8093e3e2086874242eac82ddd202f35d5b8d558))
* add disable-google-font parameter to serve command in cli ([#1558](https://github.com/Redocly/redoc/issues/1558)) ([c7bbef5](https://github.com/Redocly/redoc/commit/c7bbef515524095e957729eac35a5b7a97619b55))
* Add download file option ([#1699](https://github.com/Redocly/redoc/issues/1699)) ([b601c9a](https://github.com/Redocly/redoc/commit/b601c9ae9e3288286f28e06854bd93cb3507706e))
* add github action to build docker images and push to ghcr.io on release ([#1614](https://github.com/Redocly/redoc/issues/1614)) ([919a5f0](https://github.com/Redocly/redoc/commit/919a5f02fb94ca869011d5eaf63ee71b61b60150))
* add hideSecuritySection option allowing to disable the Security panel ([#2027](https://github.com/Redocly/redoc/issues/2027)) ([49cc11d](https://github.com/Redocly/redoc/commit/49cc11d91795653ca870e9276a1e0cd617964e25))
* add new option hideSchemaPattern ([#1475](https://github.com/Redocly/redoc/issues/1475)) ([bb4594e](https://github.com/Redocly/redoc/commit/bb4594ee58d89819c975bdb575083c0667e3d940))
* add notification about new version available ([#2100](https://github.com/Redocly/redoc/issues/2100)) ([d6ca8cc](https://github.com/Redocly/redoc/commit/d6ca8cc53b9667f09ce8fef88dfac1039c562b78))
* add option to display verb in webhooks ([#1994](https://github.com/Redocly/redoc/issues/1994)) ([311d2ce](https://github.com/Redocly/redoc/commit/311d2ce64dcf1e68c2563a276b34dda0e08b709c))
* add optional BASE_PATH to Docker config ([#1378](https://github.com/Redocly/redoc/issues/1378)) ([90f71c0](https://github.com/Redocly/redoc/commit/90f71c0d77719871910cfba883a32ad131bef059))
* add q/kdb+ syntax highlighting ([#1605](https://github.com/Redocly/redoc/issues/1605)) ([43451ba](https://github.com/Redocly/redoc/commit/43451ba4cd24270b8629a967d3fd2ce2eed8912e))
* add Redoc to Redocly CDN ([#2026](https://github.com/Redocly/redoc/issues/2026)) ([77104d6](https://github.com/Redocly/redoc/commit/77104d6c0d6f457aa08a158e93b52a45877be84e))
* Add support for displaying operationId in the sidebar ([#1927](https://github.com/Redocly/redoc/issues/1927)) ([09786f2](https://github.com/Redocly/redoc/commit/09786f2a5ade6303ea00512483b172347721ca70))
* add support prefix items ([27a9dba](https://github.com/Redocly/redoc/commit/27a9dbaf46aded01a6512645dab27870a85cc73b))
* add tabTextColor option for responses ([#1451](https://github.com/Redocly/redoc/issues/1451)) ([702fea0](https://github.com/Redocly/redoc/commit/702fea0f410499101efc554983c6db58acc84889))
* add yaml highlight ([#1684](https://github.com/Redocly/redoc/issues/1684)) ([d724440](https://github.com/Redocly/redoc/commit/d72444008533623c87f238fe8758b1dd518b89eb))
* added git folder sync config ([a69f0fb](https://github.com/Redocly/redoc/commit/a69f0fb00986a04c812ab273711e8f3501b98139))
* added localization for some labels ([#1675](https://github.com/Redocly/redoc/issues/1675)) ([ec50858](https://github.com/Redocly/redoc/commit/ec50858ec47af08c5fe553266fe3c209fba97eae))
* display patternProperties ([#2008](https://github.com/Redocly/redoc/issues/2008)) ([660cc85](https://github.com/Redocly/redoc/commit/660cc857bc86787e16237b407fe5f5d7a493bb48))
* implement configurable minimum characer length to init search ([#1402](https://github.com/Redocly/redoc/issues/1402)) ([0fa08fa](https://github.com/Redocly/redoc/commit/0fa08faab1c176a4bfc5a553e8e8f8b07aca659f))
* merge refs oas 3.1 ([#1640](https://github.com/Redocly/redoc/issues/1640)) ([f4ea368](https://github.com/Redocly/redoc/commit/f4ea368f78a693fd70d48b5e0e5ffce3560432f4))
* new option generatedPayloadSamplesMaxDepth ([#1642](https://github.com/Redocly/redoc/issues/1642)) ([bd9390a](https://github.com/Redocly/redoc/commit/bd9390a5bfc5458c06121110db33968a20fcebe4))
* nonce support ([#1566](https://github.com/Redocly/redoc/issues/1566)) ([c75ac9c](https://github.com/Redocly/redoc/commit/c75ac9cf70012e2d539b379aab2f0974d088db07))
* redoc-cli add host option ([#1598](https://github.com/Redocly/redoc/issues/1598)) ([fb104e6](https://github.com/Redocly/redoc/commit/fb104e696618b0b81439da134887830a0f2439ea))
* remove auth section ([#2022](https://github.com/Redocly/redoc/issues/2022)) ([a863302](https://github.com/Redocly/redoc/commit/a863302cc803bdf27187c613157ba90af1040fc4))
* show minProperties maxProperties ([#2015](https://github.com/Redocly/redoc/issues/2015)) ([82712c5](https://github.com/Redocly/redoc/commit/82712c5b408dc6bc142307d45fb962de2a43ffba))
* support .redocly.yaml for options for redoc-cli ([#1981](https://github.com/Redocly/redoc/issues/1981)) ([1f417d6](https://github.com/Redocly/redoc/commit/1f417d67c6b2e0b49e41c713958c100d8e1ad19d))
* support conditional operators ([#1939](https://github.com/Redocly/redoc/issues/1939)) ([291b62a](https://github.com/Redocly/redoc/commit/291b62a206b68f8b4d98e4b74b71c0cad20a8b9b))
* support examples in object schema ([#1832](https://github.com/Redocly/redoc/issues/1832)) ([c986f0e](https://github.com/Redocly/redoc/commit/c986f0ef1a38bc1e61cae70830d84de03b684b89))
* support multiple examples for parameters ([#1470](https://github.com/Redocly/redoc/issues/1470)) ([d12e410](https://github.com/Redocly/redoc/commit/d12e410d99a988948b359093159df79572bc78ab))
* Support OAS 3.1 unevaluatedProperties ([#1978](https://github.com/Redocly/redoc/issues/1978)) ([0755ac6](https://github.com/Redocly/redoc/commit/0755ac6f04514eb0c08f90afceeda7858206b435))
* theme add links textDecoration options ([#1599](https://github.com/Redocly/redoc/issues/1599)) ([ba06485](https://github.com/Redocly/redoc/commit/ba06485ece27acbb6b846500817f4bff3e4997ba))
* theme add sidebar activeBackgroundColor and activeTextColor ([#1600](https://github.com/Redocly/redoc/issues/1600)) ([6716b08](https://github.com/Redocly/redoc/commit/6716b08e8871d95880e9f5a6c5491038002754e8))
* **#1251:** Add file selector to demo application ([#1859](https://github.com/Redocly/redoc/issues/1859)) ([b74dcde](https://github.com/Redocly/redoc/commit/b74dcde42b45ebe5ae617f1ec3cfea2ea1aff922)), closes [#1251](https://github.com/Redocly/redoc/issues/1251) [#1251](https://github.com/Redocly/redoc/issues/1251) [#1251](https://github.com/Redocly/redoc/issues/1251)
* add callbacks support ([#1224](https://github.com/Redocly/redoc/issues/1224)) ([57e93ec](https://github.com/Redocly/redoc/commit/57e93ec4355de2659fcb5449b14b7ed738c6c276))
* Add feature to specify href for logo explicitly ([#645](https://github.com/Redocly/redoc/issues/645)) ([87fd7d7](https://github.com/Redocly/redoc/commit/87fd7d7fdd4bfc2577aa22da9926b605891abf49))
* add field constraint indicator for uniqueItems ([#1423](https://github.com/Redocly/redoc/issues/1423)) ([c0ae9de](https://github.com/Redocly/redoc/commit/c0ae9de60758aa7561ce8a04b6e0060d0bc4a258)), closes [#1353](https://github.com/Redocly/redoc/issues/1353)
* add hideSingleRequestSampleTab option ([4550e4d](https://github.com/Redocly/redoc/commit/4550e4d61fadf22130b39c8570f060137a7494e7))
* add HTTP syntax highlighting ([#1157](https://github.com/Redocly/redoc/issues/1157)) ([27a4af7](https://github.com/Redocly/redoc/commit/27a4af707686d56280753473b4294ee4af096534))
* add lineHeight config for headings ([#894](https://github.com/Redocly/redoc/issues/894)) ([5dd5d6d](https://github.com/Redocly/redoc/commit/5dd5d6d704ec6e6f739c6f0c4ac868c73fbca0a0))
* add maxDisplayedEnumValues config and buttons for show/hide enums ([#1322](https://github.com/Redocly/redoc/issues/1322)) ([14e7db9](https://github.com/Redocly/redoc/commit/14e7db9403bc8f4fa8f8a83b1a7dfa4564d84bd4))
* Add option for skipping quotes in enums `enumSkipQuotes` ([#968](https://github.com/Redocly/redoc/issues/968)) ([afc7e36](https://github.com/Redocly/redoc/commit/afc7e36cf8b224a12c78cd2a1174581d00cc3561))
* add sampleCollapseLevel option ([#937](https://github.com/Redocly/redoc/issues/937)) ([d3f1c16](https://github.com/Redocly/redoc/commit/d3f1c1677c1a7259749919e55f9e6ff19bd752ca))
* add support for markdown in Server Object ([155d214](https://github.com/Redocly/redoc/commit/155d2145094159183af0867fe291447644ee3d3c))
* add webhooks support ([#1304](https://github.com/Redocly/redoc/issues/1304)) ([41f81b4](https://github.com/Redocly/redoc/commit/41f81b4d96648fec6bf0c39799c0aa2dded48749))
* add x-additionalPropertiesName ([#622](https://github.com/Redocly/redoc/issues/622)) ([#944](https://github.com/Redocly/redoc/issues/944)) ([0eb1e66](https://github.com/Redocly/redoc/commit/0eb1e66a10ad3add8db147e2bd6ce6ee333edd68))
* add x-explicitMappingOnly extension ([#1215](https://github.com/Redocly/redoc/issues/1215)) ([ea5b0aa](https://github.com/Redocly/redoc/commit/ea5b0aabf9133d11d3a8fcb79f9515d21e0d7ac0))
* added support for file paths as --options cli argument ([#1049](https://github.com/Redocly/redoc/issues/1049)) ([4adb927](https://github.com/Redocly/redoc/commit/4adb9274637fd1a8b17812c156d5e0e45d0e9ea7))
* array size info based on min max Items properties ([#1308](https://github.com/Redocly/redoc/issues/1308)) ([644e96a](https://github.com/Redocly/redoc/commit/644e96ae457047ce09f55aa1f14a42c41dbc1dc8))
* basic UI labels configuration ([b0e660e](https://github.com/Redocly/redoc/commit/b0e660eca00b2e8ad7c7824a56b03f2e9547e8c0))
* display `multipleOf` constrains ([#1065](https://github.com/Redocly/redoc/issues/1065)) ([3e90133](https://github.com/Redocly/redoc/commit/3e901336643b988ae45ae86c485005b8865e6e04))
* display requestBody description [#833](https://github.com/Redocly/redoc/issues/833) ([#838](https://github.com/Redocly/redoc/issues/838)) ([56ca371](https://github.com/Redocly/redoc/commit/56ca3716b34e1433b02195d1f1d6dd3d8db15f21))
* enable menuToggle by default ([5d81abe](https://github.com/Redocly/redoc/commit/5d81abeb28c1e4f2826e41424c10163834c37e45))
* load external search index ([346b10f](https://github.com/Redocly/redoc/commit/346b10f1739d6b44066bdf1f6aac39d5ee3567d2))
* new extensions hook PropertyDetailsCell + wrap property name into span ([0703f73](https://github.com/Redocly/redoc/commit/0703f73f79a1cabafdc1a908ebb0c5ab142ca825))
* new option expandDefaultServerVariables ([#1014](https://github.com/Redocly/redoc/issues/1014)) ([0360dce](https://github.com/Redocly/redoc/commit/0360dcee5aca970979a2c13b1f41bc6323013199))
* new option expandSingleSchemaField ([7608800](https://github.com/Redocly/redoc/commit/7608800d0acaa2fa0099dc840e17cd5aa90b54ca))
* new option hideSchemaTitles ([11cc4c4](https://github.com/Redocly/redoc/commit/11cc4c4c3e04a7e5bf3a9ebba20d10fa882a49e5))
* new option payloadSampleIdx ([eaaa99d](https://github.com/Redocly/redoc/commit/eaaa99d68e2392273e8d9c0173db3b546e035d5f))
* new option simpleOneOfTypeLabel ([7af2efe](https://github.com/Redocly/redoc/commit/7af2efe731cdb16ebe5de6cb3e96f80cceb7d98d))
* new option sortEnumValuesAlphabetically ([#1321](https://github.com/Redocly/redoc/issues/1321)) ([a96a11a](https://github.com/Redocly/redoc/commit/a96a11a4dc8a509c6c3fba67dc4e065b66624e18))
* support for ignoring specified named schemas ([9730c4e](https://github.com/Redocly/redoc/commit/9730c4ee1c274c5775966959b69c209c40034b11))
* **cli:** add `disableGoogleFont` parameter to cli ([#1045](https://github.com/Redocly/redoc/issues/1045)) ([aceb343](https://github.com/Redocly/redoc/commit/aceb3438f2329da5493b81268535bb9dc9b54f55))
* **cli:** Add templateOptions param to pass additional data to custom template ([#792](https://github.com/Redocly/redoc/issues/792)) ([4e8ee03](https://github.com/Redocly/redoc/commit/4e8ee0305d0830ebdbd7442613b834c9ca343ec6))
* **cli:** add the --title option to the serve subcommand ([#1160](https://github.com/Redocly/redoc/issues/1160)) ([10414fc](https://github.com/Redocly/redoc/commit/10414fc6d5c0f91b5e93b1ed2326e4e508611324))
* **cli:** added support for JSON string value for --options CLI argument ([#1047](https://github.com/Redocly/redoc/issues/1047)) ([2a28130](https://github.com/Redocly/redoc/commit/2a28130c82969229a8b72a486d2997fddd9426f4)), closes [#797](https://github.com/Redocly/redoc/issues/797)
* **cli:** Fallback on the spec's title before falling back on… ([#1073](https://github.com/Redocly/redoc/issues/1073)) ([e01eea4](https://github.com/Redocly/redoc/commit/e01eea445c93d74b66533c860d76bb3aff4d6df2))
* add clear icon to searchbox ([825162e](https://github.com/Redocly/redoc/commit/825162e5d75fa1806a2000a770c7dd781e678b56))
* add GH-like anchors to h1 and h2 headings in md ([bb3667d](https://github.com/Redocly/redoc/commit/bb3667d5d6d30222e407ffda53400d6694d168b1))
* add hide-loading option ([2ebca4b](https://github.com/Redocly/redoc/commit/2ebca4bb031e0feb89cd59ac2ae9b19d2c7ac88a)), closes [#315](https://github.com/Redocly/redoc/issues/315)
* add hideDownloadButton option ([8dbe938](https://github.com/Redocly/redoc/commit/8dbe938195770073a74d1b5be7cb106ee0b4769b))
* add ignoredHeaderParameters option ([56d62e5](https://github.com/Redocly/redoc/commit/56d62e5ab2d8debd8f267e35eab7154d5a71af58))
* add marker ([1ff2bd8](https://github.com/Redocly/redoc/commit/1ff2bd84cc715206cf8b59ebb86c5508e28b3e6e))
* add more options to theme ([cbce28a](https://github.com/Redocly/redoc/commit/cbce28aec35c3357ca0789e9c79764047eabe95c))
* add native-scrollbars option to workaround scrolling perf issues ([f2ed92c](https://github.com/Redocly/redoc/commit/f2ed92c69ebf63f59af715ad42c1f693b5208175))
* add new experimental option unstable_ignoreMimeParameters ([d162bab](https://github.com/Redocly/redoc/commit/d162babe193cb4965006f3cd26faa797e25e91bd))
* add perfect-scrollbar for side menu ([cdeee67](https://github.com/Redocly/redoc/commit/cdeee6740d73c0886300db92a03a8794b0898d67))
* Add special rendering for deprecated operations ([#290](https://github.com/Redocly/redoc/issues/290)) ([2748aac](https://github.com/Redocly/redoc/commit/2748aac024fef53aafb2598d835cb3ac874b348a))
* Add support for `x-servers` ([fd49082](https://github.com/Redocly/redoc/commit/fd49082db20783c802e58b216f837ac2092fa101))
* Add support for minLength and maxLength constraint humanization ([#700](https://github.com/Redocly/redoc/issues/700)) ([f40568b](https://github.com/Redocly/redoc/commit/f40568b79e4f7ce3d43478a10c72eb95bbb6e9dc)), closes [#42](https://github.com/Redocly/redoc/issues/42) [/github.com/Rebilly/ReDoc/issues/42#issuecomment-371883853](https://github.com//github.com/Rebilly/ReDoc/issues/42/issues/issuecomment-371883853)
* add triangle icon for expandable menu items ([e7130d2](https://github.com/Redocly/redoc/commit/e7130d2d04f7ecfc24eb87fc0c5b632097ce8fef))
* Add x-logo alt text support ([#584](https://github.com/Redocly/redoc/issues/584)) ([568ce74](https://github.com/Redocly/redoc/commit/568ce74077735b32f63bdad405bd3d8cb8b0ab5e)), closes [#546](https://github.com/Redocly/redoc/issues/546)
* align parameters to match up ([#375](https://github.com/Redocly/redoc/issues/375)) ([d083c16](https://github.com/Redocly/redoc/commit/d083c1631dd2434ea0536103c394e8373b6fff46))
* arrow navigation in search results ([fe3245a](https://github.com/Redocly/redoc/commit/fe3245a7a665aa522bfbb7da72a0931ec56b39d4))
* autoscroll menu ([b43a87d](https://github.com/Redocly/redoc/commit/b43a87d6275e7323a98de3766d242c9c2bba7d95)), closes [#88](https://github.com/Redocly/redoc/issues/88)
* basis search ([6990cd2](https://github.com/Redocly/redoc/commit/6990cd2f24ca8b866d2a45a7bb70496465c4b7b4))
* big theme update ([58bddc8](https://github.com/Redocly/redoc/commit/58bddc8811badaafeeed920e74c71463656a75fd))
* clear button (x) in search box ([0341db4](https://github.com/Redocly/redoc/commit/0341db455957f57f0a6f156eac017c21e151e522))
* Color of "default" Response depends on other successful responses are specified ([9d0dd25](https://github.com/Redocly/redoc/commit/9d0dd25f309634bf0c71ca0568150bd7c40c7975)), closes [#197](https://github.com/Redocly/redoc/issues/197)
* copy pretty-printed JSON ([e99d66d](https://github.com/Redocly/redoc/commit/e99d66d9ddaaec944341e2073afec4bd91771f7c)), closes [#219](https://github.com/Redocly/redoc/issues/219)
* display scope description as markdown, fixes [#466](https://github.com/Redocly/redoc/issues/466) ([0d6deff](https://github.com/Redocly/redoc/commit/0d6deff8c8477a72f5d3229aae21c0b705bd801c))
* display Value instead of Enum for one-item enum ([78fa312](https://github.com/Redocly/redoc/commit/78fa31225a23a7fe193a79db5a4211073fc3e7ab))
* display xml examples if present in response examples ([cb106cc](https://github.com/Redocly/redoc/commit/cb106cc6687fd863f9653f68bed3725e2853ac08))
* emphasize path with primary color in servers dropdown ([388b3d4](https://github.com/Redocly/redoc/commit/388b3d48d5766cb2d5d5a377add688ac3ee52d39))
* experimental temporary support for tags in md ([06ef51c](https://github.com/Redocly/redoc/commit/06ef51c08cc43f5e074dcf3e13cd775e93757ce5))
* export angular module <not stable yet> ([ef5101b](https://github.com/Redocly/redoc/commit/ef5101b1f2aceba883cdf0208fb6de36c8fee485))
* export TypeScript typings ([9115be8](https://github.com/Redocly/redoc/commit/9115be837808ccb774505ac0ce1dd2d2b0b149bc))
* externalDocumentation rendered for tags, operations and schema fields ([#595](https://github.com/Redocly/redoc/issues/595)) ([893c83e](https://github.com/Redocly/redoc/commit/893c83ed07c6a18ce0412cd3c7ac9a44a02e0d59)), closes [#550](https://github.com/Redocly/redoc/issues/550)
* generate download link for specs defined by an object ([60e8cb4](https://github.com/Redocly/redoc/commit/60e8cb437ab85253170ce3f4572bc0393b873dda)), closes [#289](https://github.com/Redocly/redoc/issues/289)
* improved type string with minLength == maxLength ([e76bcc3](https://github.com/Redocly/redoc/commit/e76bcc332965b8a45ef943e78721e145b31bceac)), closes [#212](https://github.com/Redocly/redoc/issues/212)
* initial display security requirements ([50e2a58](https://github.com/Redocly/redoc/commit/50e2a5868d207e4b9782026c44d2f73fe5c6c8ac))
* more advanced theme engine ([1df690a](https://github.com/Redocly/redoc/commit/1df690a96413e674fb9fee40f713b611a44c5a92))
* new option `required-props-first` ([c724df4](https://github.com/Redocly/redoc/commit/c724df48f410f29b70d0a8c4ea3e0d611eab8472)), closes [#191](https://github.com/Redocly/redoc/issues/191)
* new option disableSearch ([d4ab5ad](https://github.com/Redocly/redoc/commit/d4ab5adc1788a7b9344a2ad0367ca071fcc375fa))
* new option hide-download-button ([454e5bd](https://github.com/Redocly/redoc/commit/454e5bd0e972574d2d4306f2539003629908118e)), closes [#394](https://github.com/Redocly/redoc/issues/394)
* New option onlyRequiredInSamples ([#646](https://github.com/Redocly/redoc/issues/646)) ([10bca66](https://github.com/Redocly/redoc/commit/10bca66dcedeb24e6b240b280d9c0a5130a4e110))
* new option path-in-middle-panel ([74a3193](https://github.com/Redocly/redoc/commit/74a319393c6473315103a530cfa21db0b206b761))
* new option sortPropsAlphabetically ([b87cf0d](https://github.com/Redocly/redoc/commit/b87cf0d8d5344681ff83b97f72c5ce07c5a39906))
* new theme colors: code and codeBg ([f8b793d](https://github.com/Redocly/redoc/commit/f8b793d2dca8c9d63694b1abe332176c9ae315e2))
* new theme option: nestingSpacing ([782ef77](https://github.com/Redocly/redoc/commit/782ef77080ec76b033805840be5b4ea1f8922160))
* new theme options spacing-> sectionHorizontal and sectionVertical ([505463f](https://github.com/Redocly/redoc/commit/505463f5ab520d1d2690c9baa6bea5a249dfcb84))
* pass error in init callback + onLoaded for RedocStandalone ([16313b8](https://github.com/Redocly/redoc/commit/16313b8293af4f4d26b1a289e8de639822b3819a))
* port "copy to clipboard" / "expand/collapse all" functionality ([5bb0bdf](https://github.com/Redocly/redoc/commit/5bb0bdfd2967347430e4b2a93089c52437051440)), closes [#410](https://github.com/Redocly/redoc/issues/410)
* ReDoc CLI ✨ ([390f6c1](https://github.com/Redocly/redoc/commit/390f6c132414289efbe9d6035aa2a69fe9e3cc28))
* reqired-first sort order for params ([ecf33d2](https://github.com/Redocly/redoc/commit/ecf33d2dca161cac374b41dc07dfb516f6a8ddcc))
* responsive side menu ([3aab2d9](https://github.com/Redocly/redoc/commit/3aab2d97d3f9f8c0665bf40c28c03dc4ca4b56f0))
* serialize search-index ([e94f842](https://github.com/Redocly/redoc/commit/e94f84283d3fcae8340a508016e2596cd4dd3795))
* show type string with minLength 1 as "non-empty" ([d175a4d](https://github.com/Redocly/redoc/commit/d175a4d6aee978ed31d24709193f31d6423cf80b)), closes [#192](https://github.com/Redocly/redoc/issues/192)
* SideMenu to support items template as a parameter ([8a49fb3](https://github.com/Redocly/redoc/commit/8a49fb30deb2ee377da7df8ce763764e370e3a47))
* simple variable substitution support ([9d6b30c](https://github.com/Redocly/redoc/commit/9d6b30c55a3e9ac38e4076c8a55f1734bb1b674e)), closes [#565](https://github.com/Redocly/redoc/issues/565)
* support externalValue for examples ([2cdfcd2](https://github.com/Redocly/redoc/commit/2cdfcd25cd7520e9ef7df49329e736e5c308bebb)), closes [#551](https://github.com/Redocly/redoc/issues/551) [#840](https://github.com/Redocly/redoc/issues/840)
* support for OpenAPI object as a parameter for `init` ([d99f256](https://github.com/Redocly/redoc/commit/d99f2562acaa7219399fa0ae9806efeaebebb58c)), closes [#224](https://github.com/Redocly/redoc/issues/224)
* support for x-discriminator-value for 2.0 as alternative to mapping ([#534](https://github.com/Redocly/redoc/issues/534)) ([070dc5c](https://github.com/Redocly/redoc/commit/070dc5c0a81bcec0a5a249af6c474dd530868bb9))
* support for xml samples in response when there is no schema in response ([eb7089b](https://github.com/Redocly/redoc/commit/eb7089b76c456b66c3839568d626962da0c65814)), closes [#307](https://github.com/Redocly/redoc/issues/307)
* support label for x-code-samples ([00bd966](https://github.com/Redocly/redoc/commit/00bd966797b69ef07aef7258539516f18513a227)), closes [#586](https://github.com/Redocly/redoc/issues/586)
* support text-plain response sample ([b84177c](https://github.com/Redocly/redoc/commit/b84177c1578df3c6972cd6006328a36f9cb87988)), closes [#270](https://github.com/Redocly/redoc/issues/270)
* support x-discriminator for OpenAPI 2 ([aaff311](https://github.com/Redocly/redoc/commit/aaff311a3ed54e10de55f0702111d5369ace68b3)), closes [#496](https://github.com/Redocly/redoc/issues/496)
* support x-summary for response objects ([63ae2e8](https://github.com/Redocly/redoc/commit/63ae2e8e943b1cf2838db20c6c567156a2bfac45)), closes [#500](https://github.com/Redocly/redoc/issues/500)
* theme hooks experimental hooks ([55bd853](https://github.com/Redocly/redoc/commit/55bd8535b42ceda23e0513f21061266bab1f32a0))
* turn off code-blocks wrapping ([393681b](https://github.com/Redocly/redoc/commit/393681b99e16932f6cb73dc3b04ffcfb065edb5f)), closes [#658](https://github.com/Redocly/redoc/issues/658)
* **cli:** add --template option ([b7afce9](https://github.com/Redocly/redoc/commit/b7afce9481265ecb4dc0b399d80d7d9faa6aad01))
* **cli:** add options to specify redoc options ([2732c89](https://github.com/Redocly/redoc/commit/2732c8931622d217faf1dc13bb4c6d3e14fde673))
* **cli:** add title option to bundle ([bb8a678](https://github.com/Redocly/redoc/commit/bb8a6784c2442fc86de106301871da8741b65306))
* **cli:** watch the directory that contains the specified spec instead of the spec itself ([#519](https://github.com/Redocly/redoc/issues/519)) ([723516b](https://github.com/Redocly/redoc/commit/723516b0896ea2b492aaae75afb5a740f5593e5a)), closes [#514](https://github.com/Redocly/redoc/issues/514)
* update fragment while scrolling and on menu clicks ([66c06b3](https://github.com/Redocly/redoc/commit/66c06b30b96fc0fe6ce8ba18eb69a342252526f1)), closes [#138](https://github.com/Redocly/redoc/issues/138) [#202](https://github.com/Redocly/redoc/issues/202)
* use new Context API for options ([e022349](https://github.com/Redocly/redoc/commit/e0223494c2ddf63833ac26dd33bd7bd884de7b38))


### Reverts

* Revert "hotfix: field expand (#1878)" (#1879) ([f411f0a](https://github.com/Redocly/redoc/commit/f411f0aee2ffe9847bcbf389b96f97b13791713e)), closes [#1878](https://github.com/Redocly/redoc/issues/1878) [#1879](https://github.com/Redocly/redoc/issues/1879)
* Revert "Not run extra prod build on simple CI run" - npm runs prebublish on install :( ([34d8230](https://github.com/Redocly/redoc/commit/34d8230f8be76685a699c964c52d10c274ef7a11))
* Revert "Adding style for rebilly api logo" ([cfcfb95](https://github.com/Redocly/redoc/commit/cfcfb95e5899d19025ac35448ac4e222e4e8ee29))



# [2.0.0-rc.76](https://github.com/Redocly/redoc/compare/v2.0.0-rc.75...v2.0.0-rc.76) (2022-08-18)


### Bug Fixes

* "API Docs By Redocly" overlapping last element in sidebar ([#2132](https://github.com/Redocly/redoc/issues/2132)) ([c60c6f5](https://github.com/Redocly/redoc/commit/c60c6f58917563d57c0eef650b9dfcece2e15049))
* encoding issue in CDN responses ([#2130](https://github.com/Redocly/redoc/issues/2130)) ([7816902](https://github.com/Redocly/redoc/commit/781690284a45b2b8af9eb525757632d0d19ef453))
* Optional authentication not rendered properly ([#2117](https://github.com/Redocly/redoc/issues/2117)) ([#2134](https://github.com/Redocly/redoc/issues/2134)) ([efd5e09](https://github.com/Redocly/redoc/commit/efd5e09c907b36a3999f4c9c3165b6b2bdc1d536))


### Features

* add clear cache for publish action ([#2129](https://github.com/Redocly/redoc/issues/2129)) ([d8093e3](https://github.com/Redocly/redoc/commit/d8093e3e2086874242eac82ddd202f35d5b8d558))



# [2.0.0-rc.75](https://github.com/Redocly/redoc/compare/v2.0.0-rc.74...v2.0.0-rc.75) (2022-08-10)


### Bug Fixes

* duplication of title ([#2119](https://github.com/Redocly/redoc/issues/2119)) ([40ebfd2](https://github.com/Redocly/redoc/commit/40ebfd2d63758b37665e2e4447732f671811e2a5))
* handle error if security scopes is invalid ([#2113](https://github.com/Redocly/redoc/issues/2113)) ([428fd69](https://github.com/Redocly/redoc/commit/428fd6983dc257f524121d98aeb1c58b39cf81f7))
* publishing docker image to github packages ([#2115](https://github.com/Redocly/redoc/issues/2115)) ([250f6d1](https://github.com/Redocly/redoc/commit/250f6d12b2d31d2166990bd9cb83ca1c63509686))
* Redocly logo ([#2109](https://github.com/Redocly/redoc/issues/2109)) ([a35bb3f](https://github.com/Redocly/redoc/commit/a35bb3ff26bf10b0e54383222df283800d6ee2c8))
* search and navigate error ([cfd810f](https://github.com/Redocly/redoc/commit/cfd810fdf9d37862e07458fa1c3c04046e22f315))
* sibling for openapi 3.1 ([#2112](https://github.com/Redocly/redoc/issues/2112)) ([0b1a790](https://github.com/Redocly/redoc/commit/0b1a79009010f0640a3030093b7c0dcf8caa49e4))


### Features

* add notification about new version available ([#2100](https://github.com/Redocly/redoc/issues/2100)) ([d6ca8cc](https://github.com/Redocly/redoc/commit/d6ca8cc53b9667f09ce8fef88dfac1039c562b78))



# [2.0.0-rc.74](https://github.com/Redocly/redoc/compare/v2.0.0-rc.73...v2.0.0-rc.74) (2022-07-28)


### Bug Fixes

* invalid url when href is empty ([#2105](https://github.com/Redocly/redoc/issues/2105)) ([e5f0235](https://github.com/Redocly/redoc/commit/e5f02359851a3797283ee513d734ab8e27266b92))



# [2.0.0-rc.73](https://github.com/Redocly/redoc/compare/v2.0.0-rc.72...v2.0.0-rc.73) (2022-07-28)


### Bug Fixes

* add label API docs by Redocly ([#2099](https://github.com/Redocly/redoc/issues/2099)) ([dcdab83](https://github.com/Redocly/redoc/commit/dcdab838903a5d923c5e327d07d7743214769a61))
* add the latest tag for the CLI docker image ([#2087](https://github.com/Redocly/redoc/issues/2087)) ([80ecd0f](https://github.com/Redocly/redoc/commit/80ecd0f19746379b056bfb1b11950693f3dc3724))
* correct URLs of OperationModel servers for static site generation ([#2081](https://github.com/Redocly/redoc/issues/2081)) ([b1afd08](https://github.com/Redocly/redoc/commit/b1afd08bcf83770b537ed1eb9c90341de0162a1c))
* enum duplication values when schema uses a specific combination of oneOf and allOf([#2088](https://github.com/Redocly/redoc/issues/2088)) ([e411847](https://github.com/Redocly/redoc/commit/e4118479f69209c5dd09a2be0e978834dcd9eb8f))
* highlight text syntax ([#2069](https://github.com/Redocly/redoc/issues/2069)) ([4fc6aa0](https://github.com/Redocly/redoc/commit/4fc6aa0859c94e25fd30c4a4250455e44cc76488))
* merge reference for openapi 3.1 ([#2063](https://github.com/Redocly/redoc/issues/2063)) ([87541e4](https://github.com/Redocly/redoc/commit/87541e45dc2526696deb32a6350a14a44a709b54))
* nested patternProperties ([#2073](https://github.com/Redocly/redoc/issues/2073)) ([9920991](https://github.com/Redocly/redoc/commit/99209910806b85289a89fb3131049ed79118bc72))
* operation url in static page ([#2093](https://github.com/Redocly/redoc/issues/2093)) ([98eec19](https://github.com/Redocly/redoc/commit/98eec19647b63f3598ec30fdeb428f614cf93ad4))
* property with nested allOf ([#2083](https://github.com/Redocly/redoc/issues/2083)) ([7cc0500](https://github.com/Redocly/redoc/commit/7cc0500f3c1ddd1da17ee31278468207093f9281))
* recursion for boolean items ([#2097](https://github.com/Redocly/redoc/issues/2097)) ([a5804db](https://github.com/Redocly/redoc/commit/a5804db1ce60ee6d90db8a3b54138eb1ca420c6f))
* resolve dependency conflict in installing ([#2060](https://github.com/Redocly/redoc/issues/2060)) ([e26c8b2](https://github.com/Redocly/redoc/commit/e26c8b23d9b36abd5572bd0fe350d74a5cf65afb))
* restore old variant security injections ([#2075](https://github.com/Redocly/redoc/issues/2075)) ([1a1bc26](https://github.com/Redocly/redoc/commit/1a1bc26503c06b6a7022289e5b9353bd59e48a9a))
* rewrite recursive checks ([#2072](https://github.com/Redocly/redoc/issues/2072)) ([2970f95](https://github.com/Redocly/redoc/commit/2970f959cfa31cb4d5288ca23ca05cd34357dcec))
* Scrolling keeps rewriting url after a Redoc element was removed [#2051](https://github.com/Redocly/redoc/issues/2051) ([#2085](https://github.com/Redocly/redoc/issues/2085)) ([0045be0](https://github.com/Redocly/redoc/commit/0045be0b753b8fb7d8d58a4e511783a6ba858444))
* mis-nesting of aria roles on sidebar navigation ([#2050](https://github.com/Redocly/redoc/issues/2050)) ([7ca10da](https://github.com/Redocly/redoc/commit/7ca10daf12f2cac9fecf559b11f0f0c8bd21ae43))
* 404 on the documentation page ([#2092](https://github.com/Redocly/redoc/issues/2050)) ([17bb08](https://github.com/Redocly/redoc/commit/17bb08909a1734e6e59c83ce29f31ae7cf6fc784))




# [2.0.0-rc.72](https://github.com/Redocly/redoc/compare/v2.0.0-rc.71...v2.0.0-rc.72) (2022-06-02)


### Bug Fixes

* handled style change in ServerUrl and ServersOverlay dynamically ([#1989](https://github.com/Redocly/redoc/issues/1989)) ([a366de4](https://github.com/Redocly/redoc/commit/a366de4cf67fb94baa33b7b5c311cc1f54a63e53))
* nested items with refs ([#2035](https://github.com/Redocly/redoc/issues/2035)) ([51127aa](https://github.com/Redocly/redoc/commit/51127aadc3e6b0f8e4066afb1c3b2ea6db453da2))



# [2.0.0-rc.71](https://github.com/Redocly/redoc/compare/v2.0.0-rc.70...v2.0.0-rc.71) (2022-05-31)


### Bug Fixes

* constraints label details ([eb0917d](https://github.com/Redocly/redoc/commit/eb0917d002e57353027fee9c8f07605de8f1ff6f))
* merge allOf in correct order ([#2020](https://github.com/Redocly/redoc/issues/2020)) ([1e4ea03](https://github.com/Redocly/redoc/commit/1e4ea03d4a9b7eddf3e4cc7cbdbd4d913583e837))


### Features

* add hideSecuritySection option allowing to disable the Security panel ([#2027](https://github.com/Redocly/redoc/issues/2027)) ([49cc11d](https://github.com/Redocly/redoc/commit/49cc11d91795653ca870e9276a1e0cd617964e25))
* add Redoc to Redocly CDN ([#2026](https://github.com/Redocly/redoc/issues/2026)) ([77104d6](https://github.com/Redocly/redoc/commit/77104d6c0d6f457aa08a158e93b52a45877be84e))
* add support prefix items ([27a9dba](https://github.com/Redocly/redoc/commit/27a9dbaf46aded01a6512645dab27870a85cc73b))
* remove auth section ([#2022](https://github.com/Redocly/redoc/issues/2022)) ([a863302](https://github.com/Redocly/redoc/commit/a863302cc803bdf27187c613157ba90af1040fc4))
* show minProperties maxProperties ([#2015](https://github.com/Redocly/redoc/issues/2015)) ([82712c5](https://github.com/Redocly/redoc/commit/82712c5b408dc6bc142307d45fb962de2a43ffba))



# [2.0.0-rc.70](https://github.com/Redocly/redoc/compare/2.0.0-rc.69...2.0.0-rc.70) (2022-05-17)


### Features

* display patternProperties ([#2008](https://github.com/Redocly/redoc/issues/2008)) ([660cc85](https://github.com/Redocly/redoc/commit/660cc857bc86787e16237b407fe5f5d7a493bb48))
* support conditional operators ([#1939](https://github.com/Redocly/redoc/issues/1939)) ([291b62a](https://github.com/Redocly/redoc/commit/291b62a206b68f8b4d98e4b74b71c0cad20a8b9b))
* theme add links textDecoration options ([#1599](https://github.com/Redocly/redoc/issues/1599)) ([ba06485](https://github.com/Redocly/redoc/commit/ba06485ece27acbb6b846500817f4bff3e4997ba))



# [2.0.0-rc.69](https://github.com/Redocly/redoc/compare/v2.0.0-rc.68.1...v2.0.0-rc.69) (2022-05-12)


### Bug Fixes

* wrong base url format causing error when constructing new URL ([#1996](https://github.com/Redocly/redoc/issues/1996)) ([d2cdaa1](https://github.com/Redocly/redoc/commit/d2cdaa1221b6a5e7b5da2418414bce1586069deb))


### Features

* add download file option ([#1699](https://github.com/Redocly/redoc/issues/1699)) ([b601c9a](https://github.com/Redocly/redoc/commit/b601c9ae9e3288286f28e06854bd93cb3507706e))
* add option to display verb in webhooks ([#1994](https://github.com/Redocly/redoc/issues/1994)) ([311d2ce](https://github.com/Redocly/redoc/commit/311d2ce64dcf1e68c2563a276b34dda0e08b709c))
* support .redocly.yaml for options for redoc-cli ([#1981](https://github.com/Redocly/redoc/issues/1981)) ([1f417d6](https://github.com/Redocly/redoc/commit/1f417d67c6b2e0b49e41c713958c100d8e1ad19d))



# [2.0.0-rc.68](https://github.com/Redocly/redoc/compare/v2.0.0-rc.67...v2.0.0-rc.68) (2022-05-10)


### Bug Fixes

* examples in json schema object([5b9aa27](https://github.com/Redocly/redoc/commit/5b9aa27af03a1c4616f7e0195afeba47d1deeaa0))
* handle error when definition load fails ([#1979](https://github.com/Redocly/redoc/issues/1979)) ([508ebd5](https://github.com/Redocly/redoc/commit/508ebd58a3d66f2337e9641852322458a1bd9e6b))
* large text in examples value ([#1974](https://github.com/Redocly/redoc/issues/1974)) ([60bc603](https://github.com/Redocly/redoc/commit/60bc603e9bb85a0c9c7ac38f7014876d397f0191))
* not show scopes if keys empty or not exist ([#1975](https://github.com/Redocly/redoc/issues/1975)) ([4e793f0](https://github.com/Redocly/redoc/commit/4e793f07a81fa8bcd4ad384d1f87b3e6c290edb7))
* remove dropdown-aria and use native select ([#1954](https://github.com/Redocly/redoc/issues/1954)) ([186f5a9](https://github.com/Redocly/redoc/commit/186f5a98bd466b1820121aadb865291bef8c6755))
* make Redoc lib compatible with Webpack 5 ([#1982](https://github.com/Redocly/redoc/issues/1982)) ([867861](https://github.com/Redocly/redoc/commit/8678615a0e19c9484b4cd495d70293b542d196a5))

### Features

* implement configurable minimum characer length to init search ([#1402](https://github.com/Redocly/redoc/issues/1402)) ([0fa08fa](https://github.com/Redocly/redoc/commit/0fa08faab1c176a4bfc5a553e8e8f8b07aca659f))
* support OAS 3.1 unevaluatedProperties ([#1978](https://github.com/Redocly/redoc/issues/1978)) ([0755ac6](https://github.com/Redocly/redoc/commit/0755ac6f04514eb0c08f90afceeda7858206b435))
* publish dockerhub ([#1971](https://github.com/Redocly/redoc/issues/1971)) ([7e01a0](https://github.com/Redocly/redoc/commit/7e01a0cfe2ad8d06075bfc66ef3860edbef033f8)) 


# [2.0.0-rc.67](https://github.com/Redocly/redoc/compare/v2.0.0-rc.66...v2.0.0-rc.67) (2022-04-28)


### Bug Fixes

* Expand/Collapse all buttons disappears for flat structures ([#1424](https://github.com/Redocly/redoc/issues/1424)) ([2ca8e08](https://github.com/Redocly/redoc/commit/2ca8e081baea6996eb01b5df27b8cd88331d5c96))
* improve markdown render with CRLF ([#1953](https://github.com/Redocly/redoc/issues/1953)) ([aba2d1a](https://github.com/Redocly/redoc/commit/aba2d1ad2d8dda9f52055c36ebde1323457dfd3e))
* issue with navigation when operationId contains backslash or quotes ([#1513](https://github.com/Redocly/redoc/issues/1513)) ([8f7e56c](https://github.com/Redocly/redoc/commit/8f7e56c747d88be5c5eb5c4bbaee0ff69e9cb2ec))
* prefix operation ids with parent id ([#1245](https://github.com/Redocly/redoc/issues/1245)) ([fd8917e](https://github.com/Redocly/redoc/commit/fd8917e5c109840c1bfa4c2c0902b6dcec200286))


### Features

* add optional BASE_PATH to Docker config ([#1378](https://github.com/Redocly/redoc/issues/1378)) ([90f71c0](https://github.com/Redocly/redoc/commit/90f71c0d77719871910cfba883a32ad131bef059))
* theme add sidebar activeBackgroundColor and activeTextColor ([#1600](https://github.com/Redocly/redoc/issues/1600)) ([6716b08](https://github.com/Redocly/redoc/commit/6716b08e8871d95880e9f5a6c5491038002754e8))



# [2.0.0-rc.66](https://github.com/Redocly/redoc/compare/v2.0.0-rc.65...v2.0.0-rc.66) (2022-03-30)


### Bug Fixes

* add handle local files for serve command ([#1810](https://github.com/Redocly/redoc/issues/1810)) ([117071e](https://github.com/Redocly/redoc/commit/117071ee83a32d9b3350d8afe2bdb6365a44e2ec))
* move comma out of code block in SecurityRequirement.tsx ([#1924](https://github.com/Redocly/redoc/issues/1924)) ([ab3e8a8](https://github.com/Redocly/redoc/commit/ab3e8a8f80f453066c5495e73ac932a8fef0830a))
* rename bandle command and add deprecate notice ([#1935](https://github.com/Redocly/redoc/issues/1935)) ([eb096b6](https://github.com/Redocly/redoc/commit/eb096b69be52568fc581027161c7d0c4b26c56c1))


### Features

* add support for displaying operationId in the sidebar ([#1927](https://github.com/Redocly/redoc/issues/1927)) ([09786f2](https://github.com/Redocly/redoc/commit/09786f2a5ade6303ea00512483b172347721ca70))
* add nonce support ([#1566](https://github.com/Redocly/redoc/issues/1566)) ([c75ac9c](https://github.com/Redocly/redoc/commit/c75ac9cf70012e2d539b379aab2f0974d088db07))
* h2 set color form theme.colors.text.primary ([#1491](https://github.com/Redocly/redoc/pull/1491)) ([25be93](https://github.com/Redocly/redoc/commit/25be934bb184d7b2b6b47d004b3c83ce4d16a2c6))



# [2.0.0-rc.65](https://github.com/Redocly/redoc/compare/v2.0.0-rc.64...v2.0.0-rc.65) (2022-03-15)


### Bug Fixes

* auth link scroll for Firerox ([#1922](https://github.com/Redocly/redoc/issues/1922)) ([fe67e9c](https://github.com/Redocly/redoc/commit/fe67e9c332fee716582a00d60fdf34767bff22d4))
* improve customization fab ([#1891](https://github.com/Redocly/redoc/issues/1891)) ([635f379](https://github.com/Redocly/redoc/commit/635f379eb086268c91eef715148eca8f080cfb86))
* sanitize array of items ([#1920](https://github.com/Redocly/redoc/issues/1920)) ([059bd80](https://github.com/Redocly/redoc/commit/059bd8000e5fd65753d5ca9e0c47940394e0c79b))
* use x-displayName in securityDefinitions ([#1444](https://github.com/Redocly/redoc/pull/1444)) ([ac6fb4](https://github.com/Redocly/redoc/commit/ac6fb458a4eee8d0da4b63f9bafc7669adc8af03))
* deprecated badge on one of any of buttons ([#1930](https://github.com/Redocly/redoc/pull/1930)) ([f60b47](https://github.com/Redocly/redoc/commit/f60b4758330dd756d670309827da60d3465b672a))



# [2.0.0-rc.64](https://github.com/Redocly/redoc/compare/v2.0.0-rc.63...v2.0.0-rc.64) (2022-02-24)


### Bug Fixes

* bump json-pointer version to avoid CVE-2021-23820 ([#1910](https://github.com/Redocly/redoc/issues/1910)) ([777efdd](https://github.com/Redocly/redoc/commit/777efdde35c1c8dc79dd714e1666279e9192dddb))
* external ref in schema definition ([#1894](https://github.com/Redocly/redoc/issues/1894)) ([57cdd9f](https://github.com/Redocly/redoc/commit/57cdd9f6da38418d6214ac3c6480c5847ecd0228))



# [2.0.0-rc.63](https://github.com/Redocly/redoc/compare/v2.0.0-rc.61...v2.0.0-rc.63) (2022-01-27)


### Bug Fixes

* scroll in sidebar ([b5b0d61](https://github.com/Redocly/redoc/commit/b5b0d61b3568ac2a8aaceafa96ffa6d2f86ed323))


# [2.0.0-rc.62](https://github.com/Redocly/redoc/compare/v2.0.0-rc.61...v2.0.0-rc.62) (2022-01-26)


### Bug Fixes

* fix field expand does not work ([#1875](https://github.com/Redocly/redoc/issues/1875))


# [2.0.0-rc.61](https://github.com/Redocly/redoc/compare/v2.0.0-rc.60...v2.0.0-rc.61) (2022-01-26)


### Bug Fixes

* fix crash in redoc-cli after migrating to esbuild ([#1872](https://github.com/Redocly/redoc/issues/1872))

# [2.0.0-rc.60](https://github.com/Redocly/redoc/compare/v2.0.0-rc.59...v2.0.0-rc.60) (2022-01-25)


### Bug Fixes

* add schema expansion level ([#1868](https://github.com/Redocly/redoc/issues/1868)) ([250d53a](https://github.com/Redocly/redoc/commit/250d53a59fb4bf881875ba466c5a7f3b55d80007))
* attachHeadingsDescriptions match headings incorrectly ([#1845](https://github.com/Redocly/redoc/issues/1845)) ([ea8573d](https://github.com/Redocly/redoc/commit/ea8573dbd78439be50aa2b38f1c83658c16783e3))
* definition name util ([#1865](https://github.com/Redocly/redoc/issues/1865)) ([95a7347](https://github.com/Redocly/redoc/commit/95a734793158d4749e98ee4a7e90e70713a04ced))
* No maxLength label is displayed for arrays of items [#1701](https://github.com/Redocly/redoc/issues/1701) ([#1765](https://github.com/Redocly/redoc/issues/1765)) ([6c7685e](https://github.com/Redocly/redoc/commit/6c7685e5fa04314328a445d7077600692c49489c))
* Response objects couldn't open ([#1867](https://github.com/Redocly/redoc/issues/1867)) ([18f943d](https://github.com/Redocly/redoc/commit/18f943d2b5668f1552d212dee1c3a2ed59054095))
* writeOnly params displaying in webhook ([#1866](https://github.com/Redocly/redoc/issues/1866)) ([5694913](https://github.com/Redocly/redoc/commit/5694913e71f0e8c3a5d9393f1b4ae92534127841))


### Features

* **#1251:** Add file selector to demo application ([#1859](https://github.com/Redocly/redoc/issues/1859)) ([b74dcde](https://github.com/Redocly/redoc/commit/b74dcde42b45ebe5ae617f1ec3cfea2ea1aff922)), closes [#1251](https://github.com/Redocly/redoc/issues/1251) [#1251](https://github.com/Redocly/redoc/issues/1251) [#1251](https://github.com/Redocly/redoc/issues/1251)
* redoc-cli add host option ([#1598](https://github.com/Redocly/redoc/issues/1598)) ([fb104e6](https://github.com/Redocly/redoc/commit/fb104e696618b0b81439da134887830a0f2439ea))
* support examples in object schema ([#1832](https://github.com/Redocly/redoc/issues/1832)) ([c986f0e](https://github.com/Redocly/redoc/commit/c986f0ef1a38bc1e61cae70830d84de03b684b89))



# [2.0.0-rc.59](https://github.com/Redocly/redoc/compare/v2.0.0-rc.58...v2.0.0-rc.59) (2021-12-09)


### Bug Fixes

* fix scroll in example dropdown ([#1803](https://github.com/Redocly/redoc/issues/1803)) ([bc2d9a7](https://github.com/Redocly/redoc/commit/bc2d9a7d9cd530274483fecd136db290a5b46ff7))
* x-examples for request body param does not display [#1743](https://github.com/Redocly/redoc/issues/1743) ([#1826](https://github.com/Redocly/redoc/issues/1826)) ([aaa3b32](https://github.com/Redocly/redoc/commit/aaa3b3280c8422d450e8849ae02135dde199d6d5))

### Features

* add option sideNavStyle ([#1805](https://github.com/Redocly/redoc/pull/1805)) ([2e4663b](https://github.com/Redocly/redoc/commit/2e4663b3b7022f25d3dc808afbcb3b3ad9483c41))


# [2.0.0-rc.58](https://github.com/Redocly/redoc/compare/v2.0.0-rc.57...v2.0.0-rc.58) (2021-11-29)


### Bug Fixes

* add browser build for webpack 5 ([#1796](https://github.com/Redocly/redoc/issues/1796)) ([0e43ad3](https://github.com/Redocly/redoc/commit/0e43ad3102cfba8c4b30e59500ad4efc53f01c2d))
* Default boolean property value not rendered [#1779](https://github.com/Redocly/redoc/issues/1779) ([#1781](https://github.com/Redocly/redoc/issues/1781)) ([734080c](https://github.com/Redocly/redoc/commit/734080c35471d16f87004f7f9a51dcdeee1278a6))
* exclusiveMin/Max shows incorect range ([#1799](https://github.com/Redocly/redoc/issues/1799)) ([b604bd8](https://github.com/Redocly/redoc/commit/b604bd8da874f07e9e9f8b193ad10117a5f5059c))
* mobile view in docker image ([#1795](https://github.com/Redocly/redoc/issues/1795)) ([ad652b9](https://github.com/Redocly/redoc/commit/ad652b9c7fbcd84a6e83397272de64e57213fe9a))



# [2.0.0-rc.57](https://github.com/Redocly/redoc/compare/v2.0.0-rc.56...v2.0.0-rc.57) (2021-10-11)


### Bug Fixes

* fix deref logic for oas3.1 ([#1767](https://github.com/Redocly/redoc/issues/1767)) ([4fb9c83](https://github.com/Redocly/redoc/commit/4fb9c835256b9e44bcecabde7baf0f0f3e5beb3f))
* improve publish action scripts ([#1729](https://github.com/Redocly/redoc/issues/1729)) ([952c05c](https://github.com/Redocly/redoc/commit/952c05c6b4b95fe6082611fed9e2f0913272b904))
* No match scenario in search ([#1667](https://github.com/Redocly/redoc/issues/1667)) ([352a851](https://github.com/Redocly/redoc/commit/352a8518576dfb6b240ec41212a64f1c7312ab67))
* OpenAPI 3.1: Missing description when $ref used [#1727](https://github.com/Redocly/redoc/issues/1727) ([fe6909e](https://github.com/Redocly/redoc/commit/fe6909ed80dd6053b48c30f63a2460614bf957a9))
* OpenAPI 3.1: Missing description when $ref used [#1727](https://github.com/Redocly/redoc/issues/1727) ([35f7787](https://github.com/Redocly/redoc/commit/35f77878de7d1dd250040771f17757a5a6ce85f9))
* Redoc spelling ([c87600d](https://github.com/Redocly/redoc/commit/c87600d520f037d291169b44b5803a35af16b5a5))
* Schema for events incorrectly omits readOnly and includes writeOnly ([#1720](https://github.com/Redocly/redoc/issues/1720) [#1540](https://github.com/Redocly/redoc/issues/1540)) ([a8e0c29](https://github.com/Redocly/redoc/commit/a8e0c296852661dec1dcad2388d7589f9e0d3609))
* scrolling to the first item ([#1753](https://github.com/Redocly/redoc/issues/1753)) ([bccd213](https://github.com/Redocly/redoc/commit/bccd21394ef79940c2efbe24a0d866c7af103d94))
* The number of items in the array in the array is incorrect [#1762](https://github.com/Redocly/redoc/issues/1762) ([#1763](https://github.com/Redocly/redoc/issues/1763)) ([3b8d644](https://github.com/Redocly/redoc/commit/3b8d6441bd9978b849a53021d40fd4fe150272ea))


### Features

* add q/kdb+ syntax highlighting ([#1605](https://github.com/Redocly/redoc/issues/1605)) ([43451ba](https://github.com/Redocly/redoc/commit/43451ba4cd24270b8629a967d3fd2ce2eed8912e))
* new option generatedPayloadSamplesMaxDepth ([#1642](https://github.com/Redocly/redoc/issues/1642)) ([bd9390a](https://github.com/Redocly/redoc/commit/bd9390a5bfc5458c06121110db33968a20fcebe4))



# [2.0.0-rc.56](https://github.com/Redocly/redoc/compare/v2.0.0-rc.53...v2.0.0-rc.56) (2021-08-11)


### Bug Fixes

* handle empty object in security array ([#1678](https://github.com/Redocly/redoc/issues/1678)) ([9e1ea70](https://github.com/Redocly/redoc/commit/9e1ea703e56a71567b13d0d22e2d69945a22de4d))
* hideLoading options in redoc standalone ([#1709](https://github.com/Redocly/redoc/issues/1709)) ([6a52a16](https://github.com/Redocly/redoc/commit/6a52a16d5b75a2955da7217c4a264f0fa8e98c89))
* improve openapi 3.1 ([#1700](https://github.com/Redocly/redoc/issues/1700)) ([cd2d6f7](https://github.com/Redocly/redoc/commit/cd2d6f76e87c8385786a9c8e51c0d11c79d9707c))
  - show contentEncoding on fields
  - crash with OpenAPI 3.1 type as array of strings in requestBody
  - nullable label not shown
* nullable object's fields were missing ([#1721](https://github.com/Redocly/redoc/issues/1721)) ([ddf297b](https://github.com/Redocly/redoc/commit/ddf297b11269ef515bd62771912a5609721d5e39))


### Features

* add github action to build docker images and push to ghcr.io on release ([#1614](https://github.com/Redocly/redoc/issues/1614)) ([919a5f0](https://github.com/Redocly/redoc/commit/919a5f02fb94ca869011d5eaf63ee71b61b60150))
* add yaml highlight ([#1684](https://github.com/Redocly/redoc/issues/1684)) ([d724440](https://github.com/Redocly/redoc/commit/d72444008533623c87f238fe8758b1dd518b89eb))
* added localization for some labels ([#1675](https://github.com/Redocly/redoc/issues/1675)) ([ec50858](https://github.com/Redocly/redoc/commit/ec50858ec47af08c5fe553266fe3c209fba97eae))


# [2.0.0-rc.55](https://github.com/Redocly/redoc/compare/v2.0.0-rc.54...v2.0.0-rc.55) (2021-07-01)


### Bug Fixes

* broken linkify ([3df72fb](https://github.com/Redocly/redoc/commit/3df72fb99ff24fb9a551565b7568d96f8614ed6f)), closes [#1655](https://github.com/Redocly/redoc/issues/1655)
* fix accidentally removed onLoaded ([b41a8b4](https://github.com/Redocly/redoc/commit/b41a8b4ac714084dc25de7914fa1f99386e907e2)), closes [#1656](https://github.com/Redocly/redoc/issues/1656)


### Features

* added git folder sync config ([a69f0fb](https://github.com/Redocly/redoc/commit/a69f0fb00986a04c812ab273711e8f3501b98139))



# [2.0.0-rc.54](https://github.com/Redocly/redoc/compare/v2.0.0-rc.53...v2.0.0-rc.54) (2021-06-09)


### Bug Fixes

* added missing semicolon to styling ([#1578](https://github.com/Redocly/redoc/issues/1578)) ([dfc4cf1](https://github.com/Redocly/redoc/commit/dfc4cf1caa131aa7bc6da6d489e3a8425d800326))
* parse json theme string for standalone tag ([#1492](https://github.com/Redocly/redoc/issues/1492)) ([d7a0a4d](https://github.com/Redocly/redoc/commit/d7a0a4da17241dd9c089202dba76a8312248616e))
* right absolute path for load and bundle definition ([#1579](https://github.com/Redocly/redoc/issues/1579)) ([ab2d57a](https://github.com/Redocly/redoc/commit/ab2d57a5a2ac5df007d76be0d664f3fb5f909566))
* use operation path if operation summary/description is not provided ([#1596](https://github.com/Redocly/redoc/issues/1596)) ([4b072be](https://github.com/Redocly/redoc/commit/4b072be8d1c0dc4f1fa627168eebaed0a0213e08)), closes [#1270](https://github.com/Redocly/redoc/issues/1270)


### Features

* add basic support OpenAPI 3.1 ([#1622](https://github.com/Redocly/redoc/issues/1622)) ([823be24](https://github.com/Redocly/redoc/commit/823be24b313c3a2445df7e0801a0cc79c20bacd1))
* merge refs oas 3.1 ([#1640](https://github.com/Redocly/redoc/issues/1640)) ([f4ea368](https://github.com/Redocly/redoc/commit/f4ea368f78a693fd70d48b5e0e5ffce3560432f4))



# [2.0.0-rc.51](https://github.com/Redocly/redoc/compare/v2.0.0-rc.50...v2.0.0-rc.51) (2021-04-08)

### Bug Fixes

* use openapi-core to bundle definition instead of json-schema-ref-parser ([5033946](https://github.com/Redocly/redoc/commit/503394655da2aac544e278796098cba93d9194b9)),
closes: [#1506](https://github.com/Redocly/redoc/issues/1506), [#1478](https://github.com/Redocly/redoc/issues/1478)
* add disable-google-font parameter to serve command in cli ([c7bbef5](https://github.com/Redocly/redoc/commit/c7bbef515524095e957729eac35a5b7a97619b55)), closes [#1501](https://github.com/Redocly/redoc/issues/1501)



# [2.0.0-rc.50](https://github.com/Redocly/redoc/compare/v2.0.0-rc.49...v2.0.0-rc.50) (2021-02-15)


### Bug Fixes

* add includes polyfill ([3ba622f](https://github.com/Redocly/redoc/commit/3ba622f3ab9e28c954fe05f42e7b90862fc3d544)), closes [#1530](https://github.com/Redocly/redoc/issues/1530)
* background-color in search results ([#1531](https://github.com/Redocly/redoc/issues/1531)) ([d288165](https://github.com/Redocly/redoc/commit/d288165a4ea04aedc23dba12020a73e86f20755b))
* false-positive recursive tag case when using oneOf + allOf ([#1534](https://github.com/Redocly/redoc/issues/1534)) ([8270481](https://github.com/Redocly/redoc/commit/8270481e9f0f381b392f7921d21cb06e0e673b6d))



# [2.0.0-rc.49](https://github.com/Redocly/redoc/compare/v2.0.0-rc.48...v2.0.0-rc.49) (2021-01-30)


### Bug Fixes

* crash on multiple examples on parameter object ([0dce880](https://github.com/Redocly/redoc/commit/0dce880dce1e489c7e8963e352d97603262f4b86)), closes [#1485](https://github.com/Redocly/redoc/issues/1485)
* fix SourceCodeWithCopy component to be non-pure ([040ce72](https://github.com/Redocly/redoc/commit/040ce72a8ae0c1ca7504e10e44d0b2ac7ba04977))
* pass boolean and number values as a string in highlight function ([#1512](https://github.com/Redocly/redoc/issues/1512)) ([c874a59](https://github.com/Redocly/redoc/commit/c874a5942c3bf9f6a2dc5909e31d57925d40aa86))



# [2.0.0-rc.48](https://github.com/Redocly/redoc/compare/v2.0.0-rc.47...v2.0.0-rc.48) (2020-11-30)


### Bug Fixes

* add missed labels to elements ([#1445](https://github.com/Redocly/redoc/issues/1445)) ([8c559bc](https://github.com/Redocly/redoc/commit/8c559bcbcde39efee7f1570b88840468bfdfb17c))


### Features

* add new option hideSchemaPattern ([#1475](https://github.com/Redocly/redoc/issues/1475)) ([bb4594e](https://github.com/Redocly/redoc/commit/bb4594ee58d89819c975bdb575083c0667e3d940))
* support multiple examples for parameters ([#1470](https://github.com/Redocly/redoc/issues/1470)) ([d12e410](https://github.com/Redocly/redoc/commit/d12e410d99a988948b359093159df79572bc78ab))



# [2.0.0-rc.46](https://github.com/Redocly/redoc/compare/v2.0.0-rc.45...v2.0.0-rc.46) (2020-11-05)


### Bug Fixes

* fix arrow color in responses ([#1452](https://github.com/Redocly/redoc/issues/1452)) ([6bedcf9](https://github.com/Redocly/redoc/commit/6bedcf94b26d820101ab510b28d2b76a38999eea))
* remove duplicated slash if hideHostname option enabled ([#1448](https://github.com/Redocly/redoc/issues/1448)) ([4729fc3](https://github.com/Redocly/redoc/commit/4729fc3d8fc83f4af087cd7932adf500b45bab4e))
* use shrinkwrap for cli package ([#1446](https://github.com/Redocly/redoc/issues/1446)) ([4567534](https://github.com/Redocly/redoc/commit/4567534cbb26f13a72a64d49faca64fc992d6dd8))


### Features

* add tabTextColor option for responses ([#1451](https://github.com/Redocly/redoc/issues/1451)) ([702fea0](https://github.com/Redocly/redoc/commit/702fea0f410499101efc554983c6db58acc84889))



# [2.0.0-rc.45](https://github.com/Redocly/redoc/compare/v2.0.0-rc.43...v2.0.0-rc.45) (2020-10-27)


### Bug Fixes

* fix the name of OpenID Connect security scheme ([#1425](https://github.com/Redocly/redoc/issues/1425)) ([c11f679](https://github.com/Redocly/redoc/commit/c11f679f82586a96225488c8a96d0c908bfd2e09))
* increase colors contrast to make them more accessible ([#1433](https://github.com/Redocly/redoc/issues/1433)) ([e2de5b0](https://github.com/Redocly/redoc/commit/e2de5b065eabd00d301ea61106ddafc65bd83afa))


### Features

* add field constraint indicator for uniqueItems ([#1423](https://github.com/Redocly/redoc/issues/1423)) ([c0ae9de](https://github.com/Redocly/redoc/commit/c0ae9de60758aa7561ce8a04b6e0060d0bc4a258)), closes [#1353](https://github.com/Redocly/redoc/issues/1353)
* new extensions hook PropertyDetailsCell + wrap property name into span ([0703f73](https://github.com/Redocly/redoc/commit/0703f73f79a1cabafdc1a908ebb0c5ab142ca825))



# [2.0.0-rc.44](https://github.com/Redocly/redoc/compare/v2.0.0-rc.43...v2.0.0-rc.44) (2020-10-16)


### Features

* new extensions hook PropertyDetailsCell + wrap property name into span ([0fae030](https://github.com/Redocly/redoc/commit/0fae03099645bd9d3795709175640583b08dfc3d))



# [2.0.0-rc.43](https://github.com/Redocly/redoc/compare/v2.0.0-rc.42...v2.0.0-rc.43) (2020-10-13)


### Bug Fixes

* fix broken observable after mobx upgrade ([#1415](https://github.com/Redocly/redoc/issues/1415)) ([26c407b](https://github.com/Redocly/redoc/commit/26c407bd0f2bc1ec9881e0a3668e09e645fc0cc0))



# [2.0.0-rc.42](https://github.com/Redocly/redoc/compare/v2.0.0-rc.41...v2.0.0-rc.42) (2020-10-13)


### Bug Fixes

* hide dropdown input on IE 11 ([#1403](https://github.com/Redocly/redoc/issues/1403)) ([6632d84](https://github.com/Redocly/redoc/commit/6632d844536532227cb92290f9fc2b6b2f913270))
* make samples accessible by keyboard ([#1401](https://github.com/Redocly/redoc/issues/1401)) ([146b38c](https://github.com/Redocly/redoc/commit/146b38c9d0b926765d8e00dd37204c30bf3ac4e0))
* make schema layout more responsive on small screen ([#1411](https://github.com/Redocly/redoc/issues/1411)) ([84ab95d](https://github.com/Redocly/redoc/commit/84ab95ddc7b5dc159098aecf82ad922ffd4a3093))



# [2.0.0-rc.41](https://github.com/Redocly/redoc/compare/v2.0.0-rc.40...v2.0.0-rc.41) (2020-09-24)


### Bug Fixes

* display response code at the top after adding a line break ([#1374](https://github.com/Redocly/redoc/issues/1374)) ([c801b87](https://github.com/Redocly/redoc/commit/c801b87d2aea5e17d35093e2548e1f51f42b1ee3))
* fix displaying response title ([#1376](https://github.com/Redocly/redoc/issues/1376)) ([f3e8ab4](https://github.com/Redocly/redoc/commit/f3e8ab4f8e5522c9ea1ddedb143e23c7d62f5807))
* fix displaying top-level object without any properties ([a5468fb](https://github.com/Redocly/redoc/commit/a5468fb7bb99fcfe33724af939b1a589c1219052))
* show long pattern and add toggle button ([#1375](https://github.com/Redocly/redoc/issues/1375)) ([a6b41aa](https://github.com/Redocly/redoc/commit/a6b41aa00b7592512fdaa7532d9f5d85238db29b))


### Features

* load external search index ([346b10f](https://github.com/Redocly/redoc/commit/346b10f1739d6b44066bdf1f6aac39d5ee3567d2))
* support for ignoring specified named schemas ([9730c4e](https://github.com/Redocly/redoc/commit/9730c4ee1c274c5775966959b69c209c40034b11))



# [2.0.0-rc.40](https://github.com/Redocly/redoc/compare/v2.0.0-rc.39...v2.0.0-rc.40) (2020-08-24)


### Bug Fixes

* invalid discriminator dropdown behaviour with enum ([be07197](https://github.com/Redocly/redoc/commit/be07197e6d1e85a3fd3e61189a36b288751c077d))



# [2.0.0-rc.39](https://github.com/Redocly/redoc/compare/v2.0.0-rc.38...v2.0.0-rc.39) (2020-08-22)


### Bug Fixes

* fix broken dropdowns with SSR by using forked react-dropdown-aria ([c322639](https://github.com/Redocly/redoc/commit/c322639f7c3e7efbbd623ae83afb88faa91d9e67))
* make callbacks expandable by keyboard ([#1354](https://github.com/Redocly/redoc/issues/1354)) ([46eee7b](https://github.com/Redocly/redoc/commit/46eee7b70c8ee9da0d8857a823c4df39a5f18b53))



# [2.0.0-rc.38](https://github.com/Redocly/redoc/compare/v2.0.0-rc.37...v2.0.0-rc.38) (2020-08-20)


### Bug Fixes

* do not crash for invalid parameter.in value ([addf895](https://github.com/Redocly/redoc/commit/addf8956e33654a1586a8ac6ed7325519cd99da8)), closes [#1340](https://github.com/Redocly/redoc/issues/1340)
* scale sideMenu labels according to computed font size ([#1356](https://github.com/Redocly/redoc/issues/1356)) ([fed9a06](https://github.com/Redocly/redoc/commit/fed9a061d59592ec17cedbe4fd392e1f74c21527))



# [2.0.0-rc.37](https://github.com/Redocly/redoc/compare/v2.0.0-rc.36...v2.0.0-rc.37) (2020-08-14)


### Features

* add webhooks support ([#1304](https://github.com/Redocly/redoc/issues/1304)) ([41f81b4](https://github.com/Redocly/redoc/commit/41f81b4d96648fec6bf0c39799c0aa2dded48749))



# [2.0.0-rc.36](https://github.com/Redocly/redoc/compare/v2.0.0-rc.35...v2.0.0-rc.36) (2020-08-04)


### Bug Fixes

* highlight json keys using different color ([#1287](https://github.com/Redocly/redoc/issues/1287)) ([c9596d4](https://github.com/Redocly/redoc/commit/c9596d4b6cd9dced9fdee77525e0da90960c562a))
* make elements accessible by keyboard navigation tools ([#1339](https://github.com/Redocly/redoc/issues/1339)) ([2ce7189](https://github.com/Redocly/redoc/commit/2ce71895bc14f9189b4e6cbdb6d838898717823f))


### Features

* new option simpleOneOfTypeLabel ([7af2efe](https://github.com/Redocly/redoc/commit/7af2efe731cdb16ebe5de6cb3e96f80cceb7d98d))



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
