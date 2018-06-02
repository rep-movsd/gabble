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
      bVert: false,
      x: 0,
      iY: 0,
      sChars: '',  // Last typed arrChars, including the co-ord
      sWord: '' // Current word typed
    };

    this.wild = {}; // What letters are the wildcards representing
    this.sChars = '';
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
  // returns [num, count, err] where
  // count is number of arrChars consumed
  // num is parsed number - (1 to 15) goes to (0 to 14)
  // err is true if entered value > 15
  parseY = (sChars, pos) =>
  {
    let count = 0, num = 0, err = false;
    const digit1 = parseInt(sChars[pos]);
    const digit2 = parseInt(sChars[pos + 1]);

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
        if(num > 15) err = true;
      }
    }

    --num;
    return {num, count, err};
  }

  // Parses out the X co-ord at pos in arrChars (A to P)
  // returns {num, count} where
  // count is number of arrChars consumed (0 or 1)
  // num is clamped to 0 to 14
  parseX = (sChars, pos) =>
  {
    let num = 0, count = 0, err = false;
    const digit1 = parseInt(sChars[pos]);

    // Check if its not a digit
    if(isNaN(digit1))
    {
      let x = this.sChars.charCodeAt(pos) - 65
      if(x >= 0 && x <= 14)
      {
        num = x;
        ++count;
      }
      else
      {
        err = true;
      }
    }

    return {num, count, err};
  }

  processWord = (sChars) =>
  {
    // Try grabbing 1 or 2 digits, if there were, grab A to P as X co-ord
    let dctY = this.parseY(sChars, 0);
    let dctX = this.parseX(sChars, dctY.count);
    let bVert = false;

    // If we got a Y co-ord first, its a vertical
    if(dctY.count)
    {
      bVert = true;
    }
    else // Try again for Y after X (horizontal)
    {
      dctY = this.parseY(sChars, dctX.count)
    }

    // If no error and both X and Y parsed
    if(!dctY.err && !dctY.err)
    {
      let iX = 0, iY = 0;
      let sWord;

      // Unless there is no Y co-ord treat the whole thing as a word
      if(dctY.count)
      {
        iX = dctX.num;
        iY = dctY.num;
        sWord = sChars.substr(dctX.count + dctY.count);
      }
      else
      {
        sWord = sChars;
      }

      // If the word fits, then update
      if(this.board.doesFit(sWord.length, iX, iY, bVert))
      {
        // Update the word
        this.sChars = sChars;
        this.setState({iX, iY, bVert, sChars, sWord});
        this.board.unPlace();
        this.board.place(sWord, iX, iY, bVert);
      }
    }
  }

  // Accumulate a char into arrChars
  addChar = (evt) =>
  {
    //idx = this.state.left.indexOf(' ');

    let sChars = this.sChars + evt.key.toUpperCase();
    this.processWord(sChars);
  }

  // Remove the last char from arrChars
  delChar = () =>
  {
    if(this.state.sWord.length)
    {
      let sChars = this.sChars.substr(0, this.sChars.length - 1);
      this.processWord(sChars);
    }
  }

  // Clear the chars and word
  clearWord = () =>
  {
    this.sChars = '';
    this.setState({sChars: '', sWord: ''});
    this.board.unPlace();
  }

  // Arrow key
  moveWord = (evt) =>
  {
    // let the board handle it and reconstruct the typed word here
    const dctWord = this.board.moveWord(evt);
    if(dctWord != null)
    {
      const sX = String.fromCharCode(dctWord.iX + 65);
      const sY = (dctWord.iY + 1);
      this.sChars = (dctWord.bVert ? sY + sX : sX + sY) + dctWord.sWord;
      this.setState
      (
        {
          iX: dctWord.iX,
          iY: dctWord.iY,
          bVert: dctWord.bVert,
          sChars: this.sChars,
          sWord: dctWord.sWord
        }
      );
    }
  };

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

        <div>{this.state.sChars}</div>
        <hr/>
        <div>{this.state.sWord}</div>

      </div>
    );

  }
}

