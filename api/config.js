// Vercel Serverless Function for Configuration
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

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const config = {
      apiUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api` : 'http://localhost:3000/api',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      features: {
        partnerRegistration: true,
        adminDashboard: true,
        aiProfiling: true,
        multiStepForm: true
      },
      endpoints: {
        auth: '/api/auth',
        partnerForm: '/api/partner-form',
        admin: '/api/admin',
        config: '/api/config'
      },
      security: {
        csrfProtection: true,
        rateLimit: true,
        inputSanitization: true
      }
    };

    res.status(200).json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Config API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load configuration' 
    });
  }
}