export abstract class ResourceMapper<AppResourceType, ApiResourceType, ApiPayloadType = ApiResourceType> {
    abstract toApp(api: ApiResourceType): AppResourceType;
    abstract toApi(app: AppResourceType): ApiPayloadType;
    abstract make(): AppResourceType;

    protected toCamelCase(str: string): string {
        return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
        );
    }

    protected toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    }

    /**
     * Optional generic helper to automatically map keys from snake_case to camelCase.
     */
    protected mapApiPropertiesToAppProperties(api: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(api)) {
        result[this.toCamelCase(key)] = value;
        }
        return result;
    }

    protected mapAppPropertiesToApiProperties(internal: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(internal)) {
        result[this.toSnakeCase(key)] = value;
        }
        return result;
    }

}