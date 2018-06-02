import React, {Component} from 'react';

import Random from './Random';
import {Styles} from './Styles';


const dctLetterCounts =
{
  E: 12,
  A: 9,
  I: 9,
  O: 8,
  N: 6,
  R: 6,
  T: 6,
  ' ': 4, // This is an NBSP
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

const dctLetterPoints =
{
  ' ': 0, // This is an NBSP
  E: 1,
  A: 1,
  I: 1,
  O: 1,
  N: 1,
  R: 1,
  T: 1,
  L: 1,
  S: 1,
  U: 1,
  D: 2,
  G: 2,
  B: 3,
  C: 3,
  M: 3,
  P: 3,
  F: 4,
  H: 4,
  V: 4,
  W: 4,
  Y: 4,
  K: 5,
  J: 8,
  X: 8,
  Q: 10,
  Z: 10
};



export default class Bag extends Component
{
  constructor(props)
  {
    super(props);

    // fill the bag with the required number of letters
    this.state = {bag: []};
    for(const c in dctLetterCounts)
    {
      const set = Array(dctLetterCounts[c]).fill(c);
      this.state.bag = this.state.bag.concat(set);
    }

    this.rnd = new Random(12);
  }

  // Gets upto n random tiles from the bag
  fetch = (nFetch) =>
  {
    let ret = [];
    let bag = [...this.state.bag];
    let n = Math.min(nFetch, bag.length);
    for(let i = 0; i < n; ++i)
    {
      // Choose a random letter, put it in the result
      const idx = this.rnd.get(bag.length);
      ret.push(bag[idx]);
      bag.splice(idx, i);
    }

    // Update the bag
    this.setState({bag: bag.sort()});

    return ret;
  }


  render()
  {
    return (
      <div style={Styles.Bag}>
      {
        this.state.bag.map
        (
          (ch, i) =>
            <div key={i} style={Styles.bagTile}>
              <div style={Styles.Tile}>
                {ch}
              </div>
              <div style={Styles.bagTileNum}>
                {dctLetterPoints[ch]}
              </div>
            </div>
        )
      }
      </div>
    );
  }
}
