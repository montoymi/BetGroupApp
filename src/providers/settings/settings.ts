import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

/**
 * A simple settings/config class for storing key/value pairs with persistence.
 */
@Injectable()
export class Settings {
	private SETTINGS_KEY: string = '_settings';

	settings: any;
	_defaults: any;

	// Permite que otros componentes sean notificados cuando se cambia
	// la configuración durante la sesión.
	subject: BehaviorSubject<any> = new BehaviorSubject(this.settings);

	constructor(public storage: Storage, defaults: any) {
		this._defaults = defaults;
	}

	// Se llama desde SettingsPage para cargar la configuración.
	load() {
		return this.storage.get(this.SETTINGS_KEY).then(value => {
			if (value) {
				this.settings = value;
				return this._mergeDefaults(this._defaults);
			} else {
				// Si aun no existe la configuración entonces carga 
				// la configuración por defecto de provideSettings.
				return this.setAll(this._defaults).then(val => {
					this.settings = val;
				});
			}
		});
	}

	_mergeDefaults(defaults: any) {
		for (let k in defaults) {
			if (!(k in this.settings)) {
				this.settings[k] = defaults[k];
			}
		}
		return this.setAll(this.settings);
	}

	// Se llama desde SettingsPage para grabar la configuración.
	merge(settings: any) {
		for (let k in settings) {
			this.settings[k] = settings[k];
		}
		return this.setAll(this.settings);
	}

	// Graba toda la configuración.
	setAll(value: any) {
		// Notifica los cambios a los componentes suscritos.
		this.broadcast();

		return this.storage.set(this.SETTINGS_KEY, value);
	}

	// Se llama desde SettingsPage para obtener la configuración
	// luego de invocar al método load.
	get allSettings() {
		return this.settings;
	}

	setValue(key: string, value: any) {
		this.storage.get(this.SETTINGS_KEY).then(settings => {
			this.settings = settings;
			this.settings[key] = value;
			return this.storage.set(this.SETTINGS_KEY, this.settings);
		});
	}

	getValue(key: string) {
		return this.storage.get(this.SETTINGS_KEY).then(settings => {
			return settings[key];
		});
	}

	// broadcast settings to everyone who subscribes to the subject
	broadcast(settings = this.settings) {
		this.subject.next(settings);
	}
}
