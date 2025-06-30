export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  });

  return formatter.format(date).replace(",", "-");
};
