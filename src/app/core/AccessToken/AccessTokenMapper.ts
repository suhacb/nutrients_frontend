
import { ResourceMapper } from "../ResourceMapper/ResourceMapper";
import { AccessToken, AccessTokenApiResource } from "./AccessToken";

export class AccessTokenMapper extends ResourceMapper<AccessToken, AccessTokenApiResource, AccessTokenApiResource> {
    public toApp(api: AccessTokenApiResource): AccessToken {
        return {
            accessToken: api.access_token,
            tokenType: api.token_type,
            expiresIn: api.expires_in,
            refreshToken: api.refresh_token,
            refreshExpiresIn: api.refresh_expires_in,
            scope: api.scope,
            idToken: api.id_token,
            notBeforePolicy: api.not_before_policy,
            sessionState: api.session_state
        }
    }

    public toApi(app: AccessToken): AccessTokenApiResource {
        return {
            access_token: app.accessToken,
            token_type: app.tokenType,
            expires_in: app.expiresIn,
            refresh_token: app.refreshToken,
            refresh_expires_in: app.refreshExpiresIn,
            scope: app.scope,
            id_token: app.idToken,
            not_before_policy: app.notBeforePolicy,
            session_state: app.sessionState
        }
    }

    public make(overrides: Partial<AccessToken> = {}): AccessToken {
        const defaults: AccessToken = {
            accessToken: '',
            tokenType: '',
            expiresIn: 0,
            refreshToken: '',
            refreshExpiresIn: 0,
            scope: '',
            idToken: '',
            notBeforePolicy: '',
            sessionState: ''
        };
        return {...defaults, ...overrides};
    }

    public definition(): string[] {
        return [
            'accessToken',
            'tokenType',
            'expiresIn',
            'refreshToken',
            'refreshExpiresIn',
            'scope',
            'idToken',
            'notBeforePolicy',
            'sessionState'
        ];
    }
}