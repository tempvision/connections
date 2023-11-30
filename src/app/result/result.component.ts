import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  clipboardResult: any = [];
  clipboardResultTWITTER: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.clipboardResult = this.splitAndReplaceColors();
  }

  splitAndReplaceColors(): string[][] {
    const groupsOfFour: any = [];

    const group = this.data.colors.map((guess: any) => this.mapColorToEmoji(guess));
    groupsOfFour.push(group.join('\n'));
    
    this.clipboardResultTWITTER = groupsOfFour;

    groupsOfFour[0] = groupsOfFour[0] + '\n\nhttps://connections.bg';

    return groupsOfFour;
  }

  // Function to map color to emoji for a single color or an array of colors
  mapColorToEmoji(colors: string | string[]): string | string[] {
    const colorEmojiMap: { [key: string]: string } = {
      '#ADBDFF': '🔵',
      '#FAA381': '🟡',
      '#B74F6F': '🔴',
      '#230C0F': '🟤'
    };

    if (Array.isArray(colors)) {
      return colors.map(color => colorEmojiMap[color] || color).join('|');
    } else {
      return colorEmojiMap[colors] || colors;
    }
  }

  copyToClipboard() {
    this.snackBar.open('Резултатът е копиран!', 'OK✌')
  }
}
