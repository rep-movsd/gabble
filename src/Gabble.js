import React, {Component, PureComponent} from 'react';

import Random from './Random';


const iTileSize = 36;
const iSlotBorder = 2;
const iTileSlotSize = iTileSize + iSlotBorder * 2;

const styleTable =
{
  fontSize: 'large',
  fontFamily: 'sans-serif',
  borderSpacing: 0,
  backgroundColor: '#a1d4c4',
  margin: 10,
  outline: 'none'
};

const styleTD =
{
  borderWidth: iSlotBorder,
  padding: 0,
  margin: 0,
  borderStyle: 'inset',
  borderColor: '#82c7b1',
  height: iTileSlotSize + iSlotBorder,
  width: iTileSlotSize,
};

const styleXIndex =
{
  backgroundColor: 'white',
  borderRight: '1px solid'
}

const styleTile =
{
  boxShadow: `inset 0px 0px 0px 1px rgba(0,0,0,0.2),
              inset -2px -2px 0px 0px rgba(0,0,0,0.3),
              inset 0px 2px 0px 0px rgba(255,255,255,0.5)`,
  width: '95%',
  height: '95%',
  margin: 'auto',
  backgroundColor: 'wheat',
  borderRadius: 2
};

const styleLetterInner =
{
  position: 'fixed',
  lineHeight: iTileSlotSize + 'px',
  width: iTileSlotSize
};

const dctLetterCounts =
{
  E: 12,
  A: 9,
  I: 9,
  O: 8,
  N: 6,
  R: 6,
  T: 6,
  L: 4,
  S: 4,
  U: 4,
  D: 4,
  G: 3,
  B: 2,
  C: 2,
  M: 2,
  P: 2,
  F: 2,
  H: 2,
  V: 2,
  W: 2,
  Y: 2,
  K: 1,
  J: 1,
  X: 1,
  Q: 1,
  Z: 1
};


class Rack extends Component
{
  constructor(props)
  {
    super(props);

    let tiles = [];
    for(const c in dctLetterCounts)
    {
      const set = Array(dctLetterCounts[c]).fill(c);
      tiles = tiles.concat(set);
    }

    this.tiles = new Set(tiles);
    this.state = {rack: []};
    this.rnd = new Random();
  }

  // Fills from the bag onto the rack till rack has 7 tiles or bag is empty
  fill()
  {
    let rack = [...this.state.rack];
    const nNeeded = 7 - rack.length;
    const nRemain = this.tiles.size;

    // If we need >= remaining, just add them all
    if(nRemain <= nNeeded)
    {

    }
    else
    {

    }

  }


  render()
  {

  }
}



export default class Gabble extends Component
{
  constructor(props)
  {
    super(props);

    // Styles for ach type of square
    this.styleValues =
    {
      '0': {backgroundColor: '#f6aa95'},  // Board center
      '2': {backgroundColor: '#81c8f2'},  // DL
      '3': {backgroundColor: '#0196d8'},  // TL
      '@': {backgroundColor: '#fda797'},  // DW
      '#': {backgroundColor: '#eb1c2c'},  // TW
      ' ': {backgroundColor: '#b1e4d4'}   // Normal Tile
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
      words: [], // array of words - each is {x, y, vert}
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
      <tr style={styleXIndex}>
        {[...Array(15).keys()].map((e, i) => <td style={styleXIndex} key={i}>{String.fromCharCode(i + 65)}</td>)}
      </tr>;
  }

  componentDidMount()
  {
    this.place('APPLE', 1, 1, true);
    this.refs.board.focus();
    //this.place('SYZYGY', 0, 3, false);
  }

  // tells if word fits at the given pos
  doesFit = (iLen, iX, iY, bVert) =>
  {
    if(bVert)
    {
      if(iX == 15) return false;
      if(iY + iLen > 15) return false;
    }
    else
    {
      if(iY == 15) return false;
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
    const iLen = word.sWord.length;

    let board = [...this.state.board];
    let iX = word.iX, iY = word.iY;

    // Go over each slot and chop the rightmost char
    for(let n = 0; n < iLen; ++n)
    {
      // Chop last letter
      board[iY][iX] = board[iY][iX].slice(0, -1);

      // Move to next slot
      if(word.bVert) ++iY; else ++iX;
    }

    this.setState({board});
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

  // When enter id pressed on the input field
  onPlace = (evt) =>
  {
    if(evt.key === "Enter")
    {
      const sWord = this.refs.inp.value.toUpperCase();
      if(this.place(sWord, 0, 0))
      {
        this.refs.inp.value = '';
        this.refs.board.focus();
      }
    }
  }

  static dctKeyIncr =
  {
    ArrowRight : [ 1,  0],
    ArrowLeft  : [-1,  0],
    ArrowUp    : [ 0, -1],
    ArrowDown  : [ 0,  1],
  };

  // Board key handler
  onKey = (evt) =>
  {
    if(!this.state.placed)
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
                  const hint = String.fromCharCode(65 + x) + ',' + (y + 1);
                  const sTile = this.state.board[y][x];
                  const iLast = sTile.length-1;

                  let styleLetter;

                  if(this.state.bads[y][x] > 0)           // Bad tile
                  {
                    styleLetter = {...styleTile, ...{backgroundColor: 'orangered'}}
                  }
                  else if(sTile === '')           // Slot empty
                  {
                    styleLetter =
                    {
                      width: iTileSize,
                      height: iTileSize,
                    };
                  }
                  else if(sTile.length == 1 || (sTile.length == 2 && sTile[0] == sTile[1])) // No overlap
                  {
                    styleLetter = styleTile;
                  }
                  else                      // Overlap - warn in red
                  {
                    styleLetter = {...styleTile, ...{backgroundColor: 'orangered'}}
                  }

                  return (
                    <td key={x} style={{...this.styleValues[col], ...styleTD}} title={hint}>
                      <div style={styleLetter}>
                        <div style={{lineHeight: iTileSize +'px'}}>
                          {
                            sTile.split('').map
                            (
                              (s, i)=>
                                <div key={i} style={{...styleLetterInner, opacity: i == iLast ? 1 : 0.3}}>
                                  {s}
                                </div>
                            )
                          }
                        </div>
                      </div>
                    </td>
                  )
                }
              )
            }
          </tr>
        );
      }
    );


    return (
      <div>
        <table style={styleTable} className={this.state.invalid ? 'shake' : 'noshake'}
               onKeyDown={this.onKey} tabIndex='1' ref='board'>
          
          <tbody>
          {this.elemXHeader}
          {elemTiles}
          </tbody>
        </table>
        <br/>
        <input ref='inp' onKeyUp={this.onPlace} tabIndex='0' autoFocus='true'/>
      </div>
    );
  }
}
