import { useEffect, useRef, useState } from "react";
import { getTownList, getTownPrice } from "../API/request";
import styles from "./ozonPriceCalculator.module.scss";
import DropdownCard from "../components/dropdownCard";
import { useOnClickOutside } from "../customHooks/customHooks";

const OzonPriceCalculator = () => {
  const [townList, setTownList] = useState([]);
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

  useEffect(() => {
    getTownList().then((data) => setTownList(data.townlist));
  }, []);

  const currentTownSelect = (data) => {
    setSelectedTown(data);
    setOptionsToggler(!optionsToggler);
    document.getElementById("townInput").value = "";
    setFilterTowns("");
  };

  const showPrice = async () => {
    const pricelist = await getTownPrice(selectedTown.ID);
    for (let index = 0; index < pricelist.pricelist.length; ++index) {
      if (
        weight >= pricelist.pricelist[index].MinWeight === true &&
        weight <= pricelist.pricelist[index].MaxWeight === true
      ) {
        const currentPrice = await pricelist.pricelist[index].Price;
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
