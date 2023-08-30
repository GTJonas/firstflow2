import axios from "axios";
import {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';

import PlaceholderImage from '../assets/default.png'
import "./Company-Style-Module.css"
import ChangeCompanyProfilePopup from "../components/company/changeCompanyProfilePopup.tsx";
import CreateCompanyProfile from "../components/company/createCompanyProfile.tsx";

function Company() {
    const { uuid } = useParams();
    const [companyData, setCompanyData] = useState({ loading: true, data: null });
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        axios.get(`http://192.168.1.78:8000/api/company/show/${uuid}`)
            .then(response => {
                setCompanyData({ loading: false, data: response.data });
            })
            .catch(error => {
                console.error('Error fetching company profile:', error);
                setCompanyData({ loading: false, data: null });
            });
    }, [uuid]);

    if (companyData.loading) {
        return <div>Loading...</div>;
    }

    if (!companyData.data) {
        return (
            <div>
                <CreateCompanyProfile />
            </div>
        );
    } else {

    const { company, supervisor } = companyData.data;
    const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : 'N/A';

    return (
      <div className={"ContentWrapper"}>
          <div className={"CompanyHeader"}>
              <div>
                  <img className={"Banner"} src={company.banner} alt="Banner"/>
              </div>
              <div>
                  <img className={"Companylogo"} src={company.profilePicture} alt="Company_Picture"/>
                  <h2>{company.name}</h2>
                  <p>{company.category}</p>
                  <p>Ort: {company.location}</p>
                  <p>Om: {company.about}</p>
              </div>
          </div>
          <div className={"Student"}>
              <img src={PlaceholderImage} />
              <h4>{supervisorName}</h4>
              <p>{supervisor.role}</p>
              <h5>Email</h5>
              <p>{supervisor.email}</p>
              <h5>Telefonnummer</h5>
              <p>{supervisor.phoneNumber}</p>
              <div>
                  <a href="#" onClick={togglePopup}>
                      Hantera Företagsprofil
                  </a>
                  {showPopup && (
                      <ChangeCompanyProfilePopup onClose={togglePopup} />
                  )}
              </div>
          </div>
      </div>
    );
    }
}

export default Company;