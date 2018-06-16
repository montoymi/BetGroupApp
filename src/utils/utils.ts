import { ToastController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import { DATE_FORMAT_ISO8601_Z, DATE_FORMAT_ISO8601 } from '../constants/constants';

// Se asigna el formato ISO 8601 para poder manejar el dato como fecha con zona horaria.
export function formatISO8601_Z(value) {
	return value != undefined ? moment(value, DATE_FORMAT_ISO8601_Z).format() : value;
}

// Se asigna el formato ISO 8601 para poder manejar el dato como fecha.
export function formatISO8601(value) {
	return value != undefined ? moment(value, DATE_FORMAT_ISO8601).format() : value;
}

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