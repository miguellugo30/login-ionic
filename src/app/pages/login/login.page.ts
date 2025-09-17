import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,
         IonHeader,
         IonTitle,
         IonToolbar,
         IonItem,
         IonLabel,
         IonInput,
         IonCard,
         IonCardHeader,
         IonCardTitle,
         IonCardContent,
         IonButton,
         IonCardSubtitle,
         IonText,
         IonSpinner
        } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { Auth } from 'src/app/services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonItem,
      IonLabel,
      IonInput,
      CommonModule,
      FormsModule,
      RouterModule,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonButton,
      IonText,
      IonSpinner
    ]
})
export class LoginPage   {

  email = '';
  password = '';
  loading = false;
  error: string | null = '';

  constructor(private auth: Auth, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = null;

    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        console.log('Login exitoso:', res);
        this.loading = false;
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      error: err => {
        console.error('Error en login:', err);
        this.loading = false;
        this.error = err.message || 'Credenciales inválidas';
      }
    });
  }

}
