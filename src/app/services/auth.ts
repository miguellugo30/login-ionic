import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, catchError, from, mergeMap, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SecureStorageService } from './secure-storage-service';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private api = environment.apiUrl;
  private accessToken$ = new BehaviorSubject<string|null>(null);

  constructor(private http: HttpClient, private secureStorage: SecureStorageService) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.api}auth/login`,
      { email, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      mergeMap(res => {
        if (res.success && res.token) {
          // Convertimos a Promise y luego a Observable con from()
          return from(
            this.secureStorage.set('access_token', res.token)
              .then(() => {
                this.accessToken$.next(res.token ?? null);
                return res;
              })
          );
        } else {
          return throwError(() => new Error(res.message || 'No autorizado'));
        }
      }),
      catchError(err => {
        // Manejo global de errores HTTP
        console.error('Error en login:', err);
        return throwError(() => err);
      })
    );
  }

  async logout() {
    try {
      await this.http.post(`${this.api}/logout`, {}).toPromise();
    } catch { /* ignorar errores */ }
    await this.clearSession();
  }

  private async clearSession() {
    await this.secureStorage.remove('access_token');
    await this.secureStorage.remove('refresh_token');
    this.accessToken$.next(null);
  }

  getAccessToken() {
    return this.accessToken$.value;
  }

  refreshToken() {
    return this.http.post<any>(`${this.api}/refresh`, {}).pipe(
      tap(async res => {
        await this.secureStorage.set('access_token', res.access_token);
        this.accessToken$.next(res.access_token);
      })
    );
  }


}
