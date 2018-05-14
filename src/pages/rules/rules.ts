import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';

import { PollaProvider } from '../../providers/providers';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast } from '../pages';

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
		public pollaProvider: PollaProvider
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

		this.pollaProvider.getGameRules(this.pollaHeader).subscribe(
			(res: any) => {
				this.pollaHeader = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}
}
