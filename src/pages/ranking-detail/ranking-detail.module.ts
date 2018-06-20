import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { RankingDetailPage } from './ranking-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
	declarations: [
		RankingDetailPage
	],
	imports: [
		IonicPageModule.forChild(RankingDetailPage),
		TranslateModule.forChild(),
		PipesModule
	],
	exports: [
		RankingDetailPage
	]
})
export class RankingDetailPageModule {}
