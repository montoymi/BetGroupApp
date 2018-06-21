import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { UserProvider } from '../../providers/providers';
import { Config } from '../../config';

@IonicPage()
@Component({
	selector: 'page-share-app',
	templateUrl: 'share-app.html'
})
export class ShareAppPage {
	private shareAppMessage: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public userProvider: UserProvider,
		public translate: TranslateService,
		private socialSharing: SocialSharing
	) {
		this.translate.get(['SHARE_APP_MESSAGE']).subscribe(values => {
			this.shareAppMessage = values['SHARE_APP_MESSAGE'];
		});
	}

	ionViewCanEnter(): boolean {
		if (!this.userProvider.user) {
			return false;
		}

		return true;
	}

	share(via: string, fab) {
		let message: string = this.shareAppMessage + ' ' + Config.storeUrl;

		switch (via) {
			case 'facebook':
				this.socialSharing
					.shareViaFacebook(message, null, null)
					.then(() => {
						// Success!
					})
					.catch(() => {
						// Error!
					});

				break;
			case 'twitter':
				this.socialSharing
					.shareViaTwitter(message, null, null)
					.then(() => {
						// Success!
					})
					.catch(() => {
						// Error!
					});

				break;
			case 'whatsapp':
				this.socialSharing
					.shareViaWhatsApp(message, null, null)
					.then(() => {
						// Success!
					})
					.catch(() => {
						// Error!
					});

				break;
		}
	}
}
