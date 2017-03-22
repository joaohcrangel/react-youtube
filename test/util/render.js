/**
 * Taken from react-youtube's tests at
 * https://github.com/troybetz/react-youtube
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { jsdom } from 'jsdom';
import createYouTube from './createYouTube';

const document = jsdom('<!doctype html><html><body></body></html>');
global.window = { document };
global.document = document;

const render = (props) => {
  const { YouTube, sdkMock, playerMock } = createYouTube();

  let component;
  // Emulate changes to component.props using a container component's state
  class Container extends React.Component {
    constructor(ytProps) {
      super(ytProps);

      this.state = ytProps;
    }

    render() {
      return (
        <YouTube
          ref={(youtube) => { component = youtube; }}
          {...this.state}
        />
      );
    }
  }

  const div = document.createElement('div');
  const container = new Promise((resolve) => {
    ReactDOM.render(<Container {...props} ref={resolve} />, div);
  });

  function rerender(newProps) {
    return container.then(wrapper =>
      new Promise((resolve) => {
        wrapper.setState(newProps, () => {
          Promise.resolve().then(resolve);
        });
      }));
  }

  function unmount() {
    ReactDOM.unmountComponentAtNode(div);
  }

  return component.player.then(() => ({
    sdkMock,
    playerMock,
    component,
    rerender,
    unmount,
  }));
};

export default render;
