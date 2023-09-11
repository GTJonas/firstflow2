import React, { useEffect, useState } from "react";
import Logo from "../../assets/Firstflow.png";
import Scrollbar from "./Scrollbar.tsx";

const SimilarComponent = () => {
  return (
    <div className="Menu">
      <div className="Mobile--top">
        <div>
          <img className="logo" src={Logo} alt="Logo" />
        </div>
        <div className="Mobile--menu">
          <div className="icon-hamburgermenu"></div>
        </div>
      </div>
      <div className="Mobile--Scroll">
        <Scrollbar />
      </div>
    </div>
  );
};

export default SimilarComponent;
