import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  clipboardResult: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.clipboardResult = this.splitAndReplaceColors();
  }

  splitAndReplaceColors(): string[][] {
    const groupsOfFour: any = [];

    // for (let i = 0; i < this.data.colors.length; i += 4) {
      const group = this.data.colors.map((guess: any) => this.mapColorToEmoji(guess));
      groupsOfFour.push(group.join('\n'));
    // }

    groupsOfFour[0] = groupsOfFour[0] +'\n\nhttps://connections-bg.web.app';

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
}
