import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, Events } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';

interface PageInterface {
	title: string;
	component: any;
	icon: string;
}
type PageList = PageInterface[];

@IonicPage()
@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html'
})
export class MenuPage {
	// A reference to the ion-nav in our component
	@ViewChild(Nav) nav: Nav;

	rootPage: any = 'GameListPage';
	pageList1: PageList;
	pageList2: PageList;

	user: User;

	constructor(
		public navCtrl: NavController,
		private userProvider: UserProvider,
		public events: Events
	) {
		this.pageList1 = [
			{ title: 'GAME_SAVE_TITLE', component: 'GameSavePage', icon: 'add-circle' },
			{ title: 'GAME_LIST_TITLE', component: 'GameListPage', icon: 'star' },
			{ title: 'GAME_AVAILABLE_LIST_TITLE', component: 'GameAvailableListPage', icon: 'star-outline' },
			{ title: 'BET_MATCH_LIST_TITLE', component: 'BetMatchListPage', icon: 'trending-up' },
			{ title: 'FRIEND_LIST_TITLE', component: 'FriendListPage', icon: 'people' },
			{ title: 'CREDIT_LIST_TITLE', component: 'CreditListPage', icon: 'cash' }
		];

		this.pageList2 = [
			{ title: 'CONTACT_US_TITLE', component: 'ContactUsPage', icon: 'help-circle' },
			{ title: 'SETTINGS_TITLE', component: 'SettingsPage', icon: 'settings' },
			{ title: 'TUTORIAL_TITLE', component: 'TutorialPage', icon: 'school' },
			{ title: 'LOG_OUT_TITLE', component: 'LoginPage', icon: 'exit' }
		];

		this.user = userProvider.user;

		/*
		 * Eventos para actualizar la sección del perfil.
		 */

		events.subscribe('user:login', (user) => {
			this.user = user;
		});

		events.subscribe('user:logout', () => {
			this.user = null;
		});
	}

	openPage(page: PageInterface) {
		if (page.component == 'LoginPage') {
			// Cierra la sessión actual.
			this.userProvider.logout();
		}

		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	openUserDetailPage() {
		this.nav.setRoot('UserDetailPage');
	}

	isActive(page: PageInterface) {
		if (this.nav.getActive() && this.nav.getActive().name === page.component) {
			return 'primary';
		}

		return;
	}
}
