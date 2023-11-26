import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { WordsObject } from '../game/game.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  apiResponse: any; // Your API response goes here
  nextFreeDate: string;
  newWords: WordsObject = {};
  firstCategory: FormGroup;
  secondCategory: FormGroup;
  thirdCategory: FormGroup;
  fourthCategory: FormGroup;
  constructor(private db: AngularFireDatabase, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.firstCategory = this.fb.group({
      latinCategory: ['', Validators.required],
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
    });

    this.secondCategory = this.fb.group({
      latinCategory: ['', Validators.required],
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
    });

    this.thirdCategory = this.fb.group({
      latinCategory: ['', Validators.required],
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
    });

    this.fourthCategory = this.fb.group({
      latinCategory: ['', Validators.required],
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
    });

    const words = this.db.object(`/words`).valueChanges().subscribe(res => { console.log(res); this.apiResponse = res; this.findNextFreeDate(res) })
  }

  findNextFreeDate(apiResponse: any) {
    const dateStrings = Object.keys(apiResponse);

    // Convert date strings to Date objects
    const dateObjects = dateStrings.map(dateString => new Date(dateString));

    // Get the last date
    const lastDate = dateObjects[dateObjects.length - 1];

    // Calculate the next date by adding one day (86400000 milliseconds) to the last date
    const nextDate = new Date(lastDate.getTime() + 86400000);

    // Format the next date as a string in the 'YYYY-MM-DD' format
    this.nextFreeDate = nextDate.toISOString().split('T')[0];
  }

  saveWords() {
    this.formatWords(this.firstCategory.getRawValue());
    this.formatWords(this.secondCategory.getRawValue());
    this.formatWords(this.thirdCategory.getRawValue());
    this.formatWords(this.fourthCategory.getRawValue());

    console.log(this.newWords)

    const newDatesRef = this.db.object(`/words/${this.nextFreeDate}`);
    newDatesRef.set(this.newWords);
  }

  formatWords(rawValue: any) {
    this.newWords[rawValue.latinCategory] = {
      words: [rawValue.word1, rawValue.word2, rawValue.word3, rawValue.word4],
      categoryName: rawValue.displayCategory
    }

  }
}
