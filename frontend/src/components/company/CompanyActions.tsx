import React from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const API_URL = "http://5.152.153.222:8000";

function CompanyActions({ company, onFavorite, onRemoveFavorite }) {
  return (
    <div>
      <button onClick={handleFavorite}>Favorite</button>
      <button onClick={handleRemoveFavorite}>Remove Favorite</button>
    </div>
  );
}

export default CompanyActions;
