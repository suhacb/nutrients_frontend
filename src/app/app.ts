import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nutrients');
  private return_uri: string | null = null;
  constructor(private http: HttpClient) { }


  login():void  {
    this.http.post('http://localhost:9015/api/auth/login', {}, {observe: 'response'}).subscribe({
      next: (response: HttpResponse<any>) => {
        const url = new URL(response.body.redirect_uri);
        // url.searchParams.set('redirect_uri', 'http://localhost:9010/test');
        url.searchParams.set('appName', 'nutrients');
        url.searchParams.set('appUrl', 'http://localhost:9010');
        window.location.href = url.toString();
      }
    });
  }
}
