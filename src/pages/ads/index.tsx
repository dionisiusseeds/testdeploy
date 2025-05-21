import Demo from '@/containers/ads/demo.section';
import EventS2 from '@/containers/ads/event-s2.section';
import Event from '@/containers/ads/event.section';
import QuizPlay from '@/containers/ads/quiz-play.section';
import QuizShuffle from '@/containers/ads/quiz-shuffle.section';
import queryList from '@/helpers/queryList';
import React from 'react';

const Ads = (): React.ReactElement => {
  const { queries } = queryList();
  return queries?.type === 'event' ? (
    <Event />
  ) : queries?.type === 'event-s2' ? (
    <EventS2 />
  ) : queries?.type === 'shuffle' ? (
    <QuizShuffle />
  ) : queries?.type === 'demo-play' ? (
    <Demo />
  ) : (
    <QuizPlay />
  );
};

export default Ads;
