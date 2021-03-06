import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, MenuController, Events } from 'ionic-angular';

import { UserProvider } from '../../providers/providers';
import { User } from '../../models/account/user';

interface PageInterface {
	title: string;
	subtitle: string;
	component: any;
	icon: string;
}

@IonicPage()
@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html'
})
export class MenuPage {
	// A reference to the ion-nav in our component
	@ViewChild(Nav) nav: Nav;

	adminPageList: PageInterface[] = [
		{ title: 'HOME_TITLE', subtitle: 'HOME_SUBTITLE', component: 'HomePage', icon: 'home' },
		{ title: 'GAME_LIST_TITLE', subtitle: 'GAME_LIST_SUBTITLE', component: 'GameListPage', icon: 'star' },
		{ title: 'GAME_AVAILABLE_LIST_TITLE', subtitle: 'GAME_AVAILABLE_LIST_SUBTITLE', component: 'GameAvailableListPage', icon: 'search' },
		{ title: 'BET_MATCH_LIST_TITLE', subtitle: 'BET_MATCH_LIST_SUBTITLE', component: 'BetMatchListPage', icon: 'trending-up' },
		{ title: 'GAME_SAVE_TITLE', subtitle: 'GAME_SAVE_SUBTITLE', component: 'GameSavePage', icon: 'add-circle' },
		{ title: 'FRIEND_LIST_TITLE', subtitle: 'FRIEND_LIST_SUBTITLE', component: 'FriendListPage', icon: 'people' },
		{ title: 'CREDIT_LIST_TITLE', subtitle: 'CREDIT_LIST_SUBTITLE', component: 'CreditListPage', icon: 'cash' }
	];

	userPageList: PageInterface[] = [
		{ title: 'HOME_TITLE', subtitle: 'HOME_SUBTITLE', component: 'HomePage', icon: 'home' },
		{ title: 'GAME_LIST_TITLE', subtitle: 'GAME_LIST_SUBTITLE', component: 'GameListPage', icon: 'star' },
		{ title: 'GAME_AVAILABLE_LIST_TITLE', subtitle: 'GAME_AVAILABLE_LIST_SUBTITLE', component: 'GameAvailableListPage', icon: 'search' },
		{ title: 'BET_MATCH_LIST_TITLE', subtitle: 'BET_MATCH_LIST_SUBTITLE', component: 'BetMatchListPage', icon: 'trending-up' },
		{ title: 'FRIEND_LIST_TITLE', subtitle: 'FRIEND_LIST_SUBTITLE', component: 'FriendListPage', icon: 'people' },
		{ title: 'CREDIT_LIST_TITLE', subtitle: 'CREDIT_LIST_SUBTITLE', component: 'CreditListPage', icon: 'cash' }
	];

	secondaryPageList: PageInterface[] = [
		{ title: 'SHARE_APP_TITLE', subtitle: 'SHARE_APP_SUBTITLE', component: 'ShareAppPage', icon: 'share' },
		{ title: 'CONTACT_US_TITLE', subtitle: 'CONTACT_US_SUBTITLE', component: 'ContactUsPage', icon: 'help-circle' },
		{ title: 'SETTINGS_TITLE', subtitle: 'SETTINGS_SUBTITLE', component: 'SettingsPage', icon: 'settings' },
		{ title: 'TUTORIAL_TITLE', subtitle: 'TUTORIAL_SUBTITLE', component: 'TutorialPage', icon: 'school' },
		{ title: 'LOG_OUT_TITLE', subtitle: 'LOG_OUT_SUBTITLE', component: 'WelcomePage', icon: 'exit' }
	];

	rootPage: any = 'HomePage';

	user: User;

	constructor(public navCtrl: NavController, private userProvider: UserProvider, public menu: MenuController, public events: Events) {
		this.user = userProvider.user;

		/*
		 * Eventos para actualizar la sección del perfil.
		 */

		events.subscribe('user:login', user => {
			this.user = user;
		});

		events.subscribe('user:logout', () => {
			this.user = null;
		});
	}

	// Runs when the page is about to enter and become the active page.
	// Necesario para actualizar el menú.
	ionViewWillEnter() {
		// Muestra el menu según el tipo de usuario.
		if (this.user && this.user.userType == 'ADMIN') {
			this.menu.enable(true, 'adminMenu');
		} else {
			this.menu.enable(true, 'userMenu');
		}
	}

	openPage(page: PageInterface) {
		if (page.component == 'WelcomePage') {
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
