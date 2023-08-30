import React, { useState, useEffect } from 'react';
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const API_URL = 'http://192.168.1.78:8000';

function CompanyLists() {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        try {
            const url = `${API_URL}/api/search-company`;

            // Add searchQuery to URL if present
            if (searchQuery) {
                url += `?search=${searchQuery}`;
            }

            console.log('Fetching from:', url);
            const response = await axios.get(url);
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const favoriteCompany = async (companyId) => {
        try {
            const response = await axios.post(`${API_URL}/api/favorite-company/${companyId}`, {}, getAuthHeaders());
            console.log(response.data.message);
            // Refresh the list of companies after favoriting
            fetchCompanies();
        } catch (error) {
            console.error('Error favoriting company:', error);
        }
    };

    const removeFavoriteCompany = async (companyId) => {
        try {
            const response = await axios.post(`${API_URL}/api/remove-favorite-company/${companyId}`, {}, getAuthHeaders());
            console.log(response.data.message);
            // Refresh the list of companies after removing from favorites
            fetchCompanies();
        } catch (error) {
            console.error('Error removing favorite company:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    return (
        <div>
            <h1>Company Profiles</h1>
            <form onSubmit={fetchCompanies}>
                <input
                    type="text"
                    placeholder="Search for companies"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <ul>
                {companies.map((companyData, index) => (
                    <li key={index}>
                        <img src={companyData.company.profile_picture} alt=""/>
                        <h2>{companyData.company.name}</h2>
                        <p>{companyData.category}</p>
                        <p>Location: {companyData.company.location}</p>
                        <p>About: {companyData.company.about}</p>
                        <p>Supervisor: {companyData.supervisor?.firstName || 'N/A'} {companyData.supervisor?.lastName || ''}</p>
                        <a href={companyData.url}>URL</a>
                        <button onClick={() => favoriteCompany(companyData.company.uuid)}>Favorite</button>
                        <button onClick={() => removeFavoriteCompany(companyData.company.uuid)}>Remove Favorite</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompanyLists;
