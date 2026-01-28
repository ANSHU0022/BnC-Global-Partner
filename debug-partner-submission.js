// Debug Partner Service Submission
// Add this to your partner-dashboard.html to debug the submission

function debugSubmitInterview() {
    console.log('=== DEBUG: Starting Interview Submission ===');
    
    // Get user data
    const user = partnerAuth.getCurrentUser();
    console.log('User data:', user);
    
    // Get interview data
    console.log('Interview data:', interviewData);
    
    // Prepare submission data
    const submissionData = {
        action: 'submitPartnerService',
        profileId: user.profileId,
        partnerName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        partnerType: interviewData.partnerType,
        services: interviewData.services,
        meetingDate: interviewData.meetingDate,
        meetingTime: interviewData.meetingTime,
        submittedAt: new Date().toISOString()
    };
    
    console.log('Submission data:', submissionData);
    console.log('JSON string:', JSON.stringify(submissionData));
    
    // Test different submission methods
    testSubmissionMethods(submissionData);
}

function testSubmissionMethods(data) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbynHMi1PTiguM3cGpamqC_8eYeNO9Q0HVAxicgFNimtiZWaA14TJuFUtCQQfZLIvFlb/exec';
    
    console.log('=== Testing Method 1: POST with JSON ===');
    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('POST Response status:', response.status);
        console.log('POST Response headers:', response.headers);
        return response.text();
    })
    .then(result => {
        console.log('POST Result:', result);
        try {
            const parsed = JSON.parse(result);
            console.log('POST Parsed result:', parsed);
        } catch (e) {
            console.log('POST Result is not JSON:', result);
        }
    })
    .catch(error => {
        console.error('POST Error:', error);
    });
    
    console.log('=== Testing Method 2: GET with URL params ===');
    const params = new URLSearchParams(data);
    fetch(`${scriptUrl}?${params}`, {
        method: 'GET'
    })
    .then(response => {
        console.log('GET Response status:', response.status);
        return response.text();
    })
    .then(result => {
        console.log('GET Result:', result);
        try {
            const parsed = JSON.parse(result);
            console.log('GET Parsed result:', parsed);
        } catch (e) {
            console.log('GET Result is not JSON:', result);
        }
    })
    .catch(error => {
        console.error('GET Error:', error);
    });
    
    console.log('=== Testing Method 3: JSONP ===');
    const callbackName = 'jsonpCallback' + Date.now();
    window[callbackName] = function(result) {
        console.log('JSONP Result:', result);
        delete window[callbackName];
    };
    
    const jsonpParams = new URLSearchParams({
        ...data,
        callback: callbackName
    });
    
    const script = document.createElement('script');
    script.src = `${scriptUrl}?${jsonpParams}`;
    script.onerror = function() {
        console.error('JSONP Error: Script failed to load');
        delete window[callbackName];
    };
    document.head.appendChild(script);
    
    setTimeout(() => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    }, 10000);
}

// Console commands to run:
console.log('=== DEBUG COMMANDS ===');
console.log('Run: debugSubmitInterview() - to test submission');
console.log('Run: console.log(partnerAuth.getCurrentUser()) - to check user data');
console.log('Run: console.log(interviewData) - to check interview data');