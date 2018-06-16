import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { PollaProvider, UserProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading } from '../../utils/utils';

@IonicPage()
@Component({
	selector: 'page-game-available-detail',
	templateUrl: 'game-available-detail.html'
})
export class GameAvailableDetailPage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaHeader: PollaHeader;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		private userProvider: UserProvider,
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
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};

		this.loadPolla();
	}

	loadPolla() {
		this.pollaHeader = this.navParams.get('pollaHeader');

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getPollaById(this.pollaHeader.pollaId).subscribe(
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
