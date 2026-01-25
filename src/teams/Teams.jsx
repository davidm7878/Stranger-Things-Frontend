import { useState, useEffect } from "react";
import { getTeams } from "../api/teams.js";
import { getPlayersByTeamId } from "../api/players.js";
import "./teams.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all teams on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    try {
      setLoading(true);
      const teamsData = await getTeams();
      setTeams(teamsData);
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

  if (loading) {
    return <div className="loading">Loading teams...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="teams-container">
      <h1>Character Teams</h1>

      <div className="teams-layout">
        {/* Teams List */}
        <aside className="teams-list">
          <h2>Teams</h2>
          {teams.length === 0 ? (
            <p className="no-teams">No teams available</p>
          ) : (
            <ul>
              {teams.map((team) => (
                <li
                  key={team.id}
                  className={`team-item ${selectedTeam?.id === team.id ? "active" : ""}`}
                  onClick={() => selectTeam(team)}
                >
                  <h3>{team.name}</h3>
                  <p className="team-count">{team.email}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Team Details */}
        <main className="team-details">
          {selectedTeam ? (
            <>
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
                        <p className="player-email">{player.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">Select a team to view details</div>
          )}
        </main>
      </div>
    </div>
  );
}
