import React from 'react';
import { VoiceGuide } from './VoiceGuide';
import { TutorialModal } from './TutorialModal';
import { CommunityFloatButton } from './CommunityFloatButton';

/**
 * 右下悬浮 Dock：教程 / 语音 / 社群 三个功能的统一容器。
 * 三个子组件自己只渲染「Dock 内的一格图标钮」+ 各自的弹层，
 * 定位、皮肤色、间距全部这里统一负责。
 */
export const FloatingDock: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1 rounded-full border t-panel backdrop-blur-xl panel-shadow p-1.5">
      <TutorialModal />
      <VoiceGuide />
      <CommunityFloatButton />
    </div>
  );
};
