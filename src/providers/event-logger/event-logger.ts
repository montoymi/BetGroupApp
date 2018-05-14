import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Platform } from 'ionic-angular';
import { UserProvider } from '../data/user-provider';

@Injectable()
export class EventLoggerProvider {
	// Permite verificar si se ejecuta en el dispositivo. En la computadora ocurre
	// un error por que no se encuentran librerias de cordova en el navegador.
	isApp: boolean;

	constructor(public fba: FirebaseAnalytics, public platform: Platform, public userProvider: UserProvider) {
		if (this.platform.is('core') || this.platform.is('mobileweb')) {
			this.isApp = false;
		} else {
			this.isApp = true;
		}

		if (this.userProvider.user) {
			fba.setUserId(this.userProvider.user.userId.toString());
		}
	}

	// { param: value }
	// ionViewDidEnter()
	logEvent(screen: string, event: string, params: any) {
		// Solo se ejecuta en el dispositivo.
		if (!this.isApp) return;

		this.fba.setCurrentScreen(screen);

		this.fba
			.logEvent(event, params)
			.then((res: any) => {
				console.log(res);
			})
			.catch((error: any) => console.error(error));
	}
}
