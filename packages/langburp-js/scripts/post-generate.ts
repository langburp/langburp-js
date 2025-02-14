import * as fs from 'fs';
import * as path from 'path';

interface CodeReplacement {
    original: string;
    replacement: string;
    description: string;
}

function replaceCodeInFile(filePath: string, replacements: CodeReplacement[]): void {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        for (const { original, replacement, description } of replacements) {
            if (!content.includes(original)) {
                throw new Error(`Could not find the code block to replace: ${description}`);
            }
            content = content.replace(original, replacement);
            console.log(`Successfully updated ${description}`);
        }

        fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
        console.error(`Error processing ${path.basename(filePath)}:`, error);
        process.exit(1);
    }
}

const connectApiReplacements: CodeReplacement[] = [{
    original: `    async getAvailableIntegrationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAvailableIntegrationsSuccessResponse>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAvailableIntegrationsSuccessResponseFromJSON(jsonValue));
    }`,
    replacement: `    async getAvailableIntegrationsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAvailableIntegrationsSuccessResponse>> {
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

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAvailableIntegrationsSuccessResponseFromJSON(jsonValue));
    }`,
    description: 'getAvailableIntegrationsRaw in ConnectApi.ts'
}];

const connectApiPath = path.join(__dirname, '../src/langburpapi_client/apis/ConnectApi.ts');
replaceCodeInFile(connectApiPath, connectApiReplacements);
