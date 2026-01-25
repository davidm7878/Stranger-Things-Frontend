import { useState, useEffect } from "react";
import { getTeams } from "../api/teams.js";
import { getPlayersByTeamId, getPlayers } from "../api/players.js";
import "./teams.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
