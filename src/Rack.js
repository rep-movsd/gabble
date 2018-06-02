import React, {Component} from 'react';

import {Styles} from './Styles';

export default class Rack extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      rack: [],  // current 7 letters
      vert: false,
      x: 0,
      y: 0,
      word: ''
    };

    this.wild = {}; // What letters are the wildcards representing
    this.word = '';
  }

  // Get ref to bag and board component
  setBag = (bag) => this.bag = bag;
  setBoard = (board) => this.board = board;

  // Fills from the bag onto the rack till rack has 7 tiles or bag is empty
  fill()
  {
    // Fetch from bag to rack, concat to rack
    let tiles = this.bag.fetch(7 - this.state.rack.length);
    let rack = this.state.rack.concat(tiles);

    // Update the rack
    this.setState({rack});
  }

  // Parses out the Y co-ord at pos in  word
  // returns [num, count] where
  // count is number of chars consumed
  // num is clamped to 0 to 14
  parseY = (word, pos) =>
  {
    let count = 0, num = 0;
    const digit1 = parseInt(word[pos]);
    const digit2 = parseInt(word[pos + 1]);

    if(!isNaN(digit1))
    {
      ++count;
      num = digit1;

      // If second char is a digit, grab it
      if(!isNaN(digit2))
      {
        ++count;
        num = num * 10 + digit2;

        // Clamp to 14
        if(num > 14) num = 14;
      }
    }

    return {num, count};
  }

  // Parses out the X co-ord at pos in word (A to P)
  // returns {num, count} where
  // count is number of chars consumed (0 or 1)
  // num is clamped to 0 to 14
  parseX = (word, pos) =>
  {
    let num = 0, count = 0;
    let x = this.word.charCodeAt(pos) - 65
    if(x >= 0 && x <= 14)
    {
      num = x;
      ++count;
    }

    return {num, count};
  }

  onKeyDown = (evt) =>
  {
    //idx = this.state.left.indexOf(' ');

    // Accumulate the word
    this.word += evt.key.toUpperCase();

    // A valid co-ord can be like 1A A1 12A A12
    const iLen = this.word.length;

    // Try grabbing 1 or 2 digits, if there were, grab A to P as X co-ord
    let dctY = this.parseY(this.word, 0);
    let dctX = this.parseX(this.word, dctY.count)

    let x = 0, y = 0;
    let vert = false;

    // If we got a Y co-ord first, its a vertical
    if(dctY.count)
    {
      vert = true;
      y = dctY.num;
    }
    else
    {
      // Try again for Y after X (horizontal)
      dctY = this.parseY(this.word, dctX.count)
      y = dctY.num;
    }

    x = dctX.num;

    let sWord = this.word.substr(dctX.count + dctY.count);

    this.setState({x, y, vert, word: this.word});

    this.board.unPlace();
    this.board.place(sWord, x, y, vert);
  }

  render()
  {
    return (
      <div ref='rack' style={{display: 'flex', flexDirection: 'column'}}>
        <div style={Styles.Rack}>
        {
          this.state.rack.map
          (
            (e, i) =>
            <div key={i} style={Styles.rackTile}>
              <div style={Styles.Tile}>
                {e}
              </div>
            </div>
          )
        }
        </div>

        <div>{this.state.word}</div>
      </div>
    );

  }
}

