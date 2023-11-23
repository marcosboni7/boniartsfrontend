const isProduction = process.env.NEXT_PUBLIC_PRODUCTION === 'true';
const productionApi = process.env.NEXT_PUBLIC_PRODUCTION_API;
const developmentApi = process.env.NEXT_PUBLIC_DEVELOPMENT_API;

const baseURL = isProduction ? productionApi : developmentApi;

console.log(baseURL)

const serverFetch = async <T>(url: string, ): Promise<{ data: T }> => {
    if (url[0] === '/')
        url = url.substring(1);
    const res = await fetch(`${baseURL}/${url}`);
    const data: T = await res.json();

    return {
        data
    };
};

export default serverFetch;
