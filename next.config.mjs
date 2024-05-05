/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'kaekqwmvrbltrhjiklxb.supabase.co',
		  },
		],
	  },
};

export default nextConfig;
