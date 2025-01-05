import { useCallback, useEffect, useState } from "react";
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
import { useLoading } from "redux/selectors";
import classes from "./wells.module.css";

const WellSingle = () => {
  const { wellId } = useParams();
  const dispatch = useDispatch();

  const [wellDetails, setWellDetails] = useState({});
  const [wellStatistics, setWellStatistic] = useState([]);
  const [filteredStatistics, setFilteredStatistics] = useState([]);
  const [currentDate, setNow] = useState(new Date());
  const [selectedStatistic, setSelectedStatistic] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);
  const loading = useLoading();

  const fetchWellData = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const { data } = await getWells(wellId);
      setWellDetails(data);
    } catch (error) {
      console.error("Error fetching well data:", error);
    } finally {
      setLoadingStatus(false);
    }
  }, [wellId]);

  useEffect(() => {
    fetchWellData();
  }, [fetchWellData]);

  const fetchStatisticsForWell = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const { data } = await getWellStatistic(wellDetails?.number);
      setWellStatistic(data);
      // dispatch(setLoading(data));
      setLoadingStatus(false);
    } catch (error) {
      console.error("Error fetching well statistics:", error);
    } finally {
      setLoadingStatus(false);
    }
  }, [dispatch, wellDetails]);

  useEffect(() => {
    if (wellDetails?.number) {
      fetchStatisticsForWell();
    }
  }, [wellDetails]);

  useEffect(() => {
    if (wellStatistics && wellStatistics.length > 0) {
      const filtered = wellStatistics.filter((stat) => {
        const statDate = new Date(stat.received_at);
        const statDateTimezoneOffset = statDate.getTimezoneOffset();
        const localStatDate = new Date(
          statDate.getTime() - statDateTimezoneOffset * 60 * 1000
        );
        const currentDateWithoutTime = currentDate.toLocaleDateString();
        const statDateWithoutTime = localStatDate.toLocaleDateString();

        return currentDateWithoutTime === statDateWithoutTime;
      });

      setFilteredStatistics(filtered);

      if (filtered.length > 0) {
        setSelectedStatistic(filtered[filtered.length - 1]);
      }
    }
  }, [wellStatistics, currentDate]);

  const handleButtonClick = (data) => {
    setSelectedStatistic(data);
  };

  const options = [
    {
      icon: IconWaterpolo,
      label: "Suv yer sathidan",
      value: selectedStatistic?.water_level || "malumot yoq",
      color: "aqua",
    },
    {
      icon: IconTemperature,
      label: "Suv harorati",
      value:
        parseFloat(selectedStatistic?.temperature).toFixed(2) || "malumot yoq",
      color: "#FAB005",
    },
    {
      icon: IconCookie,
      label: "Sho'rlanish darajasi",
      value:
        (parseFloat(selectedStatistic?.salinity) / 1000).toFixed(2) ||
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
      <h1>{wellDetails.name}</h1>
      <div className={classes.root} style={{ position: "relative" }}>
        <Group style={{ flex: 1 }}>
          <Group
            display={"flex"}
            direction={"row"}
            align={"center"}
            justify={"center"}
            className={classes.hours}
          >
            {filteredStatistics.map((data) => (
              <Button
                className="active_btn"
                onClick={() => handleButtonClick(data)}
                key={data.received_at}
                style={{
                  backgroundColor:
                    selectedStatistic === data ? "darkgrey" : "lightgrey",
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
          <p className={classes.date}>{`${currentDate.getFullYear()}-${
            currentDate.getMonth() + 1
          }-${currentDate.getDate()}`}</p>
          {stats}
        </Group>
        <div className={classes.data_picker}>
          <DataPicker now={currentDate} setNow={setNow} />
        </div>
      </div>
      <iframe
        className={classes.iframe}
        title="Well Location"
        loading="lazy"
        src={`https://maps.google.com/maps?q=${wellDetails.latitude},${wellDetails.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
    </>
  );
};

export default WellSingle;
