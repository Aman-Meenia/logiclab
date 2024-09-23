if (process.argv.length < 3) {
  console.log(
    "Please provide the date in format of DD-MM-YYYY HH:MM:SS in 24 hour format",
  );
  process.exit(1);
}
const inputDate = process.argv[2];
console.log(inputDate);

function convertToISO(indianDate: string): string {
  // Regular expression to match the format DD-MM-YYYY HH:MM:SS
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = indianDate.match(dateRegex);

  if (match) {
    const [, day, month, year, hours, minutes, seconds] = match;

    // Create a Date object assuming the date is in IST (Indian Standard Time)
    const date = new Date(
      `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`,
    );

    // Convert the date to ISO 8601 format
    try {
      const isoDate = date.toISOString();
      return isoDate;
    } catch (err) {
      console.log(
        "Please provide the date in format of DD-MM-YYYY HH:MM:SS in 24 hour format",
      );

      return "Invalid date format";
    }
  } else {
    console.log(
      "Please provide the date in format of DD-MM-YYYY HH:MM:SS in 24 hour format",
    );

    return "Invalid date format";
  }
}

console.log(convertToISO(inputDate));
