import React, { useEffect } from 'react';
import classNames from 'classnames';

interface IProps { className?: string; children: React.ReactNode; }

export const ProgressTracker = (props: IProps) => {
  useEffect(() => { void import('./ProgressTracker.css'); }, []); // loads once
  const col = classNames('progress-tracker-wrapper', props.className);
  return (
    <div className={col}>
      <div className="progress-tracker">{props.children}</div>
    </div>
  );
};