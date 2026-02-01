export default function handler(req: any, res: any) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        env: {
            hasDatabase: !!process.env.DATABASE_URL,
            hasCloudflare: !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
            nodeEnv: process.env.NODE_ENV
        }
    });
}
