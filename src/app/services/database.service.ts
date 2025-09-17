import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private sqlite: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'appdb';

  constructor(private platform: Platform) {}

  async initDB(): Promise<void> {
    await this.platform.ready();

    // Web: inicializar jeep-sqlite
    if (Capacitor.getPlatform() === 'web') {
      defineCustomElements(window);
      await this.waitForJeep();
    }

    this.sqlite = new SQLiteConnection(CapacitorSQLite);

    // Crear conexión
    this.db = await this.sqlite.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false
    );
    //await this.sqlite.initWebStore();

    await this.db.open();
    await this.createTables();
  }

  private async waitForJeep(): Promise<void> {
    return new Promise(resolve => {
      const jeepEl = document.querySelector('jeep-sqlite');
      if (!jeepEl) throw new Error('No se encontró el elemento <jeep-sqlite> en el DOM');

      if (customElements.get('jeep-sqlite')) {
        resolve();
      } else {
        customElements.whenDefined('jeep-sqlite').then(() => resolve());
      }
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    const queries = [
      `CREATE TABLE IF NOT EXISTS unidades_edificios (
        unidad_id INTEGER PRIMARY KEY,
        nombre_unidad TEXT,
        edificio_id INTEGER,
        nombre_edificio TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS departamentos (
        id INTEGER PRIMARY KEY,
        numero TEXT,
        nombre TEXT,
        apellido_paterno TEXT,
        apellido_materno TEXT,
        edificio_id INTEGER,
        FOREIGN KEY(edificio_id) REFERENCES unidades_edificios(edificio_id)
      );`,
      `CREATE TABLE IF NOT EXISTS lecturas (
        id INTEGER PRIMARY KEY,
        departamento_id INTEGER,
        fecha TEXT,
        lectura_anterior REAL,
        lectura_actual REAL,
        capturado INTEGER,
        foto TEXT,
        FOREIGN KEY(departamento_id) REFERENCES departamentos(id)
      );`
    ];

    for (const q of queries) {
      await this.db.execute(q);
    }
  }

  async closeDB(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
    if (this.sqlite) {
      await this.sqlite.closeConnection(this.dbName, false);
    }
  }

  // Ejemplo de consulta: obtener departamentos por edificio
  async getDepartamentosByEdificio(edificio_id: number) {
    if (!this.db) return [];
    const res = await this.db.query(`SELECT * FROM departamentos WHERE edificio_id = ?`, [edificio_id]);
    return res.values;
  }
}
