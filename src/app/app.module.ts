import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Globalization } from '@ionic-native/globalization';

import {
	Api,
	Settings,
	EventLoggerProvider,
	UserProvider,
	ParamValueProvider,
	TemplateProvider,
	PollaProvider,
	CreditProvider,
	FriendProvider,
	MatchProvider
} from '../providers/providers';
import { MyApp } from './app.component';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
	/**
	 * The Settings provider takes a set of default settings for your app.
	 *
	 * You can add new settings options at any time. Once the settings are saved,
	 * these values will not overwrite the saved values (this can be done manually if desired).
	 * 
	 * Lo anterior se refiere a que esta configuración no sobreescribe la configuración
	 * dada en la página de configuración. Esta se asigna a _defaults por medio del constructor
	 * que esta debajo. En load se llama a _mergeDefaults, el cual solo asigna los valores de
	 * estas propiedades si estas no están en settings. Ver !(k in this.settings)
	 */
	return new Settings(storage, {
		noShowTutorial: false,
		lang: null,
		user: null
	});
}

@NgModule({
	declarations: [MyApp],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		IonicModule.forRoot(MyApp),
		IonicStorageModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [MyApp],
	providers: [
		Api,
		FirebaseAnalytics,
		Globalization,
		EventLoggerProvider,
		UserProvider,
		ParamValueProvider,
		TemplateProvider,
		PollaProvider,
		CreditProvider,
		FriendProvider,
		MatchProvider,
		Camera,
		SplashScreen,
		StatusBar,
		{ provide: Settings, useFactory: provideSettings, deps: [Storage] },
		// Keep this to enable Ionic's runtime error handling during development
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule {}
