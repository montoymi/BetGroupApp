import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-rules',
	templateUrl: 'rules.html'
})
export class RulesPage {
	@ViewChild(Navbar) navBar: Navbar;
	
	pollaHeader: PollaHeader;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public pollaProvider: PollaProvider,
		public loadingCtrl: LoadingController
	) {
		this.loadGameRules();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadGameRules() {
		this.pollaHeader = this.navParams.get('pollaHeader');
		this.pollaHeader.lang = this.translate.store.currentLang;

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getGameRules(this.pollaHeader).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaHeader = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}
}
