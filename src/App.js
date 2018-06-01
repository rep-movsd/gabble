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
  }

  render()
  {
    // divide the view into two panes left and right
    // Left pane has board and rack
    // Right pane for other features
    return (
      <div className="App">
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
