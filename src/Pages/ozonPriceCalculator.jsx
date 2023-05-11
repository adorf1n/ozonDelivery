import { useRef, useState } from "react";
import styles from "./ozonPriceCalculator.module.scss";
import DropdownCard from "../components/dropdownCard";
import { useOnClickOutside } from "../customHooks/customHooks";
import { townPrice } from "../data/townPrice";
import { townList } from "../data/townList";

const OzonPriceCalculator = () => {
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [optionsToggler, setOptionsToggler] = useState(false);
  const [selectedTown, setSelectedTown] = useState({
    Town: "Введите город...",
    Region: null,
  });
  const [filterTowns, setFilterTowns] = useState("");
  const [townInput, setTowninput] = useState("");
  const ref = useRef();
  const weightHandler = (event) => {
    event.preventDefault();
    setWeight(event.target.value);
  };

  const currentTownSelect = (data) => {
    setSelectedTown(data);
    setOptionsToggler(!optionsToggler);
    document.getElementById("townInput").value = "";
    setFilterTowns("");
  };

  const showPrice = async () => {
    let currentTownPriceList = [];
    for (let index = 0; index < townPrice.length; index++) {
    if(townPrice[index].TownID==selectedTown.ID)
      {
        currentTownPriceList.push(townPrice[index])
      }
    }
    console.log(currentTownPriceList);
    
    for (let index = 0; index < currentTownPriceList.length; ++index) {
      if (
        weight >= currentTownPriceList[index].MinWeight === true &&
        weight <= currentTownPriceList[index].MaxWeight === true
      ) {
        const currentPrice = await currentTownPriceList[index].Price;
        setPrice({ price: currentPrice });
      } else if (weight <= 0 || weight > 20000) {
        setPrice("Такого весового диапазона нет");
      }
    }
  };

  const isInValidAverage = weight < 0 || weight > 20000;

  useOnClickOutside(ref, () => setOptionsToggler(false));

  const townInputHandler = (e) => {
    e.preventDefault();
    setTowninput(e.target.value);
    setFilterTowns(() => {
      return townList.filter((item) => {
        return item.Town.toLowerCase().includes(e.target.value.toLowerCase());
      });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.towninput_container}>
        <h6 className={styles.h6}>Выберите город: </h6>
        <input
          id="townInput"
          placeholder={
            selectedTown.Region
              ? selectedTown.Town + ", " + selectedTown.Region
              : "Выберите город... "
          }
          type="search"
          className={styles.dropbtn}
          onClick={() => {
            setOptionsToggler(!optionsToggler);
          }}
          onChange={townInputHandler}
        />
      </div>
      <div className={styles.dropdown}>
        {optionsToggler && (
          <div ref={ref} className={styles.dropdown_content}>
            {filterTowns.length > 0
              ? filterTowns.map((data) => {
                  return (
                    <DropdownCard
                      regionName={data.Region}
                      key={data.ID}
                      townName={data.Town}
                      townID={data.ID}
                      onSelect={() => currentTownSelect(data)}
                    />
                  );
                })
              : townList.map((data) => {
                  return (
                    <DropdownCard
                      regionName={data.Region}
                      key={data.ID}
                      townName={data.Town}
                      townID={data.ID}
                      onSelect={() => currentTownSelect(data)}
                    />
                  );
                })}
          </div>
        )}
      </div>
      <div className={styles.weightInput_container}>
        <h6 className={styles.h6}>Введите вес от 1 до 20 000 (в гр): </h6>
        <input
          className={styles.weightinput}
          type="text"
          placeholder="Введите вес..."
          onChange={weightHandler}
        />
      </div>
      <button className={styles.btn_showprice} onClick={showPrice}>
        Рассчитать
      </button>
      {price && (
        <h5 className={styles.h5}>
          {isInValidAverage ? (
            <h6 className={styles.price}>Нет такого диапазона</h6>
          ) : (
            <div className={styles.totalPrice}>
              Итого: <span className={styles.price}>{price.price}</span> сом
            </div>
          )}
        </h5>
      )}
    </div>
  );
};

export default OzonPriceCalculator;
