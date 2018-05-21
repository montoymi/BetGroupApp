import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, Events } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';

interface PageInterface {
	title: string;
	subtitle: string;
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
			{ title: 'GAME_LIST_TITLE', subtitle: 'GAME_LIST_SUBTITLE', component: 'GameListPage', icon: 'star' },
			{ title: 'GAME_AVAILABLE_LIST_TITLE', subtitle: 'GAME_AVAILABLE_LIST_SUBTITLE', component: 'GameAvailableListPage', icon: 'star-outline' },
			{ title: 'BET_MATCH_LIST_TITLE', subtitle: 'BET_MATCH_LIST_SUBTITLE', component: 'BetMatchListPage', icon: 'trending-up' },
			{ title: 'GAME_SAVE_TITLE', subtitle: 'GAME_SAVE_SUBTITLE', component: 'GameSavePage', icon: 'add-circle' },
			{ title: 'FRIEND_LIST_TITLE', subtitle: 'FRIEND_LIST_SUBTITLE', component: 'FriendListPage', icon: 'people' },
			{ title: 'CREDIT_LIST_TITLE', subtitle: 'CREDIT_LIST_SUBTITLE', component: 'CreditListPage', icon: 'cash' }
		];

		this.pageList2 = [
			{ title: 'CONTACT_US_TITLE', subtitle: 'CONTACT_US_SUBTITLE', component: 'ContactUsPage', icon: 'help-circle' },
			{ title: 'SETTINGS_TITLE', subtitle: 'SETTINGS_SUBTITLE', component: 'SettingsPage', icon: 'settings' },
			{ title: 'TUTORIAL_TITLE', subtitle: 'TUTORIAL_SUBTITLE', component: 'TutorialPage', icon: 'school' },
			{ title: 'LOG_OUT_TITLE', subtitle: 'LOG_OUT_SUBTITLE', component: 'LoginPage', icon: 'exit' }
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
