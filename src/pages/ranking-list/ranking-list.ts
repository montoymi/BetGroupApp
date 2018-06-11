import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, PollaProvider } from '../../providers/providers';
import { PollaParticipant } from '../../models/polla/polla-participant';
import { PollaHeader } from '../../models/polla/polla-header';
import { presentToast, presentLoading, getFlagValue } from '../pages';

@IonicPage()
@Component({
	selector: 'page-ranking-list',
	templateUrl: 'ranking-list.html'
})
export class RankingListPage {
	@ViewChild(Navbar) navBar: Navbar;

	segment: string;

	pollaParticipantList: PollaParticipant[];

	modePollitaFlag: boolean;
	modePollaFlag: boolean;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public pollaProvider: PollaProvider,
		public loadingCtrl: LoadingController
	) {
		// Habilita y seleciona el tab segun flags.
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');
		this.modePollitaFlag = getFlagValue(pollaHeader.modePollitaFlag) == 1;
		this.modePollaFlag = getFlagValue(pollaHeader.modePollaFlag) == 1;
		this.segment = this.modePollaFlag ? 'polla' : 'pollita';
	}

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

		this.loadRanking();
	}

	loadRanking() {
		let pollaHeader: PollaHeader = this.navParams.get('pollaHeader');

		let loading = presentLoading(this.loadingCtrl);
		this.pollaProvider.getPollaRankingByPollaId(pollaHeader.pollaId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.pollaParticipantList = res.body;
			},
			err => {
				loading.dismiss();
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	segmentChanged() {}
}
