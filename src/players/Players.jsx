import { useState, useEffect } from "react";
import { getPlayers, addPlayer, removePlayer } from "../api/players.js";
import { getTeams } from "../api/teams.js";
import { useAuth } from "../auth/AuthContext";
import "./players.css";

export default function Players() {
  const { token } = useAuth();
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [teams, setTeams] = useState([]);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    bio: "",
    email: "",
    team_name: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    try {
      setLoading(true);
      const playersData = await getPlayers();
      setPlayers(playersData);
      setFilteredPlayers(playersData);
      try {
        const teamsData = await getTeams();
        setTeams(teamsData || []);
      } catch (e) {
        console.warn("Failed to load teams:", e);
      }
    } catch (err) {
      setError("Failed to load players");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.bio.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  async function handleAddPlayer(e) {
    e.preventDefault();
    try {
      // resolve team name to id (exact, case-insensitive)
      const teamName = (newPlayer.team_name || "").trim().toLowerCase();
      let teamId = null;
      if (teamName) {
        const found = teams.find(
          (t) => (t.name || "").trim().toLowerCase() === teamName,
        );
        if (!found) {
          setError("Team not found. Please enter the exact team name.");
          return;
        }
        teamId = found.id;
      }

      const created = await addPlayer({
        name: newPlayer.name,
        bio: newPlayer.bio,
        email: newPlayer.email,
        team_id: teamId,
        image_url: newPlayer.image_url || null,
      });
      if (created) {
        setShowAddForm(false);
        setNewPlayer({
          name: "",
          bio: "",
          email: "",
          team_name: "",
          image_url: "",
        });
        await fetchPlayers();
      }
    } catch (err) {
      console.error("Failed to add player:", err);
      setError(err.message || "Failed to add player");
    }
  }

  async function handleDeletePlayer(id) {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    await removePlayer(id);
    await fetchPlayers();
  }

  return (
    <div className="players-container">
      <h1>All Players</h1>

      {token && (
        <div className="add-player-control">
          <button onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? "Cancel" : "Add Player"}
          </button>
        </div>
      )}

      {showAddForm && (
        <form className="add-player-form" onSubmit={handleAddPlayer}>
          <input
            placeholder="Name"
            value={newPlayer.name}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, name: e.target.value })
            }
            required
          />
          <input
            placeholder="Bio"
            value={newPlayer.bio}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, bio: e.target.value })
            }
            required
          />
          <input
            placeholder="Contact email"
            value={newPlayer.email}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, email: e.target.value })
            }
            required
          />
          <input
            placeholder="Team name (exact)"
            value={newPlayer.team_name}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, team_name: e.target.value })
            }
          />
          <input
            placeholder="Image URL (optional)"
            value={newPlayer.image_url}
            onChange={(e) =>
              setNewPlayer({ ...newPlayer, image_url: e.target.value })
            }
          />
          <button type="submit">Create Player</button>
        </form>
      )}

      <p className="search-results">
        Showing {filteredPlayers.length} of {players.length} players
      </p>

      {filteredPlayers.length === 0 ? (
        <div className="no-results">
          <p>No players found.</p>
        </div>
      ) : (
        <div className="players-grid-full">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="player-card-full">
              {player.image_url && (
                <img
                  src={player.image_url}
                  alt={player.name}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              )}
              <div className="player-content">
                <h3>{player.name}</h3>
                <p className="player-bio">{player.bio}</p>
                {token && (
                  <button
                    className="delete-player-btn"
                    onClick={() => handleDeletePlayer(player.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
