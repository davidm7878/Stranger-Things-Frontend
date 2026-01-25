import { useState, useEffect } from "react";
import { getPlayers } from "../api/players.js";
import "./players.css";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="players-container">
      <h1>All Characters</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search characters by name or bio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="search-results">
          Found {filteredPlayers.length} of {players.length} characters
        </p>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="no-results">
          <p>No characters found matching your search.</p>
        </div>
      ) : (
        <div className="players-grid-full">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="player-card-full">
              <div className="player-content">
                <h3>{player.name}</h3>
                <p className="player-bio">{player.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
