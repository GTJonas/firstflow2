import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceholderImage from "../assets/default.png";
import "./Company-Style-Module.css";
import ChangeCompanyProfilePopup from "../components/company/changeCompanyProfilePopup.tsx";
import CreateCompanyProfile from "../components/company/createCompanyProfile.tsx";

import PlaceholderCompanylogo from "../assets/company/company-picture.png";
import Placeholderbanner from "../assets/company/banner.png";

function Company() {
  const { uuid } = useParams();
  const [companyData, setCompanyData] = useState({ loading: true, data: null });
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    axios
      .get(`http://194.71.0.30:8000/api/company/show/${uuid}`)
      .then((response) => {
        setCompanyData({ loading: false, data: response.data });
      })
      .catch((error) => {
        console.error("Error fetching company profile:", error);
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
    const supervisorName = supervisor
      ? `${supervisor.firstName} ${supervisor.lastName}`
      : "N/A";

    return (
      <>
        <div>
          <img
            className={"Banner"}
            src={company.banner || Placeholderbanner} // Use Placeholderbanner if company.banner is falsy
            alt="Banner"
            onError={(e) => {
              e.target.src = Placeholderbanner; // Use Placeholderbanner on error
            }}
          />
        </div>
        <div className={"ContentWrapper"}>
          <div className={"CompanyHeader"}></div>
          <div className="container-fluid row pt-3  ">
            <div className={"students col "}>
              <div>
                <img
                  className={"Companylogo"}
                  src={company.profilePicture || PlaceholderCompanylogo} // Use PlaceholderCompanylogo if company.profilePicture is falsy
                  alt="Company_Picture"
                  onError={(e) => {
                    e.target.src = PlaceholderCompanylogo; // Use PlaceholderCompanylogo on error
                  }}
                />
              </div>
              <h2>{company.name}</h2>
              <p>{company.category}</p>
              {company.category === "" ? (
                <p>arbetsamhet : {company.category}</p>
              ) : (
                <p>ingen arbetsamhet</p>
              )}
              {company.location == "" ? (
                <p>Ort: {company.location}</p>
              ) : (
                <p>Plats finns inte</p>
              )}
              {company.about ? (
                <p>Om: {company.about}</p>
              ) : (
                <p>Om: Företaget har inte skrivit något</p>
              )}
            </div>
            <div className={"Supervisor  col"}>
              <img
                src={supervisor.profile_picture || PlaceholderImage} // Use Placeholderbanner if company.banner is falsy
              />
              <h4>{supervisorName}</h4>
              <p>{supervisor.role}</p>
              <h5>Email</h5>
              <p>{supervisor.email}</p>
              {supervisor.phoneNumber ? (
                <>
                  <h5>Telefonnummer</h5>
                  <p>{supervisor.phoneNumber}</p>
                </>
              ) : null}

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
        </div>
      </>
    );
  }
}

export default Company;
