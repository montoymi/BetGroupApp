import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Platform } from 'ionic-angular';
import { Globalization } from '@ionic-native/globalization';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';

@Component({
	template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
	rootPage: any;

	constructor(
		private translate: TranslateService,
		public platform: Platform,
		private settings: Settings,
		private config: Config,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private globalization: Globalization
	) {
		this.initializeApp();

		// Borra la configuración previa.
		//this.settings.storage.remove('_settings');

		// Inicialializa la configuración.
		this.settings.load().then(() => {
			this.initTranslate();
		});
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	initTranslate() {
		// Set the default language for translation strings.
		this.translate.setDefaultLang('es');

		// Asigna el idioma según la configuración de usuario.
		this.settings.getValue('lang').then((lang: string) => {
			if (lang) {
				this.setLangAndRootPage(lang, false);
			} else {
				// Asigna el idioma por defecto según el idioma del dispositivo.
				this.globalization
					.getPreferredLanguage()
					.then(res => {
						// El lenguaje retorna en formato es-US.
						lang = res.value.split('-')[0];
						this.setLangAndRootPage(lang, true);
					})
					.catch(e => {
						// Cuando se ejecuta desde el navegador entra
						// a esta parte, porque no carga las librerias
						// de cordova.
						lang = this.translate.getDefaultLang();
						this.setLangAndRootPage(lang, true);
					});
			}
		});

		// Asigna el idioma según la configuración de usuario
		// modificada durante la sesión.
		this.settings.subject.subscribe(settings => {
			if (settings) {
				// Se tiene que obtener el valor desde
				// settings porque aun no se ecuentra en
				// en el storage.
				let lang: string = settings.lang;
				this.translate.use(lang);
			}
		});

		this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
			this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
		});
	}

	setLangAndRootPage(lang: string, isDefault: boolean) {
		this.translate.use(lang);

		// Como aun no existe la configuración del idioma se asigna.
		if (isDefault) {
			this.settings.setValue('lang', lang);
		}

		// Establece la página de inicio según si se muestra el tutorial o no.
		this.settings.getValue('noShowTutorial').then((noShowTutorial: boolean) => {
			this.rootPage = noShowTutorial ? 'WelcomePage' : FirstRunPage;
		});
	}
}
