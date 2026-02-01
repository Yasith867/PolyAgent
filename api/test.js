// Plain JavaScript - no TypeScript compilation needed
module.exports = function handler(req, res) {
    // Set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    return res.status(200).json({
        status: "working!",
        timestamp: new Date().toISOString(),
        message: "Basic JavaScript function works"
    });
}
