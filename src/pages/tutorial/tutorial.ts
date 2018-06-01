import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, MenuController, NavController, Platform, ToastController, LoadingController, Slides } from 'ionic-angular';

import { UserProvider, ParamValueProvider, EventLoggerProvider, Settings } from '../../providers/providers';
import { presentToast, presentLoading } from '../pages';

export interface Slide {
	title: string;
	description: string;
	image: string;
}

@IonicPage()
@Component({
	selector: 'page-tutorial',
	templateUrl: 'tutorial.html'
})
export class TutorialPage {
	slideList: Slide[];
	showSkip = true;
	dir: string = 'ltr';
	noShowTutorial: boolean;

	loading;

	constructor(
		public navCtrl: NavController,
		public menu: MenuController,
		public platform: Platform,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public paramValueProvider: ParamValueProvider,
		public logger: EventLoggerProvider,
		private translate: TranslateService,
		private settings: Settings,
		public loadingCtrl: LoadingController
	) {
		this.dir = platform.dir();

		this.loadTutorial();
	}

	loadTutorial() {
		let lang: string = this.translate.store.currentLang;

		let loading = presentLoading(this.loadingCtrl);
		this.paramValueProvider.getTutorial(lang).subscribe(
			(res: any) => {
				loading.dismiss();
				this.slideList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);

		// Asigna el valor al checkbox.
		this.settings.getValue('noShowTutorial').then((noShowTutorial: boolean) => {
			this.noShowTutorial = noShowTutorial;
		});
	}

	updateSettings() {
		this.settings.setValue('noShowTutorial', this.noShowTutorial);
	}

	startApp() {
		let menuLoaded: boolean = this.menu.getMenus().length > 0;
		// Si aun no ingresa a la aplicación.
		if (!menuLoaded) {
			this.navCtrl.setRoot(
				'WelcomePage',
				{},
				{
					animate: true,
					direction: 'forward'
				}
			);
		} else {
			this.navCtrl.setRoot('GameListPage');
		}
	}

	onSlideChangeStart(slides: Slides) {
		this.showSkip = !slides.isEnd();

		switch (slides.getActiveIndex()) {
			case 1: // El primero es el cero, pero se cuenta el primer cambio de slide.
				this.logger.logEvent(this.navCtrl.getActive().name, 'tutorial_begin', null);
				break;
			case slides.length() - 1:
				this.logger.logEvent(this.navCtrl.getActive().name, 'tutorial_complete', null);
				break;
		}
	}

	ionViewDidEnter() {
		// the root left menu should be disabled on the tutorial page
		this.menu.enable(false);
	}

	ionViewWillLeave() {
		// enable the root left menu when leaving the tutorial page
		this.menu.enable(true);
	}
}
