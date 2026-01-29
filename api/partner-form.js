// Vercel Serverless Function for Partner Form Submission
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Validate required fields
    const requiredFields = ['email', 'password', 'phone', 'first-name', 'last-name', 'country', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate phone number (minimum 12 digits)
    if (formData.phone.replace(/\D/g, '').length < 12) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number must be at least 12 digits' 
      });
    }

    // Process the form submission
    const result = await processPartnerApplication(formData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Partner application submitted successfully!',
        applicationId: result.applicationId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit application. Please try again.'
      });
    }

  } catch (error) {
    console.error('Partner form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred while processing your application' 
    });
  }
}

async function processPartnerApplication(formData) {
  try {
    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admin team
    
    // For now, simulate processing
    const applicationId = 'APP-' + Date.now();
    
    // Log the application (in production, save to database)
    console.log('New partner application:', {
      applicationId,
      email: formData.email,
      name: `${formData['first-name']} ${formData['last-name']}`,
      phone: formData.phone,
      location: `${formData.city}, ${formData.country}`,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      applicationId
    };
  } catch (error) {
    console.error('Processing error:', error);
    return { success: false };
  }
}