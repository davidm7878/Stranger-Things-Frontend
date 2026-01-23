const API = "https://localhost:3000/api";

// fetch a list of all the teams
export async function getTeams() {
  try {
    const response = await fetch(`${API}/teams`);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}
// view a single team with details such as name, description, images, contact information and members
export async function getTeamById(teamId) {
  try {
    const response = await fetch(`${API}/teams/${teamId}`);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// add a new team with admin credentials
export async function addTeam(teamData) {
  try {
    const response = await fetch(`${API}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// remove a department with admin credentials
export async function deleteTeam(teamId) {
  try {
    const response = await fetch(`${API}/teams/${teamId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const result = await response.json();
      throw Error(result.message);
    }
  } catch (e) {
    console.error(e);
  }
}

// update department details with admin credentials
export async function updateTeam(teamId, teamData) {
  try {
    const response = await fetch(`${API}/teams/${teamId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
