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
      left: []   // remaining letters
      // left + used == rack at all times
    };
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

  onKeyDown = (evt) =>
  {
    let ch = evt.key.toUpperCase();
    const idx = this.state.left.indexOf(ch);
    if(idx >= 0)
    {
      let left = [...this.state.left];
      left = left.splice(idx, 1);

      let used = [...this.state.used];
      used = used.concat(ch);

      this.setState({left, used});
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
              <div key={i} style={Styles.rackTile}>
                <div style={Styles.Tile}>
                  {e}
                </div>
              </div>
            )
          }
        </div>

      </div>
    );

  }
}

