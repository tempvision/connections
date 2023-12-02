import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from '@angular/fire/compat';

import { environment } from 'env/environment';

import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MatDialogModule } from '@angular/material/dialog';
import { RulesComponent } from './rules/rules.component';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { GameModule } from './game/game.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ResultComponent } from './result/result.component';
import { CategoryInfoComponent } from './category-info/category-info.component';



@NgModule({
  declarations: [
    AppComponent,
    RulesComponent,
    ResultComponent,
    CategoryInfoComponent
  ],
  imports: [
    AppRoutingModule,
    // CommonModule,
    BrowserModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatDialogModule,
    GameModule,
    AdminPanelModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
