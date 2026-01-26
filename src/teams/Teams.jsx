import { useState, useEffect } from "react";
import { getTeams } from "../api/teams.js";
import { getPlayersByTeamId, getPlayers } from "../api/players.js";
import { addTeam } from "../api/teams.js";
import { useAuth } from "../auth/AuthContext";
import "./teams.css";

export default function Teams() {
  const { token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    email: "",
  });

  // Fetch all teams and players on component mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const teamsData = await getTeams();
      const playersData = await getPlayers();
      setTeams(teamsData);
      setAllPlayers(playersData);
      if (teamsData.length > 0) {
        selectTeam(teamsData[0]);
      }
    } catch (err) {
      setError("Failed to load teams");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function selectTeam(team) {
    try {
      setSelectedTeam(team);
      const players = await getPlayersByTeamId(team.id);
      setTeamPlayers(players || []);
    } catch (err) {
      console.error("Failed to load players:", err);
      setTeamPlayers([]);
    }
  }

  function parseJwt(t) {
    if (!t) return null;
    try {
      const payload = t.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  async function handleAddTeam(e) {
    e.preventDefault();
    try {
      const payload = parseJwt(token);
      const adminId = payload?.id;
      if (!adminId) throw new Error("Must be logged in to add a team");
      const created = await addTeam({ adminId, ...newTeam });
      if (created) {
        setShowAddForm(false);
        setNewTeam({ name: "", description: "", email: "" });
        await fetchData();
      }
    } catch (err) {
      console.error("Failed to add team:", err);
      setError(err.message || "Failed to add team");
    }
  }

  const getTeamCharacterCount = (teamId) => {
    return allPlayers.filter((player) => player.team_id === teamId).length;
  };

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="teams-container">
      <h1>Character Teams</h1>
      {token && (
        <div className="add-team-control">
          <button onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? "Cancel" : "Add Team"}
          </button>
        </div>
      )}

      {showAddForm && (
        <form className="add-team-form" onSubmit={handleAddTeam}>
          <input
            placeholder="Team name"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={newTeam.description}
            onChange={(e) =>
              setNewTeam({ ...newTeam, description: e.target.value })
            }
            required
          />
          <input
            placeholder="Contact email"
            value={newTeam.email}
            onChange={(e) => setNewTeam({ ...newTeam, email: e.target.value })}
            required
          />
          <button type="submit">Create</button>
        </form>
      )}

      {/* Teams Grid */}
      <div className="teams-grid-view">
        {teams.length === 0 ? (
          <p className="no-teams">No teams available</p>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`team-card ${selectedTeam?.id === team.id ? "active" : ""}`}
                onClick={() => selectTeam(team)}
              >
                <h3>{team.name}</h3>
                <p className="team-description">{team.description}</p>
                <p className="character-count">
                  {getTeamCharacterCount(team.id)} Characters
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Details */}
      {selectedTeam && (
        <div className="team-details">
          <div className="team-header">
            <h2>{selectedTeam.name}</h2>
            <p className="team-description">{selectedTeam.description}</p>
            <p className="team-email">Contact: {selectedTeam.email}</p>
          </div>

          <div className="players-section">
            <h3>Characters ({teamPlayers.length})</h3>
            {teamPlayers.length === 0 ? (
              <p className="no-players">No characters in this team yet</p>
            ) : (
              <div className="players-grid">
                {teamPlayers.map((player) => (
                  <div key={player.id} className="player-card">
                    <div className="player-header">
                      <h4>{player.name}</h4>
                    </div>
                    <p className="player-bio">{player.bio}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
