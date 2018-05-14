import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';

import { PollaProvider } from '../../providers/providers';
import { PollaMatch } from '../../models/polla/polla-match';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';

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
		public pollaProvider: PollaProvider
	) {
		this.loadPollaMatches();
	}

	ionViewDidLoad() {
		this.navBar.backButtonClick = (e: UIEvent) => {
			this.navCtrl.parent.viewCtrl.dismiss();
		};
	}

	loadPollaMatches() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		this.pollaProvider.getPollaMatchesByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				this.pollaMatchList = res.body;
			},
			err => {
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
