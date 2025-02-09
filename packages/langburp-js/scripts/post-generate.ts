import * as fs from 'fs';
import * as path from 'path';

const connectApiPath = path.join(__dirname, '../src/langburpapi_client/apis/ConnectApi.ts');

try {
    let content = fs.readFileSync(connectApiPath, 'utf8');

    // Define the code block we want to replace
    const codeToReplace = `    async getAvailableIntegrationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAvailableIntegrations200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["x-end-user-token"] = await this.configuration.apiKey("x-end-user-token"); // endUserTokenAuth authentication
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["x-api-key"] = await this.configuration.apiKey("x-api-key"); // apiKeyAuth authentication
        }

        const response = await this.request({
            path: \`/v1/connect/integrations\`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAvailableIntegrations200ResponseFromJSON(jsonValue));
    }`;

    // Define the replacement code
    const replacementCode = `    async getAvailableIntegrationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAvailableIntegrations200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            try {
                headerParameters["x-end-user-token"] = await this.configuration.apiKey("x-end-user-token"); // endUserTokenAuth authentication
            } catch (error) {
                console.warn('skipping end user token auth for getAvailableIntegrationsRaw [no end user token provided]');
            }
        }

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["x-api-key"] = await this.configuration.apiKey("x-api-key"); // apiKeyAuth authentication
        }

        const response = await this.request({
            path: \`/v1/connect/integrations\`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAvailableIntegrations200ResponseFromJSON(jsonValue));
    }`;

    // Check if the code exists in the file
    if (!content.includes(codeToReplace)) {
        throw new Error('Could not find the code block to replace in ConnectApi.ts');
    }

    // Replace the code
    const updatedContent = content.replace(codeToReplace, replacementCode);

    // Write the file back
    fs.writeFileSync(connectApiPath, updatedContent, 'utf8');

    console.log('Successfully updated getAvailableIntegrationsRaw in ConnectApi.ts');

} catch (error) {
    console.error('Error processing ConnectApi.ts:', error);
    process.exit(1);
}
