import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Api } from '../api/api';
import { Settings } from '../settings/settings';
import { User } from '../../models/account/user';
import { RESPONSE_STATUS } from '../../constants/constants';
import { formatISO8601 } from '../providers';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: STATUS_OK,
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class UserProvider {
	user: User;

	constructor(public api: Api, public settings: Settings, public events: Events, public translate: TranslateService) {
		// Obtiene el usuario de la configuración.
		this.settings.getValue('user').then((user: User) => {
			if (user) {
				this.user = user;
			}
		});
	}

	/**
	 * Send a POST request to our login endpoint with the data
	 * the user entered on the form.
	 */
	login(user: User, keepSession: boolean) {
		let seq = this.api.get('users', user).share();

		seq.subscribe(
			(res: any) => {
				// If the API returned a successful response, mark the user as logged in
				if (res.status == RESPONSE_STATUS.OK) {
					this.loggedIn(res.body, user.password, keepSession);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	/**
	 * Send a POST request to our signup endpoint with the data
	 * the user entered on the form.
	 */
	signup(user: User) {
		let seq = this.api.post('users', user).share();

		seq.subscribe(
			(res: any) => {
				// If the API returned a successful response, mark the user as logged in
				if (res.status == RESPONSE_STATUS.CREATED) {
					this.loggedIn(res.body, user.password, false);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	updateUser(user: User) {
		let seq = this.api.put('users', user).share();

		seq.subscribe(
			(res: any) => {
				if (res.status == RESPONSE_STATUS.CREATED) {
					this.loggedIn(res.body, user.password, false);
				} else {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	changePassword(user: User) {
		let seq = this.api.put('users/passwords', user).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.CREATED) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	forgotPassword(email: string, lang: string) {
		let seq = this.api.get('users/passwords', { email: email, lang: lang }).share();

		seq.subscribe(
			(res: any) => {
				if (res.status != RESPONSE_STATUS.OK) {
					console.info('status', res.status);
				}
			},
			err => {
				console.error('ERROR', err);
			}
		);

		return seq;
	}

	/**
	 * Log the user out, which forgets the session
	 */
	logout() {
		this.user = null;

		// Elimina el usuario de la configuración.
		this.settings.setValue('user', null);

		// Permite actualizar la sección del perfil en el menú.
		this.events.publish('user:logout');
	}

	/**
	 * Process a login/signup response to store user data
	 */
	loggedIn(user: User, password: string, keepSession: boolean) {
		console.info('loggedIn: ' + user.username);
		this.user = user;
		this.user.dateOfBirthday = formatISO8601(this.user.dateOfBirthday);
		this.user.password = password;
		this.user.preferredLang = this.translate.store.currentLang;

		if (keepSession) {
			// Registra el usuario en la configuración.
			this.settings.setValue('user', this.user);
		}

		// Permite actualizar la sección del perfil en el menú.
		this.events.publish('user:login', this.user);
	}
}
