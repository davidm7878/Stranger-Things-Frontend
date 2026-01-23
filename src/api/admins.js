const API = "https://localhost:3000/api";

// fetch amin information from the API

export async function getAdminInfo(token) {
  if (!token) {
    throw Error("You must be logged in to see admin information");
  }

  const response = await fetch(`${API}/admins/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  console.log("API result:", result);

  if (!response.ok) {
    throw Error(result.message);
  }
  return result;
}
