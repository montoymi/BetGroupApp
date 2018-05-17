import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, MenuController, NavController, Platform, ToastController } from 'ionic-angular';

import { ParamValueProvider, UserProvider, EventLoggerProvider, Settings } from '../../providers/providers';
import { presentToast } from '../pages';

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

	constructor(
		public navCtrl: NavController,
		public menu: MenuController,
		public platform: Platform,
		public toastCtrl: ToastController,
		public paramValueProvider: ParamValueProvider,
		public userProvider: UserProvider,
		public logger: EventLoggerProvider,
		private translate: TranslateService,
		private settings: Settings
	) {
		this.dir = platform.dir();

		this.loadSlides();
	}

	loadSlides() {
		let lang: string = this.translate.store.currentLang;

		this.paramValueProvider.getSlides(lang).subscribe(
			(res: any) => {
				this.slideList = res.body;
			},
			err => {
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

	onSlideChangeStart(slider) {
		this.showSkip = !slider.isEnd();

		switch (slider._activeIndex) {
			case 1: // El primero es el cero, pero se cuenta el primer cambio de slide.
				this.logger.logEvent(this.navCtrl.getActive().name, 'tutorial_begin', null);
				break;
			case slider._slides.length - 1:
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
