import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { RankingListPage } from './ranking-list';

@NgModule({
	declarations: [
		RankingListPage
	],
	imports: [
		IonicPageModule.forChild(RankingListPage),
		TranslateModule.forChild()
	],
	exports: [
		RankingListPage
	]
})
export class RankingListPageModule {}
