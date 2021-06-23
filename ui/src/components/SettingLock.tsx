import React, { useEffect, useState } from 'react';

interface IProps {
  onUnlocked: () => void;
}

export const SettingLock = (props: IProps) => {
  const [settingLock1Open, setSettingLock1Open] = useState(false);
  const [settingLock2Open, setSettingLock2Open] = useState(false);
  const [settingLock3Open, setSettingLock3Open] = useState(false);
  let holdTimeout: NodeJS.Timeout;

  useEffect(() => {
    return () => {
      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }
    };
  }, [holdTimeout]);

  const lockGetters = {
    1: settingLock1Open,
    2: settingLock2Open,
    3: settingLock3Open,
  };

  const lockSetters = {
    1: setSettingLock1Open,
    2: setSettingLock2Open,
    3: setSettingLock3Open,
  };

  const lockTimeouts = {
    1: null,
    2: null,
    3: null,
  };

  const handleHold = async () => {
    holdTimeout = setTimeout(() => {
      console.log('Unlocked');
      props.onUnlocked();
    }, 2_000);
  };

  const handleCancelHold = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
    }
  };

  const handleLockPress = async (lockNumber: number) => {
    console.log('Unlocking point #', lockNumber);
    lockSetters[lockNumber](true);

    const otherLocksUnlocked = Object.keys(lockGetters)
      .filter((k) => Number(k) !== lockNumber)
      .map((k) => lockGetters[k])
      .every((v) => v === true);

    if (lockTimeouts[lockNumber]) {
      clearTimeout(lockTimeouts[lockNumber]);
    }

    lockTimeouts[lockNumber] = setTimeout(() => {
      console.log('Locking point #', lockNumber);
      lockSetters[lockNumber](false);
    }, 10_000);

    if (otherLocksUnlocked) {
      console.log('Unlocked');
      props.onUnlocked();
    }
  };

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          bottom: 1,
          left: 1,
          width: '50px',
          height: '50px',
          zIndex: 1000,
        }}
        onClick={() => handleLockPress(2)}
        onMouseDown={handleHold}
        onMouseUp={handleCancelHold}
        onTouchStart={handleHold}
        onTouchEnd={handleCancelHold}
      />
      <div
        style={{
          position: 'absolute',
          top: 1,
          right: 1,
          width: '50px',
          height: '50px',
          zIndex: 1000,
        }}
        onClick={() => handleLockPress(1)}
        onMouseDown={handleHold}
        onMouseUp={handleCancelHold}
        onTouchStart={handleHold}
        onTouchEnd={handleCancelHold}
      />
      <div
        style={{
          position: 'absolute',
          top: 1,
          left: 1,
          width: '50px',
          height: '50px',
          zIndex: 1000,
        }}
        onClick={() => handleLockPress(3)}
        onMouseDown={handleHold}
        onMouseUp={handleCancelHold}
        onTouchStart={handleHold}
        onTouchEnd={handleCancelHold}
      />
    </div>
  );
};
