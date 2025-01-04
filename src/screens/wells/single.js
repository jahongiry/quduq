import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Group, Loader, Center, Paper, Text, rem } from "@mantine/core";
import "@mantine/core/styles.css";
import {
  IconCookie,
  IconTemperature,
  IconWaterpolo,
} from "@tabler/icons-react";

import { DataPicker } from "components/datapicker/DataPicker";
import { getWells, getWellStatistic } from "api";
import { useLoading, useStatistics } from "redux/selectors";
import { setLoading } from "redux/loading";
import Chart from "chart.js/auto";
import classes from "./wells.module.css";

const WellSingle = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [wellStatistic, setWellStatistic] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [now, setNow] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loading = useLoading();

  const chartRefs = {
    daily: {
      SuvYerSathidan: useRef(null),
      SuvHarorati: useRef(null),
      ShurlanishDarajasi: useRef(null),
    },
    weekly: {
      SuvYerSathidan: useRef(null),
      SuvHarorati: useRef(null),
      ShurlanishDarajasi: useRef(null),
    },
    monthly: {
      SuvYerSathidan: useRef(null),
      SuvHarorati: useRef(null),
      ShurlanishDarajasi: useRef(null),
    },
  };

  const getData = useCallback(() => {
    setIsLoading(true);
    getWells(id)
      .then(({ data }) => {
        setIsLoading(false);
        setItem(data);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const getWellStat = useCallback(() => {
    setIsLoading(true);
    getWellStatistic(item?.number)
      .then(({ data }) => {
        setIsLoading(false);
        dispatch(setWellStatistic(data));
      })
      .catch(() => setIsLoading(false));
  }, [dispatch, item]);

  useEffect(() => {
    if (item.number) {
      console.log("Work");
      getWellStat();
    }
  }, [item.number, getWellStat]);

  useEffect(() => {
    const filtered = wellStatistic.filter(
      (stat) =>
        stat?.number === item?.number &&
        new Date(stat.received_at).getDate() === now.getDate()
    );
    console.log(filtered);
    setFilteredData(filtered);

    if (filtered.length > 0) {
      setSelectedOption(filtered[filtered.length - 1]);
    }
  }, [now, wellStatistic, item?.number]);

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

  return loading || isLoading ? (
    <Center>
      <Loader />
    </Center>
  ) : (
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
                {new Date(
                  new Date(data.received_at).getTime() + 5 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split("T")[1]
                  .slice(0, 5)}
              </Button>
            ))}
          </Group>
          <p className={classes.date}>{`${now.getFullYear()}-${
            now.getMonth() + 1
          }-${now.getDate()}`}</p>
          {stats}
        </Group>
        <div className={classes.data_picker}>
          <DataPicker now={now} setNow={setNow} />
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
