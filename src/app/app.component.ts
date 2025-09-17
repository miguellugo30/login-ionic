import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

   constructor(private platform: Platform, private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.platform.ready();
    /*
    try {
      await this.dbService.initDB();
      console.log('Base de datos inicializada correctamente');
    } catch (err) {
      console.error('Error inicializando base de datos:', err);
    }
      */
  }
}
