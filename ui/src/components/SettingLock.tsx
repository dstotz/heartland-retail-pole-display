import React, { useState } from 'react';

interface IProps {
  onUnlocked?: () => void;
}

export const SettingLock = (props: IProps) => {
  const [settingLock1Open, setSettingLock1Open] = useState(false);
  const [settingLock2Open, setSettingLock2Open] = useState(false);
  const [settingLock3Open, setSettingLock3Open] = useState(false);

  const lockSetters = {
    1: setSettingLock1Open,
    2: setSettingLock2Open,
    3: setSettingLock3Open,
  };

  const isUnlocked = (): boolean => {
    return settingLock1Open && settingLock2Open && settingLock3Open;
  };

  const handleLockPress = async (lockNumber: number) => {
    console.log('Unlocking point #', lockNumber);
    await lockSetters[lockNumber](true);

    setTimeout(() => {
      console.log('Locking point #', lockNumber);
      lockSetters[lockNumber](false);
    }, 10_000);

    if (isUnlocked() && props.onUnlocked) {
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
      />
    </div>
  );
};
