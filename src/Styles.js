export const iTileSize = 24;
export const iSlotBorder = 2;
export const iTileSlotSize =  iTileSize + iSlotBorder * 2;

export const iRackTileSize = iTileSize * 1.75;
export const iBagTileSize = iTileSize * 1.5;


export const Styles =
{
  boardTable:
  {
    fontSize: iTileSize * 0.75,
    fontFamily: 'sans-serif',
    borderSpacing: 0,
    backgroundColor: '#a1d4c4',
    margin: 10,
    outline: 'none'
  },

  boardTD:
  {
    borderWidth: iSlotBorder,
    padding: 0,
    margin: 0,
    borderStyle: 'inset',
    borderColor: '#82c7b1',
    height: iTileSlotSize + iSlotBorder,
    width: iTileSlotSize+ iSlotBorder,
  },

  boardXYIndex:
  {
    backgroundColor: 'white',
    borderRight: '1px solid',
    borderBottom: '1px solid'

  },

  Tile:
  {
    boxShadow: `inset 0px 0px 0px 1px rgba(0,0,0,0.2),
          inset -2px -2px 0px 0px rgba(0,0,0,0.3),
          inset 0px 2px 0px 0px rgba(255,255,255,0.5)`,
    width: '95%',
    height: '95%',
    margin: 'auto',
    backgroundColor: 'wheat',
    borderRadius: 2
  },

  boardLetter:
  {
    position: 'relative',
    lineHeight: iTileSlotSize + 'px',
    width: iTileSlotSize
  },

  Rack:
  {
    display:'flex',
    borderWidth: iSlotBorder,
    borderStyle: 'inset',
    backgroundColor: 'beige',
    borderColor: 'beige',
    height: iRackTileSize,
    width: 7 * iRackTileSize,
    alignItems: 'center'
  },

  rackTile:
  {
    lineHeight: iRackTileSize +'px',
    width: iRackTileSize,
    height: iRackTileSize,
    marginTop: 4,
  },

  Center      :  {backgroundColor: '#f6aa95'}, // Board center
  DoubleLetter: {backgroundColor: '#81c8f2'},  // DL
  TripleLetter: {backgroundColor: '#0196d8'},  // TL
  DoubleWord  : {backgroundColor: '#fda797'},  // DW
  TripleWord  : {backgroundColor: '#eb1c2c'},  // TW
  Normal      : {backgroundColor: '#b1e4d4'},  // Normal Tile
  Bad         : {backgroundColor: 'orangered'}, // Error Tile
  Current     : {backgroundColor: 'white'}, // Current location


  Bag:
  {
    display : 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%'
  },

  bagTile:
  {
    lineHeight: iBagTileSize +'px',
    width: iBagTileSize,
    height: iBagTileSize,
  },

  bagTileNum:
  {
    position:'relative',
    top: -iBagTileSize * 0.64,
    left: iBagTileSize / 4,
    fontSize: 8
  },



};

Styles.boardTileBad = {...Styles.Tile, ...Styles.Bad};
Styles.boardTileCurr = {...Styles.Tile, ...Styles.Current};


Styles.RackXY =
{
  ...Styles.Rack,
  borderColor: '#82c7b1',
  width: iRackTileSize,
  //marginRight: iRackTileSize/2,
  ...Styles.Normal
};

