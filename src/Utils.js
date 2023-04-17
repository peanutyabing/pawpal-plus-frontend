export const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const ageInYears = (now - dob) / 1000 / 60 / 60 / 24 / 365;
  if (ageInYears >= 2) {
    return `${Math.floor(ageInYears)} years old`;
  } else if (ageInYears < 2 && ageInYears >= 1) {
    return `${Math.floor(ageInYears)} year old`;
  } else {
    const ageInMonths = 12 * ageInYears;
    if (ageInMonths <= 1) {
      return "1 month old";
    }
    return `${Math.floor(ageInMonths)} months old`;
  }
};

export const calculateDuration = (petEvent) => {
  const start = new Date(petEvent.startTime);
  const end = new Date(petEvent.endTime);
  const durationInMins = (end - start) / 1000 / 60;
  if (durationInMins >= 60) {
    const durationInHours = Math.floor(durationInMins / 60);
    const remainingMins = durationInMins - durationInHours * 60;
    return `${durationInHours}h${remainingMins}min`;
  } else {
    return `${durationInMins}min`;
  }
};

export const sortEventsByDay = (events) => {
  const sortedByDay = {};
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (const eventItem of events) {
    if (
      new Date(eventItem.startTime).toDateString() === new Date().toDateString()
    ) {
      sortedByDay["Today"] = sortedByDay["Today"]
        ? [...sortedByDay["Today"], eventItem]
        : [eventItem];
    } else if (new Date() - new Date(eventItem.startTime) <= 604800000) {
      // within a week from today
      const weekday = days[new Date(eventItem.startTime).getDay()];
      sortedByDay[weekday] = sortedByDay[weekday]
        ? [...sortedByDay[weekday], eventItem]
        : [eventItem];
    } else {
      sortedByDay["Older"] = sortedByDay["Older"]
        ? [...sortedByDay["Older"], eventItem]
        : [eventItem];
    }
  }
  return sortedByDay;
};
