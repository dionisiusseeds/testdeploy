import BlurTop from '@/assets/product/BlurTop.svg';
import { CardSlideTournament } from '@/containers/homepage/trending/section5.component/CardSlideTournament.component';
import {
  getPlayLatestList,
  getTrendingPlayList
} from '@/repository/play.repository';
import { getQuizTrending } from '@/repository/quiz.repository';
import { type TeamBattle } from '@/utils/interfaces/play.interface';
import { type TopQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type TopTournament } from '@/utils/interfaces/tournament.interface';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader
} from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { CardSlideQuiz } from './CardSlideQuiz.component';
import CardTeamBattle from './CardTeamBattle.component';

interface DataItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

const initialParamsTeamBattle = {
  page: 1,
  limit: 3,
  currency: '',
  search: '',
  play_type: '',
  play_center_type: ''
};
const CardPlayHomepage: React.FC = () => {
  const measurement = 900;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamBattle, setTeamBattle] = useState<TeamBattle[]>([]);
  const [quizData, setQuizData] = useState<TopQuiz[]>([]);
  const [tournament, setTournament] = useState<TopTournament[]>([]);

  const fetchTeamBattle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const teamResp = await getPlayLatestList({ ...initialParamsTeamBattle });
      if (teamResp !== null) {
        setTeamBattle(teamResp.playList);
      } else {
        setTeamBattle([]);
      }
    } catch (error) {
      toast.error(`fetch team battle error : ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSlideQuiz = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const quizResponse = await getQuizTrending(
        localStorage.getItem('translation') === 'ID' ? 'IDR' : 'USD'
      );
      if (quizResponse !== null) {
        setQuizData(quizResponse.data);
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error('Error fetching data:');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlideTournament = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const tournamentResponse = await getTrendingPlayList();
      if (tournamentResponse !== null) {
        setTournament(tournamentResponse.data);
      } else {
        setTournament([]);
      }
    } catch (error) {
      toast.error('error fetching data: ');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void fetchTeamBattle();
    void fetchSlideQuiz();
    void fetchSlideTournament();
  }, []);
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);
  const [activeTab, setActiveTab] = useState<string>('top tournament');
  const data: DataItem[] = [
    {
      label: 'Top Quiz',
      value: 'top quiz',
      content: <CardSlideQuiz data={quizData} loading={isLoading} />
    },
    {
      label: 'Top Tournament',
      value: 'top tournament',
      content: <CardSlideTournament data={tournament} loading={isLoading} />
    },
    {
      label: 'Team Battle',
      value: 'team battle',
      content: <CardTeamBattle data={teamBattle} loading={isLoading} />
    }
  ];

  return (
    <section ref={ref} className="relative w-full">
      <Image src={BlurTop} alt="BlurTop" className="w-full absolute bottom-0" />
      <div
        className={` sm:mx-5 ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <Tabs value={activeTab}>
          <TabsHeader
            className="flex justify-center p-0 bg-transparent h-12 border-b border-[#7C7C7C] rounded-none"
            indicatorProps={{
              className:
                'bg-transparent border-b-4 border-[#27A590] shadow-none rounded-sm'
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => {
                  setActiveTab(value);
                }}
                className={`${
                  activeTab === value ? 'text-[#27A590]' : 'text-[#7C7C7C]'
                } font-poppins font-normal md:font-semibold md:text-[18.5px] text-xs z-10`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, content }) => (
              <TabPanel
                key={value}
                value={value}
                className="flex justify-center p-0 my-4"
              >
                {!isLoading && content}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </section>
  );
};

export default CardPlayHomepage;
