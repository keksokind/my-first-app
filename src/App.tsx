import React, { useState } from "react";
import "./App.css";

function App() {
  const [steamID, setSteamID] = useState<string>("");
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSteamID(e.target.value);
  };

  const handleSearch = async () => {
    if (steamID) {
      setError(null);
      setPlayerData(null);
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.opendota.com/api/players/${steamID}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching player data: ${response.statusText}`);
        }
        const data = await response.json();
        setPlayerData(data);
      } catch (error) {
        console.error("Error fetching player data:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task - Dota</h1>
        <p>
          I want to be able to search for Dota 2 players by their Steam ID and
          view basic information about them.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            placeholder="Steam ID"
            value={steamID}
            onChange={handleInputChange}
          />
          <button type="submit" className="search-button">
            <div className="search-icon">&#128269;</div>
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {playerData && (
          <div>
            <h2>Player Information</h2>
            <p>
              <strong>Name:</strong> {playerData.profile?.personaname}
            </p>
            <p>
              <strong>Steam ID:</strong> {playerData.profile?.steamid}
            </p>
            {playerData.profile?.avatarfull && (
              <div>
                <p>
                  <strong>Avatar:</strong>
                </p>
                <img
                  src={playerData.profile.avatarfull}
                  alt="Avatar"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
            <p>
              <strong>Country:</strong> {playerData.profile?.loccountrycode}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {playerData.profile?.last_login &&
                new Date(playerData.profile.last_login).toLocaleString()}
            </p>
            <p>
              <strong>MMR:</strong> {playerData.mmr_estimate?.estimate ?? "N/A"}
            </p>
            <p>
              <strong>Player Level:</strong> {playerData.profile?.account_id}
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
