import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaMatch } from '../../models/polla/polla-match';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-game-match-list',
	templateUrl: 'game-match-list.html'
})
export class GameMatchListPage {
	@ViewChild(Navbar) navBar: Navbar;

	pollaMatchList: PollaMatch[];

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
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};

		this.loadPollaMatches();
	}

	loadPollaMatches() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getPollaMatchesByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaMatchList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	filter(ev) {
		// set val to the value of the ev target
		let name: string = ev.target.value;

		// if the value is an empty string don't filter the items
		if (name && name.trim() != '') {
			this.pollaMatchList = this.pollaMatchList.filter(pollaMatch => {
				return pollaMatch.match.localTeam.teamName.toLowerCase().indexOf(name.toLowerCase()) > -1;
			});
		} else {
			// Reset items back to all of the items
			this.loadPollaMatches();
		}
	}
}
