const API = "http://localhost:3000/api";

// fetch an array of all players
export async function getPlayers() {
  try {
    const response = await fetch(`${API}/players`);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// fetch details of a single player by ID
export async function getPlayerById(id) {
  try {
    const response = await fetch(`${API}/players/${id}`);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// fetch players by team ID
export async function getPlayersByTeamId(teamId) {
  try {
    const response = await fetch(`${API}/teams/${teamId}/players`);
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// add a new player with admin credentials
export async function addPlayer(playerData) {
  try {
    const response = await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// remove a player with admin credentials
export async function removePlayer(id) {
  try {
    const response = await fetch(`${API}/players/${id}`, { method: "DELETE" });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// update player details with admin credentials
export async function updatePlayer(id, playerData) {
  try {
    const response = await fetch(`${API}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
