import { countWords } from '@/helpers/text';
import { getUserInfo } from '@/repository/profile.repository';
import { useEffect, useState } from 'react';

const initialUserInfo = {
  id: '',
  name: '',
  seedsTag: '',
  email: '',
  pin: '',
  avatar: '',
  bio: '',
  birthDate: '',
  phone: '',
  preferredLanguage: '',
  _pin: ''
};

const initialForm = {
  content_text: '',
  privacy: 'public',
  media_urls: [],
  polling: {
    options: [],
    isMultiVote: false,
    canAddNewOption: false,
    endDate: ''
  },
  pie_title: '',
  pie_amount: 0,
  pie: [],
  premium_fee: ''
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useMentionForm = () => {
  const [form, setForm] = useState(initialForm);
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchUserInfo();
  }, []);

  useEffect(() => {
    const regexPattern = /@\[.*?\]\(.*?\)/g;
    const cleanedString = form.content_text.replace(regexPattern, '');
    const totalChar = cleanedString.length;

    if (totalChar > 500 && form.privacy !== 'premium') {
      setIsError(true);
      setErrorMessage('Exceeded max 500 characters for non-premium post.');
    } else if (totalChar > 1000 && form.privacy === 'premium') {
      setIsError(true);
      setErrorMessage('Exceeded max 1000 characters for premium post.');
    } else if (
      form.privacy === 'premium' &&
      countWords(form.content_text) < 10
    ) {
      setIsError(true);
      setErrorMessage('Minimum 10 words required for premium post.');
    } else {
      setIsError(false);
    }
  }, [form.content_text, form.privacy]);

  return {
    form,
    setForm,
    userInfo,
    isError,
    errorMessage,
    setIsError,
    setErrorMessage
  };
};

export default useMentionForm;
