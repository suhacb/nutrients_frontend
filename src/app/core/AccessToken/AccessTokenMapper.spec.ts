import { AccessTokenMapper } from './AccessTokenMapper';
import { AccessTokenApiResource, AccessToken } from './AccessToken';

describe('AccessTokenMapper', () => {
  let mapper: AccessTokenMapper;

  const fullApiResource: AccessTokenApiResource = {
    access_token: 'eyJhbGciOiJSUzI1NiJ9.payload.sig',
    token_type: 'Bearer',
    expires_in: 300,
    refresh_token: 'refresh-abc-123',
    refresh_expires_in: 1800,
    scope: 'openid profile email',
    id_token: 'id-token-xyz',
    not_before_policy: '0',
    session_state: 'session-uuid-456',
  };

  const fullAppModel: AccessToken = {
    accessToken: 'eyJhbGciOiJSUzI1NiJ9.payload.sig',
    tokenType: 'Bearer',
    expiresIn: 300,
    refreshToken: 'refresh-abc-123',
    refreshExpiresIn: 1800,
    scope: 'openid profile email',
    idToken: 'id-token-xyz',
    notBeforePolicy: '0',
    sessionState: 'session-uuid-456',
  };

  beforeEach(() => {
    mapper = new AccessTokenMapper();
  });

  describe('toApp', () => {
    it('maps access_token to accessToken', () => {
      expect(mapper.toApp(fullApiResource).accessToken).toBe(fullApiResource.access_token);
    });

    it('maps token_type to tokenType', () => {
      expect(mapper.toApp(fullApiResource).tokenType).toBe(fullApiResource.token_type);
    });

    it('maps expires_in to expiresIn', () => {
      expect(mapper.toApp(fullApiResource).expiresIn).toBe(fullApiResource.expires_in);
    });

    it('maps refresh_token to refreshToken', () => {
      expect(mapper.toApp(fullApiResource).refreshToken).toBe(fullApiResource.refresh_token);
    });

    it('maps refresh_expires_in to refreshExpiresIn', () => {
      expect(mapper.toApp(fullApiResource).refreshExpiresIn).toBe(fullApiResource.refresh_expires_in);
    });

    it('maps scope unchanged', () => {
      expect(mapper.toApp(fullApiResource).scope).toBe(fullApiResource.scope);
    });

    it('maps id_token to idToken', () => {
      expect(mapper.toApp(fullApiResource).idToken).toBe(fullApiResource.id_token);
    });

    it('maps not_before_policy to notBeforePolicy', () => {
      expect(mapper.toApp(fullApiResource).notBeforePolicy).toBe(fullApiResource.not_before_policy);
    });

    it('maps session_state to sessionState', () => {
      expect(mapper.toApp(fullApiResource).sessionState).toBe(fullApiResource.session_state);
    });

    it('maps all nine fields in a single pass', () => {
      expect(mapper.toApp(fullApiResource)).toEqual(fullAppModel);
    });
  });

  describe('toApi', () => {
    it('is the exact inverse of toApp', () => {
      expect(mapper.toApi(mapper.toApp(fullApiResource))).toEqual(fullApiResource);
    });

    it('maps accessToken back to access_token', () => {
      expect(mapper.toApi(fullAppModel).access_token).toBe(fullAppModel.accessToken);
    });

    it('maps tokenType back to token_type', () => {
      expect(mapper.toApi(fullAppModel).token_type).toBe(fullAppModel.tokenType);
    });

    it('maps expiresIn back to expires_in', () => {
      expect(mapper.toApi(fullAppModel).expires_in).toBe(fullAppModel.expiresIn);
    });

    it('maps refreshToken back to refresh_token', () => {
      expect(mapper.toApi(fullAppModel).refresh_token).toBe(fullAppModel.refreshToken);
    });

    it('maps refreshExpiresIn back to refresh_expires_in', () => {
      expect(mapper.toApi(fullAppModel).refresh_expires_in).toBe(fullAppModel.refreshExpiresIn);
    });

    it('maps idToken back to id_token', () => {
      expect(mapper.toApi(fullAppModel).id_token).toBe(fullAppModel.idToken);
    });

    it('maps notBeforePolicy back to not_before_policy', () => {
      expect(mapper.toApi(fullAppModel).not_before_policy).toBe(fullAppModel.notBeforePolicy);
    });

    it('maps sessionState back to session_state', () => {
      expect(mapper.toApi(fullAppModel).session_state).toBe(fullAppModel.sessionState);
    });
  });

  describe('make', () => {
    it('returns empty strings for all string fields', () => {
      const result = mapper.make();

      expect(result.accessToken).toBe('');
      expect(result.tokenType).toBe('');
      expect(result.refreshToken).toBe('');
      expect(result.scope).toBe('');
      expect(result.idToken).toBe('');
      expect(result.notBeforePolicy).toBe('');
      expect(result.sessionState).toBe('');
    });

    it('returns 0 for all numeric fields', () => {
      const result = mapper.make();

      expect(result.expiresIn).toBe(0);
      expect(result.refreshExpiresIn).toBe(0);
    });
  });

  describe('definition', () => {
    it('returns all nine camelCase key names', () => {
      const keys = mapper.definition();

      expect(keys).toEqual([
        'accessToken',
        'tokenType',
        'expiresIn',
        'refreshToken',
        'refreshExpiresIn',
        'scope',
        'idToken',
        'notBeforePolicy',
        'sessionState',
      ]);
    });

    it('returns exactly nine entries', () => {
      expect(mapper.definition().length).toBe(9);
    });
  });
});
