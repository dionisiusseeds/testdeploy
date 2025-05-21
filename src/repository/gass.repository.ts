import axios from 'axios';

export const gassPost = async (payload: {
  act: 'form_update' | 'form_trigger_custom';
  visitor_id?: string;
  phone?: string;
  email?: string;
  event?: 'prospek' | 'purchase';
}): Promise<void> => {
  try {
    const data = new URLSearchParams();
    data.append('act', payload.act);
    if (payload.visitor_id !== null)
      data.append('visitor_id', payload.visitor_id ?? '');
    if (payload.phone !== null) data.append('phone', payload.phone ?? '');
    if (payload.email !== null) data.append('email', payload.email ?? '');
    if (payload.event !== null) data.append('event', payload.event ?? '');
    data.append(
      'project_key',
      process.env.NEXT_PUBLIC_GASS_PROJECT_KEY ??
        '939E98001B6C92B322B0F42C05121F1E'
    );

    await axios.post('https://z26.gass.co.id/api.html', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    console.error(error);
  }
};
