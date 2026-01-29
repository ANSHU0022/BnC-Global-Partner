// Vercel Serverless Function for Authentication
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
    const { action, email, password, phone, firstName, lastName } = req.body;

    switch (action) {
      case 'login':
        // Login logic
        if (email && password) {
          // Simulate authentication (replace with real logic)
          const isValid = await validateCredentials(email, password);
          if (isValid) {
            res.status(200).json({ 
              success: true, 
              message: 'Login successful',
              token: generateToken(email)
            });
          } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        } else {
          res.status(400).json({ success: false, message: 'Email and password required' });
        }
        break;

      case 'register':
        // Registration logic
        if (email && password && phone && firstName && lastName) {
          const result = await registerUser({ email, password, phone, firstName, lastName });
          res.status(200).json(result);
        } else {
          res.status(400).json({ success: false, message: 'All fields required' });
        }
        break;

      default:
        res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function validateCredentials(email, password) {
  // Replace with actual validation logic
  return email && password.length >= 6;
}

async function registerUser(userData) {
  // Replace with actual registration logic
  return { success: true, message: 'Registration successful' };
}

function generateToken(email) {
  // Simple token generation (use JWT in production)
  return Buffer.from(email + ':' + Date.now()).toString('base64');
}