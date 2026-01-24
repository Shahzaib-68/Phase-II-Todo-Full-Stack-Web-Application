import { createAuthClient } from "better-auth/react";

// Custom fetch wrapper to ensure proper serialization
const customFetch = async (url: string, options: any) => {
    // Ensure the body is properly serialized to JSON
    if (options?.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        // Check if it's already a string (possibly already serialized)
        if (typeof options.body !== 'string') {
            options.body = JSON.stringify(options.body);
        }
    }

    // Ensure Content-Type header is set for JSON requests
    if (!options.headers) {
        options.headers = {};
    }

    // Set Content-Type to application/json if we're sending a JSON string
    if (options.body && typeof options.body === 'string' && !options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
    }

    console.log('Custom fetch called with:', { url, options }); // Debug log

    // Call the original fetch with our modifications
    const response = await fetch(url, options);
    console.log('Response received:', response); // Debug log
    return response;
};

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`, // Using env variable for base URL
    fetchOptions: {
        credentials: "include", // Essential for cookies to be sent with requests
        fetch: customFetch
    }
});

export default authClient;