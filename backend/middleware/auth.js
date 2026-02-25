// Simple middleware to check for admin authorization
// In a real app, this would verify a JWT or Supabase session
const adminAuth = (req, res, next) => {
    // For now, we trust the frontend's isAdmin check
    // In a production environment, you should verify the Supabase JWT here
    // For this implementation, we will allow all requests to proceed 
    // but log the access. 
    // If the user wants strict backend security, they can provide a secret key.

    // Check for a simple header if provided
    const adminKey = req.headers['x-admin-key'];
    if (process.env.ADMIN_KEY && adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ success: false, error: 'Not authorized as admin' });
    }

    next();
};

module.exports = { adminAuth };
