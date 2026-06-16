import urllib.request
import re
import os
import ssl
import time
import random
from bs4 import BeautifulSoup
import html2text

# Disable SSL verification for compatibility
ssl_context = ssl._create_unverified_context()

BASE_URL = "https://hackviser.com"

# The parsed list of tactics URLs
TACTICS_URLS = [
    # Hardening
    "https://hackviser.com/tactics/hardening/apache",
    "https://hackviser.com/tactics/hardening/arp",
    "https://hackviser.com/tactics/hardening/bind9",
    "https://hackviser.com/tactics/hardening/caddy",
    "https://hackviser.com/tactics/hardening/nginx",
    "https://hackviser.com/tactics/hardening/ntp",
    "https://hackviser.com/tactics/hardening/rdp",
    "https://hackviser.com/tactics/hardening/smb",
    "https://hackviser.com/tactics/hardening/smtp",
    "https://hackviser.com/tactics/hardening/ssh",
    "https://hackviser.com/tactics/hardening/telnet",
    "https://hackviser.com/tactics/hardening/vsftpd",

    # Pentesting Services
    "https://hackviser.com/tactics/pentesting/services/MongoDB",
    "https://hackviser.com/tactics/pentesting/services/activemq",
    "https://hackviser.com/tactics/pentesting/services/ad-cs",
    "https://hackviser.com/tactics/pentesting/services/adb",
    "https://hackviser.com/tactics/pentesting/services/artifact-registry",
    "https://hackviser.com/tactics/pentesting/services/consul",
    "https://hackviser.com/tactics/pentesting/services/dhcp",
    "https://hackviser.com/tactics/pentesting/services/dns",
    "https://hackviser.com/tactics/pentesting/services/docker",
    "https://hackviser.com/tactics/pentesting/services/elasticsearch",
    "https://hackviser.com/tactics/pentesting/services/etcd",
    "https://hackviser.com/tactics/pentesting/services/ftp",
    "https://hackviser.com/tactics/pentesting/services/git-svn",
    "https://hackviser.com/tactics/pentesting/services/grafana",
    "https://hackviser.com/tactics/pentesting/services/grpc",
    "https://hackviser.com/tactics/pentesting/services/http",
    "https://hackviser.com/tactics/pentesting/services/icmp",
    "https://hackviser.com/tactics/pentesting/services/imap",
    "https://hackviser.com/tactics/pentesting/services/ipp-cups-jetdirect",
    "https://hackviser.com/tactics/pentesting/services/irc",
    "https://hackviser.com/tactics/pentesting/services/iscsi",
    "https://hackviser.com/tactics/pentesting/services/java-rmi-jmx-jdwp",
    "https://hackviser.com/tactics/pentesting/services/jenkins",
    "https://hackviser.com/tactics/pentesting/services/kafka",
    "https://hackviser.com/tactics/pentesting/services/kerberos",
    "https://hackviser.com/tactics/pentesting/services/kibana",
    "https://hackviser.com/tactics/pentesting/services/kubernetes",
    "https://hackviser.com/tactics/pentesting/services/ldap",
    "https://hackviser.com/tactics/pentesting/services/llmnr-mdns-nbns",
    "https://hackviser.com/tactics/pentesting/services/lpd",
    "https://hackviser.com/tactics/pentesting/services/memcached",
    "https://hackviser.com/tactics/pentesting/services/minio-s3",
    "https://hackviser.com/tactics/pentesting/services/modbus",
    "https://hackviser.com/tactics/pentesting/services/mqtt",
    "https://hackviser.com/tactics/pentesting/services/msrpc",
    "https://hackviser.com/tactics/pentesting/services/mssql",
    "https://hackviser.com/tactics/pentesting/services/mysql",
    "https://hackviser.com/tactics/pentesting/services/netbios",
    "https://hackviser.com/tactics/pentesting/services/nfs",
    "https://hackviser.com/tactics/pentesting/services/ntp",
    "https://hackviser.com/tactics/pentesting/services/oracle",
    "https://hackviser.com/tactics/pentesting/services/pop3",
    "https://hackviser.com/tactics/pentesting/services/postgresql",
    "https://hackviser.com/tactics/pentesting/services/prometheus",
    "https://hackviser.com/tactics/pentesting/services/rabbitmq",
    "https://hackviser.com/tactics/pentesting/services/radius",
    "https://hackviser.com/tactics/pentesting/services/rdp",
    "https://hackviser.com/tactics/pentesting/services/redis",
    "https://hackviser.com/tactics/pentesting/services/rpcbind",
    "https://hackviser.com/tactics/pentesting/services/rsh",
    "https://hackviser.com/tactics/pentesting/services/rsync",
    "https://hackviser.com/tactics/pentesting/services/rtsp",
    "https://hackviser.com/tactics/pentesting/services/sip-voip",
    "https://hackviser.com/tactics/pentesting/services/smb",
    "https://hackviser.com/tactics/pentesting/services/smtp",
    "https://hackviser.com/tactics/pentesting/services/snmp",
    "https://hackviser.com/tactics/pentesting/services/sonarqube",
    "https://hackviser.com/tactics/pentesting/services/splunkd",
    "https://hackviser.com/tactics/pentesting/services/ssh",
    "https://hackviser.com/tactics/pentesting/services/tacacs",
    "https://hackviser.com/tactics/pentesting/services/telnet",
    "https://hackviser.com/tactics/pentesting/services/tftp",
    "https://hackviser.com/tactics/pentesting/services/tomcat",
    "https://hackviser.com/tactics/pentesting/services/vault",
    "https://hackviser.com/tactics/pentesting/services/vmware",
    "https://hackviser.com/tactics/pentesting/services/vnc",
    "https://hackviser.com/tactics/pentesting/services/vpn-services",
    "https://hackviser.com/tactics/pentesting/services/webdav",
    "https://hackviser.com/tactics/pentesting/services/whois",
    "https://hackviser.com/tactics/pentesting/services/winrm",
    "https://hackviser.com/tactics/pentesting/services/zookeeper",

    # Pentesting Web
    "https://hackviser.com/tactics/pentesting/web/command-injection",
    "https://hackviser.com/tactics/pentesting/web/cors-misconfiguration",
    "https://hackviser.com/tactics/pentesting/web/csrf",
    "https://hackviser.com/tactics/pentesting/web/file-upload",
    "https://hackviser.com/tactics/pentesting/web/idor",
    "https://hackviser.com/tactics/pentesting/web/lfi-rfi",
    "https://hackviser.com/tactics/pentesting/web/open-redirect",
    "https://hackviser.com/tactics/pentesting/web/sql-injection",
    "https://hackviser.com/tactics/pentesting/web/ssrf",
    "https://hackviser.com/tactics/pentesting/web/xss",
    "https://hackviser.com/tactics/pentesting/web/xxe",

    # Tools
    "https://hackviser.com/tactics/tools/aircrack-ng",
    "https://hackviser.com/tactics/tools/amass",
    "https://hackviser.com/tactics/tools/apktool",
    "https://hackviser.com/tactics/tools/assetfinder",
    "https://hackviser.com/tactics/tools/bettercap",
    "https://hackviser.com/tactics/tools/binwalk",
    "https://hackviser.com/tactics/tools/bloodhound-ce",
    "https://hackviser.com/tactics/tools/certipy",
    "https://hackviser.com/tactics/tools/checkov",
    "https://hackviser.com/tactics/tools/crackmapexec",
    "https://hackviser.com/tactics/tools/dalfox",
    "https://hackviser.com/tactics/tools/dig",
    "https://hackviser.com/tactics/tools/enum4linux",
    "https://hackviser.com/tactics/tools/evil-winrm",
    "https://hackviser.com/tactics/tools/feroxbuster",
    "https://hackviser.com/tactics/tools/ffuf",
    "https://hackviser.com/tactics/tools/foremost",
    "https://hackviser.com/tactics/tools/gitleaks",
    "https://hackviser.com/tactics/tools/gobuster",
    "https://hackviser.com/tactics/tools/grype",
    "https://hackviser.com/tactics/tools/hashcat",
    "https://hackviser.com/tactics/tools/httpx",
    "https://hackviser.com/tactics/tools/hydra",
    "https://hackviser.com/tactics/tools/impacket",
    "https://hackviser.com/tactics/tools/jadx",
    "https://hackviser.com/tactics/tools/john-the-ripper",
    "https://hackviser.com/tactics/tools/joomscan",
    "https://hackviser.com/tactics/tools/katana",
    "https://hackviser.com/tactics/tools/kerbrute",
    "https://hackviser.com/tactics/tools/kube-bench",
    "https://hackviser.com/tactics/tools/masscan",
    "https://hackviser.com/tactics/tools/metasploit",
    "https://hackviser.com/tactics/tools/mimikatz",
    "https://hackviser.com/tactics/tools/netcat",
    "https://hackviser.com/tactics/tools/netexec",
    "https://hackviser.com/tactics/tools/nikto",
    "https://hackviser.com/tactics/tools/nmap",
    "https://hackviser.com/tactics/tools/nuclei",
    "https://hackviser.com/tactics/tools/openvas",
    "https://hackviser.com/tactics/tools/owasp-zap",
    "https://hackviser.com/tactics/tools/parth",
    "https://hackviser.com/tactics/tools/prowler",
    "https://hackviser.com/tactics/tools/responder",
    "https://hackviser.com/tactics/tools/rpcclient",
    "https://hackviser.com/tactics/tools/searchsploit",
    "https://hackviser.com/tactics/tools/semgrep",
    "https://hackviser.com/tactics/tools/smbclient",
    "https://hackviser.com/tactics/tools/socat",
    "https://hackviser.com/tactics/tools/sqlmap",
    "https://hackviser.com/tactics/tools/subfinder",
    "https://hackviser.com/tactics/tools/syft",
    "https://hackviser.com/tactics/tools/tcpdump",
    "https://hackviser.com/tactics/tools/the-harvester",
    "https://hackviser.com/tactics/tools/trivy",
    "https://hackviser.com/tactics/tools/trufflehog",
    "https://hackviser.com/tactics/tools/tshark",
    "https://hackviser.com/tactics/tools/wfuzz",
    "https://hackviser.com/tactics/tools/wpcan"
]

OUTPUT_DIR = "/home/void999/Documents/projects/mypf/content/tactics"

def clean_markdown(md, title):
    # Remove Hackviser banner ads & CTA boxes
    md = re.sub(r'Want to Practice These Techniques\?.*?(Start Practicing Now|Register Now)', '', md, flags=re.DOTALL | re.IGNORECASE)
    md = re.sub(r'Try Hackviser\'s interactive cyber security upskilling platform.*', '', md, flags=re.IGNORECASE)
    
    # Generic replacement rules for Hackviser branding to make it independent
    lines = []
    for line in md.split('\n'):
        if 'hackviser.com' in line.lower() or 'hackviser' in line.lower():
            line = re.sub(r'Hackviser Ltd\.', '', line)
            line = re.sub(r'Hackviser\'s', 'our', line, flags=re.IGNORECASE)
            line = re.sub(r'Hackviser', 'the platform', line, flags=re.IGNORECASE)
            if 'hackviser.com' in line.lower():
                continue
        # Strip Docusaurus anchor link tags e.g. [​](#header-id)
        line = re.sub(r'\[\s*​\s*\]\(#[^\)]+\)', '', line)
        line = re.sub(r'\\#', '#', line)
        lines.append(line)
        
    md = '\n'.join(lines)
    
    # Remove duplicate title header at start
    header_pattern = f"^#\\s+{re.escape(title)}\\s*$"
    md_lines = md.split('\n')
    if md_lines and re.match(header_pattern, md_lines[0].strip(), re.IGNORECASE):
        md_lines = md_lines[1:]
        
    return '\n'.join(md_lines).strip()

def scrape_url(url):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req, context=ssl_context) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # Title
    title_tag = soup.find('title')
    title = title_tag.text.split('|')[0].strip() if title_tag else "Unknown"
    
    # Description
    desc_meta = soup.find('meta', attrs={'name': 'description'})
    description = desc_meta['content'].strip() if desc_meta else ""
    
    # Tags
    tags = []
    for link in soup.find_all('a', href=re.compile(r'/tactics/tags/')):
        tag = link.text.strip().lower()
        if tag and tag not in tags:
            tags.append(tag)
            
    # Markdown body
    content_div = soup.find(class_='theme-doc-markdown') or soup.find('article')
    if not content_div:
        return None
        
    # Decompose unwanted sub-elements (banners, breadcrumbs, etc)
    for banner in content_div.find_all(class_=re.compile(r'hackviserBanner')):
        banner.decompose()
    for bc in content_div.find_all(class_=re.compile(r'breadcrumbs')):
        bc.decompose()
        
    h = html2text.HTML2Text()
    h.ignore_links = False
    h.body_width = 0
    h.ignore_emphasis = False
    
    raw_md = h.handle(str(content_div))
    clean_md = clean_markdown(raw_md, title)
    
    return {
        'title': title,
        'description': description,
        'tags': tags,
        'content': clean_md
    }

def main():
    print(f"Starting tactics content scraping of {len(TACTICS_URLS)} urls...")
    
    success_count = 0
    fail_count = 0
    
    for i, url in enumerate(TACTICS_URLS, 1):
        # Determine path category/subcategory/slug from URL
        # e.g., https://hackviser.com/tactics/pentesting/services/ftp -> pentesting, services, ftp
        # e.g., https://hackviser.com/tactics/hardening/apache -> hardening, None, apache
        parts = url.replace(BASE_URL + "/tactics/", "").split("/")
        
        category = parts[0] # hardening, pentesting, tools
        
        if len(parts) == 3:
            subcategory = parts[1] # services, web
            slug = parts[2]
        else:
            subcategory = None
            slug = parts[1]
            
        # Standardize MongoDB to lowercase slug
        if slug == "MongoDB":
            slug = "mongodb"
            
        print(f"[{i}/{len(TACTICS_URLS)}] Processing {category}/{subcategory or ''}/{slug}...")
        
        # Determine write path
        if subcategory:
            dest_dir = os.path.join(OUTPUT_DIR, category, subcategory)
        else:
            dest_dir = os.path.join(OUTPUT_DIR, category)
            
        os.makedirs(dest_dir, exist_ok=True)
        dest_file = os.path.join(dest_dir, f"{slug}.mdx")
        
        # Skip if file already exists with non-trivial size to save bandwidth/time
        if os.path.exists(dest_file) and os.path.getsize(dest_file) > 100:
            print(f"  Already exists, skipping.")
            continue
            
        # Scrape
        data = scrape_url(url)
        if not data:
            fail_count += 1
            time.sleep(1)
            continue
            
        # Write MDX file
        frontmatter = [
            "---",
            f'title: "{data["title"]}"',
            f'description: "{data["description"]}"',
            f'tags: {data["tags"]}',
            "---"
        ]
        
        mdx_content = "\n".join(frontmatter) + "\n\n" + data["content"]
        
        with open(dest_file, "w", encoding="utf-8") as f:
            f.write(mdx_content)
            
        success_count += 1
        print(f"  Scraped successfully. Size: {len(mdx_content)} bytes.")
        
        # Respectful delay between 1 to 2.5 seconds to avoid Cloudflare/rate limits
        time.sleep(random.uniform(1.0, 2.5))
        
    print(f"\nScraping session finished! Success: {success_count}, Failed: {fail_count}")

if __name__ == "__main__":
    main()
