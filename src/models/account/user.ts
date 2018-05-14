import { Friend } from './friend';

export class User {
	userId: number;
	username: string;
	password: string;
	email: string;
	token: string;
	status: number;
	firstName: string;
	lastName: string;
	dateOfBirthday: any;
	userType: string;
	lastLoginDate: any;
	countLogin: number;
	referredUser: User;
	friendList: Friend[];
	sex: string;
	flagNotification: any;
	countryCode: string;
	preferredLang: string;

	confirmPassword: string;
	photo: string;
}
