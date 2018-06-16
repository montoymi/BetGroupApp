import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading } from '../../utils/utils';

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
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public loadingCtrl: LoadingController
	) {}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadGameRules();
	}

	loadGameRules() {
		this.pollaHeader = this.navParams.get('pollaHeader');
		this.pollaHeader.lang = this.userProvider.user.preferredLang;

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
