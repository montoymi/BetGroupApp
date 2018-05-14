import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { Credit } from '../../models/credit/credit';
import { presentToast } from '../pages';

@IonicPage()
@Component({
	selector: 'page-credit-list',
	templateUrl: 'credit-list.html'
})
export class CreditListPage {
	credit: Credit;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public userProvider: UserProvider,
		public creditProvider: CreditProvider,
		public logger: EventLoggerProvider
	) {
		this.logger.logEvent(this.navCtrl.getActive().name, 'credit_list', null);
	}

	// Runs when the page is about to enter and become the active page.
	// Se actualiza la lista por las opciones adicionar créditos y cobrar créditos.
	ionViewWillEnter() {
		this.loadCreditSummary();
	}

	loadCreditSummary() {
		this.creditProvider.getCreditSummaryByUserId(this.userProvider.user.userId).subscribe(
			(res: any) => {
				this.credit = res.body;
			},
			err => {
				presentToast(this.toastCtrl, err.message);
			}
		);
	}

	openCreditAddPage() {
		this.navCtrl.push('CreditAddPage');
	}

	openCreditCollectPage() {
		this.navCtrl.push('CreditCollectPage', { credit: this.credit });
	}
}
