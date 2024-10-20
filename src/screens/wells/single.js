import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setStatistics } from "redux/statistics";
import { Button, Group, Paper, Text, rem } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconCookie,
  IconTemperature,
  IconWaterpolo,
} from "@tabler/icons-react";

import classes from "./wells.module.css";
import { DataPicker } from "components/datapicker/DataPicker";
import { getStatistics, getWells } from "api";
import { useStatistics } from "redux/selectors";

const WellSingle = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [mem, setMem] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const statistics = useStatistics();

  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    getWells(id)
      .then(({ data }) => {
        setIsLoading(false);
        setItem(data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
      });
  }, [id]);

  const getStat = useCallback(() => {
    getStatistics()
      .then(({ data }) => {
        setIsLoading(false);
        dispatch(setStatistics(data));
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [dispatch]);

  useEffect(() => {
    getData();
    getStat();
  }, [getData, getStat]);

  useEffect(() => {
    const filtered = statistics.filter(
      (stat) =>
        stat?.number === item?.number &&
        stat?.received_at.split("T")[0] === mem.toISOString().split("T")[0]
    );
    setFilteredData(filtered);

    if (filtered.length > 0) {
      setSelectedOption(filtered[filtered.length - 1]);
    }
  }, [mem, statistics, item?.number]);

  const handleButtonClick = (data) => {
    setSelectedOption(data);
  };

  const options = [
    {
      icon: IconWaterpolo,
      label: "Suv yer sathidan",
      value: selectedOption?.water_level || "malumot yoq",
      color: "aqua",
    },
    {
      icon: IconTemperature,
      label: "Suv harorati",

      value:
        parseFloat(selectedOption?.temperature).toFixed(2) || "malumot yoq",
      color: "#FAB005",
    },

    {
      icon: IconCookie,
      label: "Sho'rlanish darajasi",
      value:
        (parseFloat(selectedOption?.salinity) / 1000).toFixed(2) ||
        "malumot yoq",
      color: "#FA5252",
    },
  ];
  console.log(typeof selectedOption?.temperature);
  const stats = options.map((well) => (
    <Paper
      className={classes.stat}
      style={{ background: `${well.color}`, border: "2px solid #eee" }}
      radius="md"
      shadow="md"
      p="xs"
      key={well.label}
    >
      <well.icon
        style={{ width: rem(32), height: rem(32) }}
        className={classes.icon_}
        stroke={1.5}
      />
      <div>
        <Text className={classes.label}>{well.label}</Text>
        <Text fz="xs" className={classes.count}>
          <span className={classes.value}>{well.value}</span>
        </Text>
      </div>
    </Paper>
  ));

  return (
    <>
      <h1>{item.name}</h1>
      <div className={classes.root} style={{ position: "relative" }}>
        <Group style={{ flex: 1 }}>
          <Group
            display={"flex"}
            direction={"row"}
            align={"center"}
            justify={"center"}
            className={classes.hours}
          >
            {filteredData.map((data) => (
              <Button
                className="active_btn"
                onClick={() => handleButtonClick(data)}
                key={data.received_at}
                style={{
                  backgroundColor:
                    selectedOption === data ? "darkgrey" : "lightgrey",
                }}
              >
                {data.received_at.split("T")[1].slice(0, 5)}
              </Button>
            ))}
          </Group>
          <p className={classes.date}>{`${mem.getFullYear()}-${
            mem.getMonth() + 1
          }-${mem.getDate()}`}</p>
          {stats}
        </Group>
        <div className={classes.data_picker}>
          <DataPicker mem={mem} setMem={setMem} />
        </div>
      </div>

      <iframe
        className={classes.iframe}
        title="Well Location"
        loading="lazy"
        src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
    </>
  );
};

export default WellSingle;
