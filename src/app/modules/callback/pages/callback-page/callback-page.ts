import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessTokenApiResource } from '../../../../core/AccessToken/AccessToken';

@Component({
  selector: 'app-callback-page',
  standalone: false,
  templateUrl: './callback-page.html',
  styleUrl: './callback-page.scss'
})
export class CallbackPage implements OnInit {
  accessToken!: AccessTokenApiResource;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.accessToken = {
        access_token: params.get('access_token') || '',
        token_type: params.get('token_type') || '',
        expires_in: params.get('expires_in') ? Number(params.get('expires_in')) : 0,
        refresh_token: params.get('refresh_token') || '',    
        refresh_expires_in: params.get('refresh_expires_in') ? Number(params.get('refresh_expires_in')) : 0,
        scope: params.get('scope') || '',
        id_token: params.get('id_token') || '',
        not_before_policy: params.get('not_before_policy') || '',
        session_state: params.get('session_state') || '',
      };
    });
  }

  objectKeys = Object.keys;

  getAccessTokenValue(key: string) {
    return this.accessToken[key as keyof AccessTokenApiResource];
  }
}