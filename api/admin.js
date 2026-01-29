// Vercel Serverless Function for Admin Operations
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

  try {
    const { action, email, password, token } = req.body;

    switch (action) {
      case 'admin-login':
        if (email && password) {
          const isAdmin = await validateAdminCredentials(email, password);
          if (isAdmin) {
            res.status(200).json({ 
              success: true, 
              message: 'Admin login successful',
              token: generateAdminToken(email),
              role: 'admin'
            });
          } else {
            res.status(401).json({ success: false, message: 'Invalid admin credentials' });
          }
        } else {
          res.status(400).json({ success: false, message: 'Email and password required' });
        }
        break;

      case 'get-partners':
        if (await validateAdminToken(token)) {
          const partners = await getPartnersList();
          res.status(200).json({ success: true, partners });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        break;

      case 'get-applications':
        if (await validateAdminToken(token)) {
          const applications = await getPartnerApplications();
          res.status(200).json({ success: true, applications });
        } else {
          res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        break;

      default:
        res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function validateAdminCredentials(email, password) {
  // Replace with actual admin validation
  const adminCredentials = {
    'admin@bncglobal.com': 'admin123',
    'support@bncglobal.com': 'support123'
  };
  return adminCredentials[email] === password;
}

async function validateAdminToken(token) {
  // Simple token validation (use JWT in production)
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [email, timestamp] = decoded.split(':');
    const tokenAge = Date.now() - parseInt(timestamp);
    return tokenAge < 24 * 60 * 60 * 1000; // 24 hours
  } catch {
    return false;
  }
}

function generateAdminToken(email) {
  return Buffer.from(email + ':' + Date.now()).toString('base64');
}

async function getPartnersList() {
  // Mock data - replace with database query
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending' }
  ];
}

async function getPartnerApplications() {
  // Mock data - replace with database query
  return [
    { 
      id: 'APP-1234567890', 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1234567890123',
      location: 'Mumbai, India',
      status: 'pending',
      submittedAt: new Date().toISOString()
    }
  ];
}