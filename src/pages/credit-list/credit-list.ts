import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { Credit } from '../../models/credit/credit';
import { presentToast, presentLoading } from '../pages';

@IonicPage()
@Component({
	selector: 'page-credit-list',
	templateUrl: 'credit-list.html'
})
export class CreditListPage {
	credit: Credit;

	private creditStatusPending: string;
	private creditStatusApproved: string;
	private creditStatusCancelled: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		public translate: TranslateService,
		public userProvider: UserProvider,
		public creditProvider: CreditProvider,
		public logger: EventLoggerProvider,
		public loadingCtrl: LoadingController
	) {
		this.translate.get(['CREDIT_STATUS_PENDING', 'CREDIT_STATUS_APPROVED', 'CREDIT_STATUS_CANCELLED']).subscribe(values => {
			this.creditStatusPending = values['CREDIT_STATUS_PENDING'];
			this.creditStatusApproved = values['CREDIT_STATUS_APPROVED'];
			this.creditStatusCancelled = values['CREDIT_STATUS_CANCELLED'];
		});
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	// Runs when the page is about to enter and become the active page.
	// Actualiza la página por las opciones adicionar créditos y cobrar créditos.
	ionViewWillEnter() {
		this.logger.logEvent(this.navCtrl.getActive().name, 'credit_list', null);

		this.loadCreditSummary();
	}

	loadCreditSummary() {
		let loading = presentLoading(this.loadingCtrl);
		this.creditProvider.getCreditSummaryByUserId(this.userProvider.user.userId).subscribe(
			(res: any) => {
				loading.dismiss();
				this.credit = res.body;

				// Se asigna la descripción del estado.
				if (this.credit.creditDetailList) {
					for (const creditDetail of this.credit.creditDetailList) {
						switch (creditDetail.status) {
							case 0:
								creditDetail.statusDescription = this.creditStatusPending;
								break;
							case 1:
								creditDetail.statusDescription = this.creditStatusApproved;
								break;
							case 2:
								creditDetail.statusDescription = this.creditStatusCancelled;
								break;
						}
					}
				}
			},
			err => {
				loading.dismiss();
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
