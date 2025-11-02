function formatDateRange(commencement_date: string, duration: number) {
  const end_date = new Date(commencement_date);
  const start_date = new Date(commencement_date);
  end_date.setDate(start_date.getDate() + duration - 1);

  const options = { month: 'short', day: 'numeric' };
  const start_month = start_date.toLocaleString('en-US', { month: 'short' });
  const end_month = end_date.toLocaleString('en-US', { month: 'short' });

  const start_day = start_date.getDate();
  const end_day = end_date.getDate();
  const year = end_date.getFullYear();

  if (start_month === end_month && duration === 1) {
    return `${start_month} ${start_day}, ${year}`;
  } else if (start_month === end_month) {
    return `${start_month} ${start_day} - ${end_day}, ${year}`;
  } else {
    return `${start_month} ${start_day} - ${end_month} ${end_day}, ${year}`;
  }
}

function computeAgeFromDob(year_of_birth: number) {
  return new Date().getFullYear() - year_of_birth;
}

export { formatDateRange, computeAgeFromDob };
