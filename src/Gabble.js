import React, {Component} from 'react';

import {Styles, iTileSize} from './Styles';

export default class Gabble extends Component
{
  constructor(props)
  {
    super(props);

    // Styles for ach type of square
    this.styleValues =
    {
      '0': Styles.Center,
      '2': Styles.DoubleLetter,
      '3': Styles.TripleLetter,
      '@': Styles.DoubleWord,
      '#': Styles.TripleWord,
      ' ': Styles.Normal
    }

    // Array representing the squares status
    this.values =
    [
      ['#', ' ', ' ', '2', ' ', ' ', ' ', '#', ' ', ' ', ' ', '2', ' ', ' ', '#'],
      [' ', '@', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '@', ' '],
      [' ', ' ', '@', ' ', ' ', ' ', '2', ' ', '2', ' ', ' ', ' ', '@', ' ', ' '],
      ['2', ' ', ' ', '@', ' ', ' ', ' ', '2', ' ', ' ', ' ', '@', ' ', ' ', '2'],
      [' ', ' ', ' ', ' ', '@', ' ', ' ', ' ', ' ', ' ', '@', ' ', ' ', ' ', ' '],
      [' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' '],
      [' ', ' ', '2', ' ', ' ', ' ', '2', ' ', '2', ' ', ' ', ' ', '2', ' ', ' '],
      ['#', ' ', ' ', '2', ' ', ' ', ' ', '0', ' ', ' ', ' ', '2', ' ', ' ', '#'],
      [' ', ' ', '2', ' ', ' ', ' ', '2', ' ', '2', ' ', ' ', ' ', '2', ' ', ' '],
      [' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' '],
      [' ', ' ', ' ', ' ', '@', ' ', ' ', ' ', ' ', ' ', '@', ' ', ' ', ' ', ' '],
      ['2', ' ', ' ', '@', ' ', ' ', ' ', '2', ' ', ' ', ' ', '@', ' ', ' ', '2'],
      [' ', ' ', '@', ' ', ' ', ' ', '2', ' ', '2', ' ', ' ', ' ', '@', ' ', ' '],
      [' ', '@', ' ', ' ', ' ', '3', ' ', ' ', ' ', '3', ' ', ' ', ' ', '@', ' '],
      ['#', ' ', ' ', '2', ' ', ' ', ' ', '#', ' ', ' ', ' ', '2', ' ', ' ', '#'],
    ];

    this.state =
    {
      board: [], // Grid with letters
      words: [], // array of words - each is {x, y, bVert}
      bads:    [], // Grid with semaphore of bad tiles
      placed: true, // Whether the last word has been placed
      word: {},
      invalid: false
    };

    // board contains the actual letter grid
    for(let n = 0; n < 15; ++ n)
    {
      this.state.board.push(new Array(15).fill(''));
    }

    // bads contains the invalid tiles
    for(let n = 0; n < 15; ++ n)
    {
      this.state.bads.push(new Array(15).fill(0));
    }

    this.elemXHeader =
      <tr>
        {[...Array(15).keys()].map((e, i) => <td style={Styles.boardXIndex} key={i}>{String.fromCharCode(i + 65)}</td>)}
      </tr>;
  }

  // tells if word fits at the given pos
  doesFit = (iLen, iX, iY, bVert) =>
  {
    if(bVert)
    {
      if(iX === 15) return false;
      if(iY + iLen > 15) return false;
    }
    else
    {
      if(iY === 15) return false;
      if(iX + iLen > 15) return false;
    }

    return !(iX < 0 || iY < 0);
  }

  // place a word at a certain location, in given orientation
  // No boundary checks performed
  place = (sWord, iX, iY, bVert) =>
  {
    const iLen = sWord.length;
    let iiX = iX, iiY = iY;
    let board = this.state.board;

    // Append the characters onto the board array elements
    // We use append to allow overlaps
    for(let n = 0; n < iLen; ++n)
    {
      // Append
      board[iiY][iiX] += sWord[n];

      // Move to next slot
      if(bVert) ++iiY; else ++iiX;
    }

    // Update view, set placed mode false, so word can be moved
    this.setState({board, placed: false, word: {sWord, iX, iY, bVert}});
  }

  // Remove last word, needed for moving a word
  unPlace = () =>
  {
    const word = this.state.word;
    if(word.sWord != null)
    {
      const iLen = word.sWord.length;

      let board = [...this.state.board];
      let iX = word.iX, iY = word.iY;

      // Go over each slot and chop the rightmost char
      for(let n = 0; n < iLen; ++n)
      {
        // Chop last letter
        board[iY][iX] = board[iY][iX].slice(0, -1);

        // Move to next slot
        if(word.bVert) ++iY;
        else ++iX;
      }

      this.setState({board, word: {word: null}});
    }
  }

  // Invalidates a range of letters (appears in orange red)
  invalidate = (iLen, iX, iY, bVert, bInvalidate) =>
  {
    let bads = [...this.state.bads];
    for(let n = 0; n < iLen; ++n)
    {
      bads[iY][iX] += bInvalidate ? 1 : -1;
      if(bVert) ++iY; else ++iX;
    }
    this.setState({bads});
  }

  static dctKeyIncr =
  {
    ArrowRight : [ 1,  0],
    ArrowLeft  : [-1,  0],
    ArrowUp    : [ 0, -1],
    ArrowDown  : [ 0,  1],
  };

  // Board move key handler
  moveWord = (evt) =>
  {
    if(!this.state.placed && this.state.word)
    {
      const word = this.state.word;
      const iLen = word.sWord.length;
      let iX = word.iX, iY = word.iY;

      // Get the increments
      const arrIncr = Gabble.dctKeyIncr[evt.key];
      if(arrIncr)
      {
        // Apply
        iX += arrIncr[0];
        iY += arrIncr[1];

        // Will it fit, then move the word
        if(this.doesFit(iLen, iX, iY, word.bVert))
        {
          this.unPlace(word);
          this.place(word.sWord, iX, iY, word.bVert);

          // Return the word if successfully moved
          return {sWord: word.sWord, iX, iY, bVert: word.bVert};
        }
        else // wiggle the board, and make teh letters red
        {
          this.setState({invalid: true});
          this.invalidate(iLen, word.iX,  word.iY, word.bVert, true);

          setTimeout
          (
            ()=>
            {
              this.setState({invalid: false});
              this.invalidate(iLen, word.iX,  word.iY, word.bVert, false);
            },
            200
          );
        }
      }
    }
  }

  // Gets the style in which the letter at x, y should be drawn
  getLetterStyle = (sTile, x, y) =>
  {
    // Tile marked bad
    if(this.state.bads[y][x] > 0)
    {
      return Styles.boardTileBad;
    }

    if(this.state.word.sWord != null && this.state.word.sWord.length == 0 && this.state.word.iX === x && this.state.word.iY === y)
    {
      console.log('curr');
      return Styles.boardTileCurr;
    }

    // Empty slot
    if(sTile === '')
    {
      return {width: iTileSize, height: iTileSize};
    }

    // Non overlapped or overlap with same letter
    if(sTile.length === 1 || (sTile.length === 2 && sTile[0] === sTile[1]))
    {
      return Styles.Tile;
    }


    // Overlapped - bad tile
    return Styles.boardTileBad
  }

  render()
  {
    const elemTiles = this.values.map
    (
      (row, y) =>
      {
        return (
          <tr key={y}>
          {
            row.map
            (
              (col, x) =>
              {
                // create the hint string
                const hint = String.fromCharCode(65 + x) + ',' + (y + 1);

                // Get ths style to draw
                const sTile = this.state.board[y][x];
                const styleLetter = this.getLetterStyle(sTile, x, y);

                return (
                  <td key={x} style={{...this.styleValues[col], ...Styles.boardTD}} title={hint}>
                    <div style={styleLetter}>
                      <div style={{lineHeight: iTileSize +'px'}}>
                        <div style={Styles.boardLetter}>
                          {sTile[0]}
                        </div>
                      </div>
                    </div>
                  </td>
                );
              }
            )
          }
          </tr>
        );
      }
    );

    return (
      <div>
        <table className={this.state.invalid ? 'shake' : 'noshake'}
               style={Styles.boardTable} ref='board'>
          <tbody>
            {this.elemXHeader}
            {elemTiles}
          </tbody>
        </table>
      </div>
    );
  }
}
