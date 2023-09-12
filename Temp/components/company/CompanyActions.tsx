const API_URL = "http://194.71.0.30:8000";

function CompanyActions({ company, onFavorite, onRemoveFavorite }) {
  return (
    <div>
      <button onClick={handleFavorite}>Favorite</button>
      <button onClick={handleRemoveFavorite}>Remove Favorite</button>
    </div>
  );
}

export default CompanyActions;
