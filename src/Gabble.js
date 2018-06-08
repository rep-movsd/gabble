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
      arrBoard: [],    // Grid with letters
      arrBads:  [],    // Grid with semaphore of bad tiles
      placed: true, // Whether the last word has been placed
      dctWord: {},
      dctBlankXY: {},   // Dict/Set of which squares have blanks
      invalid: false
    };

    // arrBoard contains the actual letter grid
    for(let n = 0; n < 15; ++ n)
    {
      this.state.arrBoard.push(new Array(15).fill(''));
    }

    // bads contains the invalid tiles
    for(let n = 0; n < 15; ++ n)
    {
      this.state.arrBads.push(new Array(15).fill(0));
    }

    this.elemXHeader =
      <tr>
        {
          [...Array(16).keys()]
            .map
            (
              (e, i) =>
                <td style={Styles.boardXYIndex} key={i}>
                  {i ? String.fromCharCode(i + 64) : ' '}
                </td>
            )
        }
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
  // Returns the character on the board if any that
  // follows the last letter of this word
  // coords start at 1, 1
  place = (sWord, iX, iY, bVert, blanks) =>
  {
    const iLen = sWord.length;
    let iiX = iX, iiY = iY;
    let arrBoard = this.state.arrBoard;
    let bAnchored = false;
    const dctBlankXY = {};

    // Append the characters onto the board array elements
    // We use append to allow overlaps
    for(let n = 0; n < iLen; ++n)
    {
      // Append
      arrBoard[iiY][iiX] += sWord[n];

      // If same char twice, its anchored
      if(arrBoard[iiY][iiX][0] === arrBoard[iiY][iiX][1])
      {
        bAnchored = true;
      }

      dctBlankXY[iiX + ':' + iiY] = blanks[n];

      // Move to next slot
      if(bVert) ++iiY; else ++iiX;
    }

    // Update view, set placed mode false, so word can be moved
    this.setState({arrBoard, dctBlankXY, placed: false, dctWord: {sWord, iX, iY, bVert, bAnchored}});

    // get the succeeding letter if any and return it
    if(iiX < 15 && iiY < 15)
    {
      return arrBoard[iiY][iiX];
    }
  }

  // Remove last word, needed for moving a word
  unPlace = () =>
  {
    const dctWord = this.state.dctWord;
    if(dctWord.sWord != null)
    {
      const iLen = dctWord.sWord.length;

      let arrBoard = [...this.state.arrBoard];
      let iX = dctWord.iX, iY = dctWord.iY;

      // Go over each slot and chop the rightmost char
      for(let n = 0; n < iLen; ++n)
      {
        // Chop last letter
        arrBoard[iY][iX] = arrBoard[iY][iX].slice(0, -1);

        // Move to next slot
        if(dctWord.bVert) ++iY;
        else ++iX;
      }

      this.setState({arrBoard, dctWord: {sWord: null}});
    }
  }

  // Invalidates a range of letters (appears in orange red)
  invalidate = (iLen, iX, iY, bVert, bInvalidate) =>
  {
    let arrBads = [...this.state.arrBads];
    for(let n = 0; n < iLen; ++n)
    {
      arrBads[iY][iX] += bInvalidate ? 1 : -1;
      if(bVert) ++iY; else ++iX;
    }
    this.setState({arrBads});
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
    if(!this.state.placed && this.state.dctWord)
    {
      const dctWord = this.state.dctWord;
      const iLen = dctWord.sWord.length;
      let iX = dctWord.iX, iY = dctWord.iY;
      const blanks = [...this.state.blanks];

      // Get the increments
      const arrIncr = Gabble.dctKeyIncr[evt.key];

      // Valid movement
      if(arrIncr)
      {
        // Apply
        iX += arrIncr[0];
        iY += arrIncr[1];

        // Will it fit and is it not anchored , then move the word
        if(!this.state.dctWord.bAnchored && this.doesFit(iLen, iX, iY, dctWord.bVert))
        {
          this.unPlace(dctWord);
          const chPossible = this.place(dctWord.sWord, iX, iY, dctWord.bVert, blanks);

          // Return the word if successfully moved
          return {sWord: dctWord.sWord, iX, iY, bVert: dctWord.bVert, chPossible};
        }
        else // wiggle the board, and make the letters red
        {
          this.setState({invalid: true});
          this.invalidate(iLen, dctWord.iX,  dctWord.iY, dctWord.bVert, true);

          setTimeout
          (
            ()=>
            {
              this.setState({invalid: false});
              this.invalidate(iLen, dctWord.iX,  dctWord.iY, dctWord.bVert, false);
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
    if(this.state.arrBads[y][x] > 0)
    {
      return Styles.boardTileBad;
    }

    // If this letter is the start of the word, and word is empty
    // set "current tile" style
    if(this.state.dctWord.sWord != null &&
       this.state.dctWord.sWord.length === 0 &&
       this.state.dctWord.iX === x &&
       this.state.dctWord.iY === y)
    {
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

            <td style={Styles.boardXYIndex}>{y+1}</td>

            {
              row.map
              (
                (col, x) =>
                {
                  // create the hint string
                  const hint = String.fromCharCode(65 + x) + ',' + (y + 1);

                  // Get ths style to draw
                  const sTile = this.state.arrBoard[y][x];
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
