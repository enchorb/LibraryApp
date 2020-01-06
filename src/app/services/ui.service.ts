import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
  hoverStatus = {
    cards: {
      item: []
    },
    searchBar: false,
    searchBarIcons: {
      cross: false,
      stock: false,
      type: false
    },
    fabIcons: {
      add: false,
      cart: false
    },
    addForm: {
      buttons: {
        close: false,
        add: false,
        av: false,
        book: false
      }
    },
    checkoutForm: {
      buttons: {
        close: false,
        borrow: false
      }
    }
  };

  clickTrack = {
    searchBarIcons: {
      stock: 0,
      type: 0
    }
  };

  svgIcons = {
    // tslint:disable-next-line:max-line-length
    av: 'M20.327 13.099l-.427-.427.71-.71.424.427-.707.71zm-.417 4.467l-.708-.709-.428.427.707.709.429-.427zm4.09-11.566v16h-24v-16h10.888l-2.888-3.375.781-.625 3.219 3.75 3.219-3.75.781.625-2.888 3.375h10.888zm-21.049 12.993c.674.671 3.362 1.007 6.05 1.007 2.687 0 5.375-.336 6.049-1.007.633-.632.95-2.851.95-5.059 0-2.181-.31-4.351-.93-4.97-.637-.635-3.399-.964-6.141-.964-2.681 0-5.346.314-5.997.964-.603.601-.913 2.668-.931 4.786-.018 2.268.299 4.594.95 5.243zm15.049-5.9c0 1.021.796 1.851 1.802 1.904 1.097.059 2.009-.814 2.009-1.904 0-1.049-.85-1.906-1.907-1.906-1.048 0-1.904.847-1.904 1.906zm4-3.093v-.555h-4v.555h4zm-4 7.988c0 1.062.86 1.907 1.903 1.907 1.058 0 1.907-.858 1.907-1.907s-.85-1.906-1.907-1.906c-1.047 0-1.903.846-1.903 1.906zm4-9.988h-4v.555h4v-.555z',
    // tslint:disable-next-line:max-line-length
    book: 'M23 5v13.883l-1 .117v-16c-3.895.119-7.505.762-10.002 2.316-2.496-1.554-6.102-2.197-9.998-2.316v16l-1-.117v-13.883h-1v15h9.057c1.479 0 1.641 1 2.941 1 1.304 0 1.461-1 2.942-1h9.06v-15h-1zm-12 13.645c-1.946-.772-4.137-1.269-7-1.484v-12.051c2.352.197 4.996.675 7 1.922v11.613zm9-1.484c-2.863.215-5.054.712-7 1.484v-11.613c2.004-1.247 4.648-1.725 7-1.922v12.051z',
    // tslint:disable-next-line:max-line-length
    filter: 'M19.479 2l-7.479 12.543v5.924l-1-.6v-5.324l-7.479-12.543h15.958zm3.521-2h-23l9 15.094v5.906l5 3v-8.906l9-15.094z',
    // tslint:disable-next-line:max-line-length
    btnUnchecked: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
    // tslint:disable-next-line:max-line-length
    btnChecked: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'
  };

  addForm = {
    av: {
      shadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      background: '#f6f6f6',
      cursor: 'pointer',
      fill: '#a5a5a5',
      hoverFill: '#00aaef'
    },
    book: {
      shadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      background: '#f6f6f6',
      cursor: 'pointer',
      fill: '#a5a5a5',
      hoverFill: '#00aaef'
    }
  };

  searchBar = {
    stock: {
      fill: '#a5a5a5',
      hoverFill: '#00aaef',
      tooltip: 'Filter By Stock',
      svg: this.svgIcons.btnUnchecked
    },
    type: {
      fill: '#a5a5a5',
      tooltip: 'Filter By Item Type',
      svg: this.svgIcons.filter
    }
  };
}
