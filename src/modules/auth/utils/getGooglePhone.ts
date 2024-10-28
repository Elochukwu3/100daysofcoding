import axios from "axios";

async function getPhoneNumber(accessToken: string) {
  try {
    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const phoneNumbers = response.data.phoneNumbers;
    if (phoneNumbers && phoneNumbers.length > 0) {
      return phoneNumbers[0].value; // Return the first phone number
    }
    return ""; // No phone number found
  } catch (error) {
    console.error("Error fetching phone number from Google People API:", error);
    return "";
  }
}

export default getPhoneNumber;
