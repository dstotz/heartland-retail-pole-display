import React from 'react';
import { Config } from '../types/Config';

interface IProps {
  config: Config;
}

export const SplashScreen = (props: IProps) => {
  if (!props.config.showSplashScreen) return <div />;

  let width = '100%';
  let height = '500px';

  if (props.config.showLogo) {
    height = '350px';
  }

  if (props.config.splashScreenUrl?.includes('youtube.com')) {
    if (props.config.showLogo) {
      width = '622px';
    } else {
      width = '888px';
    }
  }

  return (
    <div className="block" style={{ position: 'relative' }}>
      {!props.config.splashScreenInteract && (
        <div
          id="iframeBlocker"
          style={{
            zIndex: 2,
            position: 'absolute',
            top: 0,
            width: '100%',
            height: height,
            backgroundColor: 'aliceblue',
            opacity: 0.1,
          }}
        ></div>
      )}
      <iframe
        src={props.config.splashScreenUrl}
        title="Info"
        style={{ width: width, height: height }}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </div>
  );
};
