import { ToastController, LoadingController } from 'ionic-angular';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = 'TutorialPage';

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = 'MenuPage';

// Tabs del detalle del juego.
export const GameTab1Root = 'GameDetailPage';
export const GameTab2Root = 'ParticipantListPage';
export const GameTab3Root = 'FriendInvitePage';
export const GameTab4Root = 'GameBetListPage';
export const GameTab5Root = 'AwardsPage';
export const GameTab6Root = 'RankingListPage';

// Tabs del detalle del juego disponible.
export const GameAvailableTab1Root = 'GameAvailableDetailPage';
export const GameAvailableTab2Root = 'GameMatchListPage';
export const GameAvailableTab3Root = 'ParticipantListPage';
export const GameAvailableTab4Root = 'ParticipantSavePage';

export function presentToast(toastCtrl: ToastController, message: string) {
	if (message.search("Http failure") == 0) {
		message = "Ocurrió un error en el servidor. Pongase en contacto con su administrador de sistemas";
	}

	let toast = toastCtrl.create({
		message: message,
		duration: 5000,
		position: 'bottom'
	});
	toast.present();
}

export function presentLoading(loadingCtrl: LoadingController) {
	let loading = loadingCtrl.create();
	loading.present();
	return loading;
}

export function getFlagValue(value) {
	return !value ? 0 : 1;
}