import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	// URL del servicio web.
	//static wsUrl = 'http://localhost:8080/betgroup-ws';
	static wsUrl = 'http://vmi143234.contaboserver.net:8080/betgroup-ws';

	// Your Braintree `Tokenization Key` from the Braintree dashboard.
	static BRAINTREE_TOKEN = 'sandbox_7rbxj8gk_c5qqz5wfyssw5n2b';

	// URl para descarga la app del google play. 
	static storeUrl = 'https://play.google.com/store/apps/details?id=com.kinielasports';
}
