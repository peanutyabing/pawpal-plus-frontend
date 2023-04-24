export const defaultPetPhoto =
  "https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80";

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const ageInYears = (now - dob) / 1000 / 60 / 60 / 24 / 365;
  if (ageInYears >= 2) {
    return `${Math.floor(ageInYears)} years old`;
  } else if (ageInYears < 2 && ageInYears >= 1) {
    return `${Math.floor(ageInYears)} year old`;
  } else {
    const ageInMonths = 12 * ageInYears;
    if (ageInMonths < 2) {
      return "1 month old";
    }
    return `${Math.floor(ageInMonths)} months old`;
  }
};

export const getNextBirthday = (dateOfBirth) => {
  if (!dateOfBirth) return;
  const dob = new Date(dateOfBirth);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(dob);
  const day = dob.getDate();
  return `${day} ${month}`;
};

export const calculateDuration = (petEvent, byStartTime = true) => {
  let start;
  let end;
  if (byStartTime) {
    start = new Date(petEvent.startTime);
    end = new Date(petEvent.endTime);
  } else {
    start = new Date(petEvent.createdAt);
    end = new Date();
  }
  const durationInMins = (end - start) / 1000 / 60;
  if (durationInMins >= 60) {
    const durationInHours = Math.floor(durationInMins / 60);
    const remainingMins = Math.floor(durationInMins % 60);
    return `${durationInHours}h${remainingMins}min`;
  } else {
    return `${Math.floor(durationInMins)}min`;
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
