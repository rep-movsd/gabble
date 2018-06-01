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
      used: [],  // current word attempt
      left: [],  // remaining letters
      // left + used == rack at all times
    };

    this.wild = {}; // What letters are the wildcards representing
  }

  // Get ref to bag component
  setBag(bag)
  {
    this.bag = bag;
  }

  // Fills from the bag onto the rack till rack has 7 tiles or bag is empty
  fill()
  {
    // Fetch from bag to rack, concat to rack
    let tiles = this.bag.fetch(7 - this.state.rack.length);
    let rack = this.state.rack.concat(tiles);

    // Update the rack
    this.setState({rack, left: [...rack]});

    this.refs.rack.focus();
  }

  // Moves tile from left to used
  use = (idx, ch, chWild) =>
  {
    let left = [...this.state.left];
    left.splice(idx, 1);

    let used = [...this.state.used];
    used = used.concat(ch);

    // Note what this wildcard is used for
    if(chWild)
    {
      this.wild[used.length-1] = chWild;
    }

    this.setState({left, used});
  }

  // Moves the last tile in used to left
  unUse()
  {
    let used = [...this.state.used];
    const ch = used.pop();

    // Delete wild card if any
    delete this.wild[used.length];

    let left = [...this.state.left];
    left.push(ch);

    this.setState({left, used});
  }

  onKeyDown = (evt) =>
  {
    let ch = evt.key.toUpperCase();
    let idx = this.state.left.indexOf(ch);
    if(idx >= 0)
    {
      this.use(idx, ch);
    }
    else
    {
      console.log(ch);
      if(ch === 'BACKSPACE' && this.state.used.length > 0)
      {
        this.unUse();
      }
      else if(ch === 'PAGEDOWN')
      {
        let left = [...this.state.left];
        left.sort()
        this.setState({left});
      }
      else if(evt.keyCode > 64 && evt.keyCode < 91)
      {
        // look for wildcard
        idx = this.state.left.indexOf(' ');
        if(idx >= 0)
        {
          this.use(idx, ' ', ch);
        }
      }
    }
  }

  render()
  {
    return (
      <div onKeyDown={this.onKeyDown} tabIndex='0' ref='rack'>
        <div style={Styles.Rack}>
        {
          this.state.left.map
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

        <div style={Styles.Rack}>
          {
            this.state.used.map
            (
              (e, i) =>
              {
                return (
                  <div key={i} style={Styles.rackTile}>
                    <div style={Styles.Tile}>
                      {this.wild[i] || e}
                    </div>
                  </div>
                )
              }
            )
          }
        </div>

      </div>
    );

  }
}

