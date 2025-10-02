export const config = {
    path: "/feed.xml"
}

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
    
}
