import React from 'react';
import axios from 'axios';
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const API_URL = 'http://192.168.1.78:8000';

function CompanyActions({ company, onFavorite, onRemoveFavorite }) {

    return (
        <div>
            <button onClick={handleFavorite}>Favorite</button>
            <button onClick={handleRemoveFavorite}>Remove Favorite</button>
        </div>
    );
}

export default CompanyActions;
