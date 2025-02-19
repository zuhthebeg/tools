document.addEventListener('DOMContentLoaded', function() {
    fetchIPInfo(); // Show the user's IP on page load
});

function fetchIPInfo() {
    const ipInput = document.getElementById('ipInput');
    const ip = ipInput.value || 'myip'; // If no IP entered, fetch the user's IP
    const url = `https://ipapi.co/${ip}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('ipResult');
            if (data.error) {
                resultDiv.innerHTML = `<pre>Error: ${data.reason}</pre>`;
            } else {
                resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }
        })
        .catch(error => {
            document.getElementById('ipResult').innerHTML = `<pre>An error occurred: ${error.message}</pre>`;
        });
}

async function lookup() {
    const domain = document.getElementById("domain").value;
    const resultDiv = document.getElementById("domainResult");

    if (!domain) {
        resultDiv.innerHTML = "<pre>Please enter a domain name.</pre>";
        return;
    }

    resultDiv.innerHTML = "<pre>Looking up...</pre>";
    try {
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
            headers: { "Accept": "application/dns-json" }
        });
        const data = await response.json();

        if (data.Answer) {
            resultDiv.innerHTML = `<pre>${data.Answer.map(record => `${record.name} -> <a onclick="pasteIP('${record.data}')">${record.data}</a>`).join('\n')}</pre>`;
        } else {
            resultDiv.innerHTML = "<pre>No DNS records found.</pre>";
        }
    } catch (error) {
        resultDiv.innerHTML = "<pre>Error fetching DNS records.</pre>";
    }
}

function pasteIP(ip) {
    document.getElementById('ipInput').value = ip;
}