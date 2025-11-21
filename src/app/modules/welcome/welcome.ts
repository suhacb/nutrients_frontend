import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { AuthStore } from '../../core/Auth/store/auth.store';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss'
})
export class Welcome {
  protected readonly title = signal('nutrients');
  private return_uri: string | null = null;
  constructor(private http: HttpClient, public store: AuthStore) { }


  login():void  {
    this.http.post('http://localhost:9015/api/auth/login', {}, {observe: 'response'}).subscribe({
      next: (response: HttpResponse<any>) => {
        const url = new URL(response.body.redirect_uri);
        window.location.href = url.toString();
      }
    });
  }
}
