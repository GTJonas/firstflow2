import { NavLink } from "react-router-dom";

const MenuItem = ({ items }) => {
  return items.map((item, index) => (
    <li key={item.label}>
      <NavLink to={item.link} key={index}>
        <i className={item.icon}></i>
        <span>{item.label.toUpperCase()}</span> {/* Uppercase the label */}
      </NavLink>
    </li>
  ));
};

export default MenuItem;
