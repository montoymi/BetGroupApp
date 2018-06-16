import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, Refresher } from 'ionic-angular';

import { UserProvider, CreditProvider, EventLoggerProvider } from '../../providers/providers';
import { Credit } from '../../models/credit/credit';
import { presentToast } from '../../utils/utils';

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
		public logger: EventLoggerProvider
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

	// Runs when the page has loaded. This event is NOT fired on
	// entering a view that is already cached.
	ionViewDidLoad() {
		this.loadCreditSummary(null);

		this.logger.logEvent(this.navCtrl.getActive().name, 'credit_list', null);
	}

	loadCreditSummary(refresher: Refresher) {
		this.creditProvider.getCreditSummaryByUserId(this.userProvider.user.userId).subscribe(
			(res: any) => {
				if (refresher) refresher.complete();
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
				if (refresher) refresher.complete();
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
