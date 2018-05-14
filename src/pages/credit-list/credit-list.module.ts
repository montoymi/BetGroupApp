import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { CreditListPage } from './credit-list';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
	declarations: [
		CreditListPage
	],
	imports: [
		IonicPageModule.forChild(CreditListPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		CreditListPage
	]
})
export class CreditListPageModule {}
