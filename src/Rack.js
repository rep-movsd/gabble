import React, {Component} from 'react';

import {Styles} from './Styles';
import Beep from './Beep';

const BLANK = ' '; // &NBSP;

export default class Rack extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      arrRack: [],         // current letters
      arrPlayed: [],       // whats been arrPlayed
      arrBlanks: [],       // bool array of whether arrPlayed char is a blank

      bVert: false,
      iX: 0,
      iY: 0,
      sChars: '',       // Last typed arrChars, including the co-ord
      sWord: '',        // Current word typed
      chPossible: null, // Letter on the board after the cursor

      bHasCoOrd: false, // Have we got the co-ords yet
    };

    this.sChars = '';
    this.nBlanks = 0;       // Number of wildcards we have
    this.nBlanksUsed = 0;   // Number of wildcards we used
  }

  // Get ref to bag and board component
  setBag = (bag) => this.bag = bag;
  setBoard = (board) => this.board = board;

  // Fills from the bag onto the arrRack till arrRack has 7 tiles or bag is empty
  fill()
  {
    // Fetch from bag to arrRack, concat to arrRack
    let tiles = this.bag.fetch(7 - this.state.arrRack.length);
    let arrRack = this.state.arrRack.concat(tiles);

    // Note how many arrBlanks we drew (string literal is &nbsp;)
    this.nBlanks = tiles.reduce((n, val) => n + (val === BLANK), 0);
    this.nBlanksUsed = 0;

    // Update the arrRack and the
    this.setState({arrRack});
  }

  // Parses out the Y co-ord at pos in  word
  // returns [num, count, err] where
  // count is number of arrChars consumed
  // num is parsed number - (1 to 15) goes to (0 to 14)
  // err is true if entered value > 15
  parseY = (sChars, pos) =>
  {
    let count = 0, num = 0, err = false;

    // No parse if at end
    if(pos < sChars.length)
    {
      const digit1 = parseInt(sChars[pos]);
      const digit2 = parseInt(sChars[pos + 1]);

      if(!isNaN(digit1) && digit1 != 0)
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

        num--;
      }
      else
      {
        err = true;
      }
    }

    return {num, count, err};
  }

  // Parses out the X co-ord at pos in arrChars (A to P)
  // returns {num, count} where
  // count is number of arrChars consumed (0 or 1)
  // num is clamped to 0 to 14
  parseX = (sChars, pos) =>
  {
    let num = 0, count = 0, err = false;

    // Dont parse empty string
    if(pos < sChars.length)
    {
      const digit1 = parseInt(sChars[pos]);

      // Check if its not a digit
      if(isNaN(digit1))
      {
        let iX = sChars.charCodeAt(pos) - 65
        if(iX >= 0 && iX <= 14)
        {
          num = iX;
          ++count;
        }
        else
        {
          err = true;
        }
      }
    }

    return {num, count, err};
  }

  grabCoOrd = (sChars) =>
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

    return {dctX, dctY, bVert};
  }

  onInsert = () =>
  {
    if(!this.state.bHasCoOrd)
    {
      this.setState({bHasCoOrd: true});
    }
  }

  // Alphanumeric key pressed
  onKey = (evt) =>
  {
    const ch = evt.key.toUpperCase();
    const sChars = this.sChars + ch;

    // Try getting some co-ords
    if(!this.state.bHasCoOrd)
    {
      const dctGrab = this.grabCoOrd(sChars);

      // Did whole thing parse?
      const bAllParsed = sChars.length === dctGrab.dctY.count + dctGrab.dctX.count;

      const iX = dctGrab.dctX.num;
      const iY = dctGrab.dctY.num;
      const bVert = dctGrab.bVert;

      // If it parsed ok
      if(bAllParsed && !dctGrab.dctY.err && !dctGrab.dctX.err)
      {
        this.sChars = sChars;
        const chPossible = this.board.place('', iX, iY, bVert, []);

        this.setState({iX, iY, bVert, chPossible});

        // If it's impossible to add more to the co-ordinate next, go to insert mode
        // If its vertical, that means X follows Y like 15D, so its done
        // if Y follows X like D 15, were done if there are 2 digits
        if(dctGrab.dctX.count > 0 && (dctGrab.bVert || dctGrab.dctY.count > 1))
        {
          this.onInsert();
        }

        return;
      }
    }
    else // Append a char to the word
    {
      // Test if this char can be typed
      const bOnBoard = this.state.chPossible === ch;        // Is it on the board
      const bOnRack = this.state.arrRack.indexOf(ch) >= 0;  // Is it in the arrRack
      const bBlank = (this.nBlanksUsed < this.nBlanks) &&
                     (evt.key !== ch);                      // Is it lowercase and we have a blank

      if(bOnBoard || bOnRack || bBlank)
      {
        const sWord = this.state.sWord + ch;
        const chPossible = this.board.place(sWord, this.state.iX, this.state.iY, this.state.bVert, []);
        this.setState({sWord, chPossible});
        return;
      }
    }

    // Default action is to beep (error)
    Beep();

  }

  clearWord = () =>
  {
    this.sChars = '';
    this.setState({iX: 0, iY: 0, bHasCoOrd: false});
  }

  render()
  {
    const sX = String.fromCharCode(this.state.iX + 65);
    return (
      <div ref='rack' style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{fontSize: 'x-small'}}>
          Optionally type a coordinate like M12 or 11A and press Space to start typing the word<br/>
          Move word into place on board with cursor keys<br/>
          Press enter to place word.
        </div>

        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={Styles.RackXY}>
            {this.state.bVert ? this.state.iY : sX}
          </div>
          <div style={Styles.RackXY}>
            {this.state.bVert ? sX : this.state.iY}
          </div>

          &nbsp;

          <div style={Styles.Rack}>
          {
            this.state.arrRack.map
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
        </div>

        <div>{this.state.sChars}</div>
        <hr/>
        <div>{this.state.sWord}</div>

      </div>
    );

  }
}

/*

processWord = (sChars, newCh) =>
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
      this.board.unPlace();
      const chPossible = this.board.place(sWord, iX, iY, bVert, this.state.arrBlanks);
      this.setState({iX, iY, bVert, sChars, sWord, chPossible});
    }
  }
}
* /




// Accumulate a char into arrChars
addChars = (evt) =>
{
  const ch = evt.key.toUpperCase();
  const nBlanksLeft = this.nBlanks - this.nBlanksUsed;

  const bOnBoard = this.state.chPossible === ch;      // Is it on the board
  const bOnRack = this.state.arrRack.indexOf(ch) >= 0;   // Is it in the arrRack
  const bLowerCase = evt.key !== ch;                   // Is it a lowercase letter

  const bCanPlay = bOnBoard || bOnRack || (bLowerCase && nBlanksLeft > 0);
  if(bCanPlay)
  {
    // Append the char and process the word
    let sChars = this.sChars + ch;
    this.processWord(sChars);

    // Move the last char from arrRack to arrPlayed, update blanks count
    // Set if this letter was a blank in arrBlanks
    const arrPlayed = [...this.state.arrPlayed, ch];
    const arrRack = [...this.state.arrRack];
    const arrBlanks = [...this.state.arrBlanks];

    // If it was a blank that went
    if(!bOnBoard && !bOnRack && (bLowerCase && nBlanksLeft > 0))
    {
      this.nBlanksUsed++;
      arrRack.splice(arrRack.indexOf(BLANK), 1);
      arrRack.splice(arrRack.indexOf(BLANK), 1);
      arrBlanks.push(true);
    }
    else
    {
      arrRack.splice(arrRack.indexOf(ch), 1);
      arrBlanks.push(false);
    }

    this.setState({arrRack, arrPlayed, arrBlanks});
  }
}

// Remove the last char from arrChars
delChar = () =>
{
  if(this.state.sWord.length)
  {
    // Chop the last letter and process it
    let ch = this.sChars[this.sChars.length - 1];
    let sChars = this.sChars.substr(0, this.sChars.length - 1);
    this.processWord(sChars);

    // Did we delete a blank or a letter?
    const arrPlayed = [...this.state.arrPlayed, ch];
    const arrRack = [...this.state.arrRack];
    const arrBlanks = [...this.state.arrBlanks];

    // put a blank or the letter itself back on the rack
    arrPlayed.pop();
    arrRack.push(arrBlanks.pop() ? BLANK : ch);

    this.setState({arrRack, arrPlayed, arrBlanks});
  }
}

// Clear the chars and word
clearWord = () =>
{
  this.sChars = '';
  this.nBlanksUsed = 0;

  // Re-rack
  const arrRack = this.state.arrRack.concat(this.state.arrPlayed);
  this.setState({arrRack, sChars: '', sWord: '', arrPlayed: [], arrBlanks: []});
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
    dctWord.sChars = this.sChars;

    this.setState(dctWord);
  }
};

*/
