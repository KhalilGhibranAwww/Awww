import requests
import os
import subprocess
import random
import re
import threading
import urllib.request
import argparse
import sys
from colorama import Fore, Back, Style, init
from time import time

init(autoreset=True)

output_file = 'proxy.txt'
os.system('cls' if os.name == 'nt' else 'clear')

if os.path.isfile(output_file):
    os.remove(output_file)
    print(f"""
                    █░░ █ █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
                    █▄▄ █ ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄    
             ╚╦═════════════════════════════════════════════╦╝
           ╔══╩═════════════════════════════════════════════╩═══╗
            LIService Panel DDoS | Development By t.me/LIService 
           ╚══╦══════════════════════════════════════════════╦══╝
              ╚══════════════════════════════════════════════╝
              
""")


proxy_urls = [
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
    'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/proxylist-to/proxy-list/main/http.txt',
    'https://raw.githubusercontent.com/yuceltoluyag/GoodProxy/main/raw.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
    'https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/http_proxies.txt',
    'https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt',
    'https://raw.githubusercontent.com/Anonym0usWork1221/Free-Proxies/main/proxy_files/https_proxies.txt',
    'https://api.openproxylist.xyz/http.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies',
    'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
    'https://www.proxydocker.com/en/proxylist/download?email=noshare&country=all&city=all&port=all&type=all&anonymity=all&state=all&need=all',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous',
    'http://worm.rip/http.txt',
    'https://proxyspace.pro/http.txt',
    'https://multiproxy.org/txt_all/proxy.txt',
    'https://proxy-spider.com/api/proxies.example.txt',
    'https://sunny9577.github.io/proxy-scraper/proxies.txt',
    'https://sunny9577.github.io/proxy-scraper/generated/http_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt',
    'https://www.proxy-list.download/api/v1/get?type=http',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks4_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks4.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks4',
    'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=5000&country=all&ssl=all&anonymity=all',
    'https://sunny9577.github.io/proxy-scraper/generated/socks5_proxies.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
    'https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt',
    'https://www.proxy-list.download/api/v1/get?type=socks',
    'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt',
    'https://raw.githubusercontent.com/mallisc5/master/proxy-list-raw.txt',
    'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt',
    'https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/free.txt',
    'https://raw.githubusercontent.com/HyperBeats/proxy-list/main/https.txt',
    'https://raw.githubusercontent.com/UptimerBot/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/caliphdev/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/https.txt',
    'https://raw.githubusercontent.com/vakhov/fresh-proxy-list/master/http.txt',
    'https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/protocols/http/data.txt',
    'https://raw.githubusercontent.com/tuanminpay/live-proxy/master/http.txt',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/https',
    'https://raw.githubusercontent.com/casals-ar/proxy-list/main/http',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt',
    'https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt',
    'https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt',
    'http://atomintersoft.com/proxy_list_port_80',
    'http://atomintersoft.com/proxy_list_domain_org',
    'http://atomintersoft.com/proxy_list_port_3128',
    'http://www.cybersyndrome.net/pla5.html',
    'http://alexa.lr2b.com/proxylist.txt',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196258',
    'http://free-ssh.blogspot.com/feeds/posts/default',
    'http://browse.feedreader.com/c/Proxy_Server_List-1/449196259',
    'http://johnstudio0.tripod.com/index1.htm',
    'http://atomintersoft.com/transparent_proxy_list',
    'http://atomintersoft.com/anonymous_proxy_list',
    'http://atomintersoft.com/high_anonymity_elite_proxy_list',
    'http://worm.rip/https.txt',
    'http://rootjazz.com/proxies/proxies.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies.txt',
    'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
    'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt'
];


def download_and_save_proxies(url, output_file):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            with open(output_file, 'a') as file:
                file.write(response.text)
                print(f"Success Gets In {url}")
        else:
            print(f"Well Failed In {url}")
    except Exception as e:
        print(f"Something Broken in {url}")

open(output_file, 'w').close()

class Proxy:
    def __init__(self, method, proxy):
        if method.lower() not in ["http", "https"]:
            raise NotImplementedError("Only HTTP and HTTPS are supported")
        self.method = method.lower()
        self.proxy = proxy

    def is_valid(self):
        return re.match(r"\d{1,3}(?:\.\d{1,3}){3}(?::\d{1,5})?$", self.proxy)

    def check(self, site, timeout, user_agent):
        url = self.method + "://" + self.proxy
        proxy_support = urllib.request.ProxyHandler({self.method: url})
        opener = urllib.request.build_opener(proxy_support)
        urllib.request.install_opener(opener)
        req = urllib.request.Request(self.method + "://" + site)
        req.add_header("User-Agent", user_agent)
        try:
            start_time = time()
            urllib.request.urlopen(req, timeout=timeout)
            end_time = time()
            time_taken = end_time - start_time
            return True, time_taken, None
        except Exception as e:
            return False, 0, e

    def __str__(self):
        return self.proxy

def verbose_print(verbose, message):
    if verbose:
        print(message)

def check(file, timeout, method, site, verbose, random_user_agent):
    proxies = []
    with open(file, "r") as f:
        for line in f:
            proxies.append(Proxy(method, line.replace("\n", "")))

    print(f"Checking {len(proxies)} Proxy")
    proxies = filter(lambda x: x.is_valid(), proxies)
    valid_proxies = []
    user_agent = random.choice(user_agents)

    def check_proxy(proxy, user_agent):
        new_user_agent = user_agent
        if random_user_agent:
            new_user_agent = random.choice(user_agents)
        valid, time_taken, error = proxy.check(site, timeout, new_user_agent)
        message = {
            True: f"{proxy} is valid, took {time_taken} seconds",
            False: f"{proxy} is invalid: {repr(error)}",
        }[valid]
        verbose_print(verbose, message)
        valid_proxies.extend([proxy] if valid else [])

    threads = []
    for proxy in proxies:
        t = threading.Thread(target=check_proxy, args=(proxy, user_agent))
        threads.append(t)

    for t in threads:
        t.start()

    for t in threads:
        t.join()

    with open(file, "w") as f:
        for proxy in valid_proxies:
            f.write(str(proxy) + "\n")

    print(f"Finding {len(valid_proxies)} Valid Proxy")


def verbose_print(verbose, message):
    if verbose:
        print(message)

for url in proxy_urls:
    download_and_save_proxies(url, output_file)
    
with open('proxy.txt', 'r') as ceki:
    jumlh = sum(1 for line in ceki)
    
print(f"Get: {jumlh} Proxy. Do you want to check it out? [Y/N]: ", end="")
choice = input().strip().lower()

if choice == 'y' or choice == 'Y':
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10157) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.48",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.277",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15",
    ]
    
    parser = argparse.ArgumentParser()
    parser.add_argument("-t", "--timeout", type=int, default=20, help="Dismiss the proxy after -t seconds")
    parser.add_argument("-p", "--proxy", default="http", help="Check HTTPS or HTTP proxies")
    parser.add_argument("-s", "--site", default="https://google.com/", help="Check with specific website like google.com")
    parser.add_argument("-v", "--verbose", action="store_true", help="Increase output verbosity")
    parser.add_argument("-r", "--random_agent", action="store_true", help="Use a random user agent per proxy")
    
    args = parser.parse_args()
    check(file=output_file, timeout=args.timeout, method=args.proxy, site=args.site, verbose=args.verbose, random_user_agent=args.random_agent)
    sys.exit(0)
else:
    print(f"Thank you for using my script ~Lintar")
