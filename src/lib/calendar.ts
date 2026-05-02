export function generateCalendarUrl(title: string, date: string, description: string) {
  const start = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const end = new Date(new Date(date).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, '');
  
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    dates: `${start}/${end}`,
    details: description,
    location: 'Your Polling Booth',
    sf: 'true',
    output: 'xml'
  });

  return `${baseUrl}&${params.toString()}`;
}
