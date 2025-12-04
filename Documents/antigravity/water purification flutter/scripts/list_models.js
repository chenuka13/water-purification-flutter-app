import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
    const apiKey = match ? match[1] : null;

    if (!apiKey) {
        console.error("Could not find VITE_GEMINI_API_KEY in .env");
        process.exit(1);
    }

    console.log("Using API Key:", apiKey.substring(0, 10) + "...");

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.error("API Error:", data.error);
    } else {
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found in response:", data);
        }
    }

} catch (error) {
    console.error("Error:", error);
}
