export default async function handler(req: Request, context: any) {
    // Get the country code from Netlify's geo-location context
    const country = context.geo?.country?.code;
    
    // Block requests from China (CN)
    if (country === "CN") {
        return new Response("Access denied", {
            status: 403,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
    
    // For all other countries, fetch and return the feed.xml content
    const url = new URL(req.url);
    const feedUrl = new URL("/feed.xml", url.origin);
    
    // Fetch the actual feed.xml file from the origin
    const response = await context.next();
    
    return response;
}
