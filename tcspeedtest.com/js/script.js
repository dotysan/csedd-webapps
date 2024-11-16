	
// detect device to ensure test is performed on a laptop or desktop device
document.addEventListener('DOMContentLoaded', function() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(userAgent);
    if (isMobile) {
        document.getElementById('mobileAlert').style.display = 'block';
        document.getElementById('addressConfirmation').style.display = 'block';
    }
});

document.getElementById('goSearchBtn').addEventListener('click', function() {
    const goSearchHide = document.getElementById('goSearchBtn');
    goSearchHide.style.display = 'none';
    const speedTestRun = document.getElementById('goSearch');
    speedTestRun.style.display = 'block';
    speedTestRun.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
    
document.getElementById('dataPolicyConsent').addEventListener('click', function() {
    const speedTestRun = document.getElementById('speedTestRun');
    speedTestRun.style.display = 'block';
    speedTestRun.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Provide contextual information to the user based on setup form inputs

const messages = {
    Mobile: "Only laptop and desktop computers can be used. Please change to a different device and update your selection.",
    WiFi: "Please move close to your wireless router to get the most accurate result.",
    Yes: "A Virtual Private Network (VPN) is usually a paid subscription not included in your internet bill. It disguises your IP address and invalidates the test. Please turn off your VPN and and update your selection."
};
    
const changeTracker = {
    device: false,
    wifi: false,
    VPN: false
};

document.getElementById('selectContainer').addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
        const selectedValue = event.target.value;
        const message = messages[selectedValue] || "";
        document.getElementById('selectMessage').textContent = message;
        console.log('Changed:', event.target.id, 'Value:', event.target.value, 'Message:', message);

        // Validate and track the change if it's acceptable
        if ((event.target.id === 'device' && selectedValue !== 'Mobile') ||
            (event.target.id === 'VPN' && selectedValue !== 'Yes') ||
            event.target.id === 'wifi') {
            changeTracker[event.target.id] = true;

            // Check if all selects have been changed
            if (Object.values(changeTracker).every(value => value)) {
                addSubmitButton();
            }
        }
    }
});

function addSubmitButton() {
    const buttonContainer = document.getElementById('setupConfirmation');
    if (!buttonContainer.querySelector('button')) {
        const button = document.createElement('button');
        button.textContent = "Let’s test!";
        button.id = 'setupComplete';
        buttonContainer.appendChild(button);

        // Add event listener to the newly created button
        button.addEventListener('click', function() {
            const runSpeedTestDiv = document.getElementById('runSpeedTest');
            runSpeedTestDiv.style.display = 'block';
            runSpeedTestDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fetchIP();
            //startNDT7Test();
        });

        // Scroll to the newly created button
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// code to search existing availibility data

document.addEventListener('DOMContentLoaded', () =>
{
    let csvDataArray = [];
    const fccdataurl = '../data/Tuco_FCC_avail_12312024.csv'; // Define your URL here

    // Fetch the CSV file from the server
    fetch(fccdataurl)
        .then(response => response.text())
        .then(data =>
        {
            processCSVDataAndLogFirstRow(data);
            console.log('CSV data successfully loaded');
            console.log('First row of data:', csvDataArray[0]); // Log the first row of data
        })
        .catch(error => console.error('Error fetching the CSV file:', error));

    function processCSVDataAndLogFirstRow(csvData)
    {
        const lines = csvData.split('\n');
        for (let i = 1; i < lines.length; i++)
        { // Start from 1 to skip header
            const row = lines[i].split(',');
            if (row.length >= 7)
            { // Ensure the row has at least 7 columns
                csvDataArray.push(row);
            }
        }
    
    }

    function showAddressSuggestions()
    {
        console.log('showAddressSuggestions called'); // Log when function is called
        const addressInput = document.getElementById('addressInput').value.trim().toLowerCase();
        console.log('User input:', addressInput); // Log user input
        const suggestionsDiv = document.getElementById('suggestions');
        suggestionsDiv.innerHTML = '';

        if (addressInput.length === 0)
        {
            console.log('No input provided.'); // Log when input is empty
            return
        }

        const matchingAddresses = csvDataArray.filter(row => row[6] && row[6].trim().toLowerCase().includes(addressInput));
        //console.log('Matching addresses:', matchingAddresses); // Log matching addresses

        matchingAddresses.forEach(row =>
        {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = row[6].trim(); // address_full is in the seventh column
            suggestionItem.onclick = () =>
            {
                document.getElementById('addressInput').value = row[6].trim();
                suggestionsDiv.innerHTML = '';
                displayAddressResult(row);
            };
            suggestionsDiv.appendChild(suggestionItem);
        });
    }

    /*
    function searchForAddress()
    {
        const address = document.getElementById('addressInput').value.trim();
        console.log('Searching for address:', address); // Log the address being searched
        const messageDiv = document.getElementById('message');

        if (csvDataArray.length === 0)
        {
            messageDiv.innerHTML = 'Address data not loaded yet.';
            console.log('CSV data not loaded.'); // Log when CSV data is not loaded
            return;
        }

        let found = false;
        for (let i = 0; i < csvDataArray.length; i++)
        {
            const row = csvDataArray[i];
            if (row[6] && row[6].trim() === address)
            { // Assuming the address is in the seventh column
                found = true;
                displayAddressResult(row);
                break;
            }
        }

        if (!found)
        {
            messageDiv.innerHTML = 'Address not found.';
            console.log('Address not found:', address); // Log when address is not found
        }
    }
    */

    function displayAddressResult(row)
    {
        const messageDiv = document.getElementById('message');
        const messageDiv2 = document.getElementById('message2');
        const maxDn = row[1] ? parseFloat(row[1].trim()) : 0; // Max_dn is in the second column
        const ispMaxDn = row[2] ? row[2].trim() : ''; // ISP_Max_dn is in the third column (text)
        const maxUp = row[3] ? row[3].trim() : ''; // Max_up is in the fourth column (text)
        const ispMaxUp = row[4] ? row[4].trim() : ''; // ISP_Max_up is in the fifth column (text)
        const beadStatus = row[5] ? row[5].trim() : ''; // BEAD_status is in the sixth  column (text)

        let statusMessage = 'The BEAD program lists this address as '+beadStatus+'.';

        if (beadStatus === 'unserved')
        {
            messageDiv.innerHTML = `<strong>${statusMessage}</strong><br>
                This location is already elligible for funding and you don't need to do anything else.
                If you would still like to test your speed, please use a commercial service such as
                <a href="https://www.speedtest.net/">speedtest.net</a>. Thanks for checking!
            `;
            messageDiv2.innerHTML = `${beadStatus} ${ispMaxDn} at ${maxDn} Mbps and ${ispMaxUp} at ${maxUp} Mbps`;
            const consent = document.getElementById('speedTestConsent');
            consent.style.display = 'block';
            document.getElementById('consentMessage').style.display = 'none';
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (beadStatus === 'underserved')
        {
            messageDiv.innerHTML = `<strong>${statusMessage}</strong><br>
                You should take a speed test.
                While your location is already eligible for funding, locations with lower speeds will get funding first.
                Taking the test could make your location a higher priority.
            `;
            messageDiv2.innerHTML = `${beadStatus} ${ispMaxDn} at ${maxDn} Mbps and ${ispMaxUp} at ${maxUp} Mbps`;
            const consent = document.getElementById('speedTestConsent');
            consent.style.display = 'block';
            document.getElementById('consentMessage').style.display = 'block';
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (beadStatus === 'served' && ispMaxDn === '') 
        {
            messageDiv.innerHTML = `<strong>${statusMessage} </strong><br>
                While no qualifying ISP serves your location, there may be a grant in place to provide future service.
                Unfortunatly, that means we cannot submit a speed test on your behalf.
                We are confirming if any grants are are active so there is no need to take a speed test.
                If you would still like to test your speed, please use a commercial service such as
                <a href="https://www.speedtest.net/"> speedtest.net</a>. Thanks for checking!
            `;
            messageDiv2.innerHTML = `${beadStatus} ${ispMaxDn} at ${maxDn} Mbps and ${ispMaxUp} at ${maxUp} Mbps`;
            const consent = document.getElementById('speedTestConsent');
            consent.style.display = 'block';
            document.getElementById('consentMessage').style.display = 'none';
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else if (beadStatus === 'served' && maxDn <= 100) 
        {
            messageDiv.innerHTML = `<strong>${statusMessage} </strong><br>
                ${ispMaxDn} claims the fastest download speed of <strong>${maxDn} Mbps</strong> and
                ${ispMaxUp} claims the fastest upload speed of <strong>${maxUp} Mbps</strong><br><br>
                <strong>You should take a speed test.</strong>
                Even though this address is listed as served, your service may not meet advertized speeds.
                Proving that information could change the status to unserved and make it elligible for funding.
                Additionally, there may be a grant in place to provide better service.
                We are working to confirm that any active grants are being executed.
            `;
            messageDiv2.innerHTML = `${beadStatus} ${ispMaxDn} at ${maxDn} Mbps and ${ispMaxUp} at ${maxUp} Mbps`;
            const consent = document.getElementById('speedTestConsent');
            consent.style.display = 'block';
            document.getElementById('consentMessage').style.display = 'block';
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        else 
        {
            messageDiv.innerHTML = `<strong>${statusMessage} </strong><br>
                ${ispMaxDn} claims the fastest download speed of <strong>${maxDn} Mbps</strong> and
                ${ispMaxUp} claims the fastest upload speed of <strong>${maxUp} Mbps</strong><br>
                <strong> You may want to take a speed test.</strong>
                If your service does not meet advertised speeds, we may be able to change the status to unserved or underserved and make it elligible for funding.
            `;
            messageDiv2.innerHTML = `${beadStatus} ${ispMaxDn} at ${maxDn} Mbps and ${ispMaxUp} at ${maxUp} Mbps`;
            const consent = document.getElementById('speedTestConsent');
            consent.style.display = 'block';
            document.getElementById('consentMessage').style.display = 'block';
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        console.log('Displayed result for row:', row); // Log the row data being displayed
    }

    // Add event listener for keyup to show suggestions
    document.getElementById('addressInput').addEventListener('keyup', showAddressSuggestions);
});


// Start of M-Lab  speed test code

// document.getElementById('setupConfirmation').addEventListener('click', function() {startNDT7Test()});

function startNDT7Test() {
    ndt7.test({
        userAcceptedDataPolicy: true,
        downloadworkerfile: "../ndt7-js/src/ndt7-download-worker.js",
        uploadworkerfile: "../ndt7-js/src/ndt7-upload-worker.js",
        metadata: {
            client_name: 'ndt7-html-example',
        },
    }, {
        serverChosen: function (server) {
            console.log('Testing server:', {
                machine: server.machine,
                locations: server.location,
            });
            document.getElementById('server').innerHTML = 'Testing server: ' + server.machine + ' (' + server.location.city + ')';
        },
        downloadMeasurement: function (data) {
            if (data.Source === 'client') {
                document.getElementById('download').innerHTML = 'Download: ' + data.Data.MeanClientMbps.toFixed(2) + ' Mbps';
            }
        },
        downloadComplete: function (data) {
            const serverBw = data.LastServerMeasurement.BBRInfo.BW * 8 / 1000000;
            const clientGoodput = data.LastClientMeasurement.MeanClientMbps;
            console.log(
                `Download test is complete:
                Instantaneous server bottleneck bandwidth estimate: ${serverBw} Mbps
                Mean client goodput: ${clientGoodput} Mbps`);
            document.getElementById('download').innerHTML = 'Download: ' + clientGoodput.toFixed(2) + ' Mbps';
        },
        uploadMeasurement: function (data) {
            if (data.Source === 'server') {
                document.getElementById('upload').innerHTML = 'Upload: ' + (data.Data.TCPInfo.BytesReceived /
                    data.Data.TCPInfo.ElapsedTime * 8).toFixed(2) + ' Mbps';;
            }
        },
        uploadComplete: function(data) {
            const bytesReceived = data.LastServerMeasurement.TCPInfo.BytesReceived;
            const elapsed = data.LastServerMeasurement.TCPInfo.ElapsedTime;
            const throughput =
            bytesReceived * 8 / elapsed;
            console.log(
                `Upload test completed in ${(elapsed / 1000000).toFixed(2)}s
                Mean server throughput: ${throughput} Mbps`);
            checkElementsAndNotify(); 
        },
        error: function (err) {
            console.log('Error while running the test:', err.message);
    
        },
    }).then((exitcode) => {
        console.log("ndt7 test completed with exit code:", exitcode);
    });
}
    
function checkElementsAndNotify() {
    const downloadText = document.getElementById('download').innerText;
    const uploadText = document.getElementById('upload').innerText;

    // Extract numerical values from the text
    const downloadSpeed = parseFloat(downloadText.match(/(\d+(\.\d+)?)/)[0]);
    const uploadSpeed = parseFloat(uploadText.match(/(\d+(\.\d+)?)/)[0]);

    // Get or create a container for the messages
    let messageContainer = document.getElementById('resultMessage');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'resultMessage';
        document.body.appendChild(messageContainer);  // Append to the body or another specific part of your page
    }

    // Clear previous messages
    messageContainer.innerHTML = '';

    // Create and append new message elements
    const p1 = document.createElement('p');
    p1.textContent = "Your internet connection qualifies as";
    p1.className = 'status-intro';
    messageContainer.appendChild(p1);
    
    const p2 = document.createElement('p');
    p2.className = 'connection-status';
    if (downloadSpeed < 25 || uploadSpeed < 3) {
        p2.textContent = "unserved";
    } else if (downloadSpeed < 100 || uploadSpeed < 20) {
        p2.textContent = "underserved";
    } else if (downloadSpeed >= 100 && uploadSpeed >= 20) {
        p2.textContent = "fully served";
    } else {
        p2.textContent = "in a state requiring further evaluation";  // This is a fallback, potentially unnecessary
    }
    messageContainer.appendChild(p2);

    // Create a paragraph for submission instructions and a button to submit results
    const p3 = document.createElement('p');
    p3.className = 'submission-instruction';
    p3.textContent = "If you are not fully served or believe that your test results are not accurate, you can click the button below to submit your results.";
    messageContainer.appendChild(p3);

    // Add a button to submit results
    const submitButton = document.createElement('button');
    submitButton.textContent = "Submit your results";
    submitButton.onclick = function() {
        // Define what happens when the button is clicked
        redirectToAirtableURL();
        console.log("Submit button clicked");  // Replace this with actual submission logic
    };

    // add the test time to the page
    document.getElementById('timestamp').textContent = new Date().toString()

    messageContainer.appendChild(submitButton);

    // Scroll to the message and button
    p3.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function redirectToAirtableURL() {
    // Fetch values directly from elements
    const address = document.getElementById('addressInput').value;
    const device = document.getElementById('device').value;
    const message = encodeURIComponent(document.getElementById('message2').textContent);
    const vpn = document.getElementById('VPN').value;  // Assuming it's a checkbox
    const wifi = document.getElementById('wifi').value;
    const ip = document.getElementById('ipDisplay').innerText.replace('Your public IP: ', '')
    const ATdownloadSpeed = document.getElementById('download').innerText.replace('Download: ', '').replace(' Mbps', ''); // Cleaning up unit if present
    const ATuploadSpeed = document.getElementById('upload').innerText.replace('Upload: ', '').replace(' Mbps', '');  // Cleaning up unit if present
    const timestamp = encodeURIComponent(document.getElementById('timestamp').textContent);

    // Construct the URL using simple concatenation
    const completeURL = "https://airtable.com/appyonQGRjvBBT7NO/shrIhXRduXuow8fwR?"+
    "prefill_Device="+device+               // Laptop, Desktop
    "&prefill_IP="+ip+                      // string
    "&prefill_Upload="+ATuploadSpeed+       // number
    "&prefill_Download="+ATdownloadSpeed+   // number
    "&prefill_Address="+address+            // text
    "&prefill_Consent=true"+                // true, false
    "&prefill_VPN="+vpn+                    // Yes, No
    "&prefill_Network="+wifi+               // WiFi, Hardwired
        "&prefill_SearchMsg="+message+          // Test result message
        "&prefill_TestDateTime="+timestamp+     // Test timestamp

    "&hide_TestDateTime=true"+
        "&hide_SearchMsg=true"+
    "&hide_Device=true"+
    "&hide_IP=true"+
    "&hide_Upload=true"+
    "&hide_Download=true"+
    "&hide_Address=true"+
    "&hide_Consent=true"+
    "&hide_VPN=true"+
    "&hide_Network=true";

    // Redirect the user to the constructed URL
    window.location.href = completeURL;
}

// Setup event listener for a button click to initiate the redirection
// document.getElementById('submitButton').addEventListener('click', redirectToCustomURL);

function fetchIP() {
    document.getElementById('ipDisplay').innerText = "Fetching your IP address. This may take a moment...";
    fetch('https://api.ipify.org?format=json') // use https://api64.ipify.org for IPv6
    .then(response => response.json())
    .then(data => {
        document.getElementById('ipDisplay').innerText = "Your public IP: "+ data.ip;
    startNDT7Test();
    })
    .catch(error => {
        console.error('Error fetching IP:', error);
        document.getElementById('ipDisplay').innerText = 'Error fetching IP.';
    startNDT7Test();
    });
}
