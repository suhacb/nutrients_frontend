import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccessToken, AccessTokenApiResource } from '../../../../core/AccessToken/AccessToken';
import { AccessTokenMapper } from '../../../../core/AccessToken/AccessTokenMapper';
import { AuthStore } from '../../../../core/Auth/store/auth.store';

@Component({
  selector: 'app-callback-page',
  standalone: false,
  templateUrl: './callback-page.html',
  styleUrl: './callback-page.scss'
})
export class CallbackPage implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, public store: AuthStore) {}

  ngOnInit(): void {
    const token = this.getAccessTokenFromUri(this.route.snapshot.queryParamMap);
    this.store.setToken(token);
    this.router.navigate(['/']);
  }

  objectKeys = Object.keys;

  getAccessTokenFromUri(params: ParamMap): AccessTokenApiResource {
    return {
      access_token: params.get('access_token') || '',
      token_type: params.get('token_type') || '',
      expires_in: params.get('expires_in') ? Number(params.get('expires_in')) : 0,
      refresh_token: params.get('refresh_token') || '',    
      refresh_expires_in: params.get('refresh_expires_in') ? Number(params.get('refresh_expires_in')) : 0,
      scope: params.get('scope') || '',
      id_token: params.get('id_token') || '',
      not_before_policy: params.get('not_before_policy') || '',
      session_state: params.get('session_state') || '',
    } as AccessTokenApiResource;
  }
}