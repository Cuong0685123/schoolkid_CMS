/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nextConfig = {
    sassOptions: {
        includePaths: [join(__dirname, 'styles')], // Use join from path module for cross-platform compatibility
        silenceDeprecations: ['legacy-js-api'],
        quietDeps: true,
    }
};

export default nextConfig;
