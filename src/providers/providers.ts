import { Api } from './api/api';
import { Settings } from './settings/settings';
import { EventLoggerProvider } from './event-logger/event-logger';
import { UserProvider } from './data/user-provider';
import { ParamValueProvider } from './data/param-value';
import { TemplateProvider } from './data/template-provider';
import { PollaProvider } from './data/polla-provider';
import { CreditProvider } from './data/credit-provider';
import { FriendProvider } from './data/friend-provider';
import { MatchProvider } from './data/match-provider';

import * as moment from 'moment';
import { DATE_FORMAT_ISO8601 } from '../constants/constants';

export {
    Api,
	Settings,
	EventLoggerProvider,
	UserProvider,
	ParamValueProvider,
	TemplateProvider,
	PollaProvider,
	CreditProvider,
	FriendProvider,
	MatchProvider
};

// Se asigna el formato ISO 8601 para poder manejar el dato como fecha.
export function formatISO8601(value) {
	return value != undefined ? moment(value, DATE_FORMAT_ISO8601).format() : value;
}
