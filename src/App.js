import React, { Component } from 'react';
import './App.css';


import Gabble from './Gabble.js';
import Rack from './Rack.js';
import Bag from './Bag.js';

class App extends Component
{
  componentDidMount()
  {
    // Inform the rack about the bag
    this.refs.rack.setBag(this.refs.bag);
    this.refs.rack.fill();

    // Inform the rack about the board
    this.refs.rack.setBoard(this.refs.board);
  }

  // Global key handler
  onKeyDown = (evt) =>
  {
    const keyCode = evt.keyCode;

    // Send A to Z and 1 to 9 to the rack
    if((keyCode > 64 && keyCode < 91) || (keyCode > 48 && keyCode < 58))
    {
      this.refs.rack.onKeyDown(evt);
    }
    // Arrow keys
    else if((keyCode > 36 && keyCode < 41))
    {
      this.refs.board.onKeyDown(evt);
    }

    console.log(evt.key);
  }


  render()
  {
    // divide the view into two panes left and right
    // Left pane has board and rack
    // Right pane for other features
    return (
      <div className="App" tabIndex='0' onKeyDown={this.onKeyDown} autoFocus='true'>
        <div className='Board'>
          <Gabble ref='board'/>
          <Rack ref='rack'/>
        </div>

        <div className='Control'>
          <Bag ref='bag'/>
        </div>

      </div>
    );
  }
}

export default App;
