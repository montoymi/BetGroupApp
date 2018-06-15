import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	//static wsUrl = 'http://localhost:8080/betgroup-ws';
	static wsUrl = 'http://vmi143234.contaboserver.net:8080/betgroup-ws';

	// Paypal
	static payPalEnvironmentSandbox = 'AXdYE5KUxxqSugmhw1wccZ4MxinNerlsgApRhzEHl8MrrXbnW61p_LXajPDGIfcV0o1y0kxKUGrbxSxw';
	static payPalEnvironmentProduction = 'AYoLzSxjNAY83LmYw_USPHsuwubSnaieK73B_j45YdMg1DaipIz9wNcc2WsZ_2WT1EZI_BWPKPmp9XKH';
}
