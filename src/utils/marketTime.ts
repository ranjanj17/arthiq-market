export const isMarketOpen = (): boolean => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (330 * 60000));
  
  const weekday = istDate.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  
  if (weekday === 0 || weekday === 6) {
    return false;
  }
  
  const currentTimeInMinutes = hour * 60 + minute;
  const marketOpenMinutes = 9 * 60 + 15; // 9:15 AM
  const marketCloseMinutes = 15 * 60 + 30; // 3:30 PM
  
  return currentTimeInMinutes >= marketOpenMinutes && currentTimeInMinutes <= marketCloseMinutes;
};

export const getMillisecondsUntilMarketOpen = (): number => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (330 * 60000));
  
  const weekday = istDate.getDay();
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  
  const currentTimeInMinutes = hour * 60 + minute;
  const marketOpenMinutes = 9 * 60 + 15; // 9:15 AM
  
  let minutesToWait = 0;
  
  if (weekday === 5 && currentTimeInMinutes > marketOpenMinutes) {
    // Friday after 9:15 AM: Wait until Monday 9:15 AM (approx 3 days)
    minutesToWait = (24 * 60 - currentTimeInMinutes) + (24 * 60 * 2) + marketOpenMinutes;
  } else if (weekday === 6) {
    // Saturday: Wait until Monday 9:15 AM (approx 2 days)
    minutesToWait = (24 * 60 - currentTimeInMinutes) + (24 * 60) + marketOpenMinutes;
  } else if (weekday === 0) {
    // Sunday: Wait until Monday 9:15 AM (approx 1 day)
    minutesToWait = (24 * 60 - currentTimeInMinutes) + marketOpenMinutes;
  } else if (currentTimeInMinutes > marketOpenMinutes) {
    // Weekday after 9:15 AM: Wait until tomorrow 9:15 AM
    minutesToWait = (24 * 60 - currentTimeInMinutes) + marketOpenMinutes;
  } else {
    // Weekday before 9:15 AM: Wait until 9:15 AM today
    minutesToWait = marketOpenMinutes - currentTimeInMinutes;
  }
  
  return (minutesToWait * 60 * 1000) + 60000; // Add 1 minute safety buffer
};
