import styles from "./dropdownCard.module.scss";

const DropdownCard = ({ townName, townID, onSelect }) => {
  return (
    <button id={townID} className={styles.btn} onClick={onSelect}>
      {townName}
    </button>
  );
};

export default DropdownCard;
