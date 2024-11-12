import { useCallback, useEffect, useState, useRef } from "react";
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

import { DataPicker } from "components/datapicker/DataPicker";
import { getStatistics, getWells, getWellStatistic } from "api";
import { useStatistics } from "redux/selectors";
import Chart from "chart.js/auto";
import classes from "./wells.module.css";

const WellSingle = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [wellStatistic, setWellStatistic] = useState([]);
  const [now, setNow] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const statistics = useStatistics();
  const [isLoading, setIsLoading] = useState(false);

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

  const getStat = useCallback(() => {
    getStatistics()
      .then(({ data }) => {
        setIsLoading(false);
        dispatch(setStatistics(data));
      })
      .catch(() => setIsLoading(false));
  }, [dispatch]);

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
    getData();
    getStat();
  }, [getData, getStat]);

  useEffect(() => {
    if (item.number) {
      getWellStat();
    }
  }, [item.number, getWellStat]);

  useEffect(() => {
    const filtered = statistics.filter(
      (stat) =>
        stat?.number === item?.number &&
        new Date(stat.received_at).getDate() === now.getDate()
    );
    setFilteredData(filtered);

    if (filtered.length > 0) {
      setSelectedOption(filtered[filtered.length - 1]);
    }
  }, [now, statistics, item?.number]);

  const handleButtonClick = (data) => {
    setSelectedOption(data);
  };

  const today = new Date(now).toISOString().split("T")[0];
  const todayData = wellStatistic.filter((item) =>
    item.received_at.startsWith(today)
  );

  const todayRicivedDataTime = todayData.map((item) => {
    const date = new Date(item.received_at);
    return date.toTimeString().slice(0, 5);
  });

  const waterLevelsToday = todayData.map((item) => item.water_level);
  const waterTemperaturesToday = todayData.map((item) => item.temperature);
  const waterSalinityToday = todayData.map((item) => item.salinity);

  function getWeeklyDataForSelectedDate(data, selectedDate) {
    const selected = new Date(selectedDate);
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - selected.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weeklyData = data.filter((item) => {
      const itemDate = new Date(item.received_at);
      return itemDate >= startOfWeek && itemDate < endOfWeek;
    });

    const dailyData = weeklyData.reduce((acc, item) => {
      const date = new Date(item.received_at).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.keys(dailyData).map((date) => {
      const dayData = dailyData[date];
      const averageWaterLevel =
        dayData.reduce((sum, item) => sum + parseFloat(item.water_level), 0) /
        dayData.length;
      const averageTemperature =
        dayData.reduce((sum, item) => sum + parseFloat(item.temperature), 0) /
        dayData.length;
      const averageSalinity =
        dayData.reduce((sum, item) => sum + parseFloat(item.salinity), 0) /
        dayData.length;
      return {
        date,
        averageWaterLevel,
        averageTemperature,
        averageSalinity,
      };
    });
  }

  const selectedDate = new Date(now).toISOString().split("T")[0];
  const weeklyAverages = getWeeklyDataForSelectedDate(
    wellStatistic,
    selectedDate
  );

  const weeklyAverageWaterLevel = [];
  const weeklyAverageTemperature = [];
  const weeklyAverageSalinity = [];

  weeklyAverages.forEach(
    ({ averageWaterLevel, averageTemperature, averageSalinity }) => {
      weeklyAverageWaterLevel.push(averageWaterLevel);
      weeklyAverageTemperature.push(averageTemperature);
      weeklyAverageSalinity.push(averageSalinity);
    }
  );

  const selectedDateByMonth = new Date(now);
  const selectedMonth = selectedDateByMonth.getMonth();

  const filteredDataByMonth = wellStatistic.filter((item) => {
    const itemDate = new Date(item.received_at);
    return itemDate.getMonth() === selectedMonth;
  });

  const averagedDataByDay = Object.values(
    filteredDataByMonth.reduce((acc, item) => {
      const itemDate = new Date(item.received_at);
      const date = itemDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!acc[date]) {
        acc[date] = {
          date,
          count: 0,
          totalWaterLevel: 0,
          totalTemperature: 0,
          totalSalinity: 0,
        };
      }

      acc[date].count += 1;
      acc[date].totalWaterLevel += parseFloat(item.water_level);
      acc[date].totalTemperature += parseFloat(item.temperature);
      acc[date].totalSalinity += parseFloat(item.salinity);

      return acc;
    }, {})
  ).map((day) => ({
    date: day.date,
    avgWaterLevel: (day.totalWaterLevel / day.count).toFixed(2),
    avgTemperature: (day.totalTemperature / day.count).toFixed(2),
    avgSalinity: (day.totalSalinity / day.count / 1000).toFixed(2),
  }));

  const {
    monthDay,
    monthAvgWaterLevel,
    monthAvgTemperature,
    monthAvgSalinity,
  } = averagedDataByDay.reduce(
    (acc, item) => {
      acc.monthDay.push(item.date);
      acc.monthAvgWaterLevel.push(item.avgWaterLevel);
      acc.monthAvgTemperature.push(item.avgTemperature);
      acc.monthAvgSalinity.push(item.avgSalinity);
      return acc;
    },
    {
      monthDay: [],
      monthAvgWaterLevel: [],
      monthAvgTemperature: [],
      monthAvgSalinity: [],
    }
  );

  const createChart = (ref, label, data, timeframe) => {
    if (ref.current) {
      ref.current.destroy();
    }

    const ctx = document
      .getElementById(`${timeframe}${label}Chart`)
      .getContext("2d");

    let labels;
    let borderColor;

    if (timeframe === "Kunlik") {
      labels = todayRicivedDataTime;
    } else if (timeframe === "Haftalik") {
      labels = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
    } else if (timeframe === "Oylik") {
      labels = monthDay;
    }

    if (label === "SuvYerSathidan") {
      borderColor = "#00FFFF";
    } else if (label === "SuvHarorati") {
      borderColor = "#FAB005";
    } else if (label === "ShurlanishDarajasi") {
      borderColor = "#FA5252";
    }

    ref.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: label + timeframe,
            data: data,
            fill: false,
            borderColor: borderColor,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  };

  useEffect(() => {
    // Suv yer sathidan chartsa
    createChart(
      chartRefs.daily.SuvYerSathidan,
      "SuvYerSathidan",
      waterLevelsToday,
      "Kunlik"
    );
    createChart(
      chartRefs.weekly.SuvYerSathidan,
      "SuvYerSathidan",
      weeklyAverageWaterLevel,
      "Haftalik"
    );
    createChart(
      chartRefs.monthly.SuvYerSathidan,
      "SuvYerSathidan",
      monthAvgWaterLevel,
      "Oylik"
    );

    // Suv harorati charts
    createChart(
      chartRefs.daily.SuvHarorati,
      "SuvHarorati",
      waterTemperaturesToday,
      "Kunlik"
    );
    createChart(
      chartRefs.weekly.SuvHarorati,
      "SuvHarorati",
      weeklyAverageTemperature,
      "Haftalik"
    );
    createChart(
      chartRefs.monthly.SuvHarorati,
      "SuvHarorati",
      monthAvgTemperature,
      "Oylik"
    );

    // Sho'rlanish darajasi charts
    createChart(
      chartRefs.daily.ShurlanishDarajasi,
      "ShurlanishDarajasi",
      waterSalinityToday,
      "Kunlik"
    );
    createChart(
      chartRefs.weekly.ShurlanishDarajasi,
      "ShurlanishDarajasi",
      weeklyAverageSalinity,
      "Haftalik"
    );
    createChart(
      chartRefs.monthly.ShurlanishDarajasi,
      "ShurlanishDarajasi",
      monthAvgSalinity,
      "Oylik"
    );
  }, [selectedOption]);

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
          <p className={classes.date}>{`${now.getFullYear()}-${
            now.getMonth() + 1
          }-${now.getDate()}`}</p>
          {stats}
        </Group>
        <div className={classes.data_picker}>
          <DataPicker now={now} setNow={setNow} />
        </div>
      </div>
      <div className={classes.diagrams}>
        <div className={classes.diagramItem}>
          <canvas id="KunlikSuvYerSathidanChart"></canvas>
          <canvas id="HaftalikSuvYerSathidanChart"></canvas>
          <canvas id="OylikSuvYerSathidanChart"></canvas>
        </div>
        <div className={classes.diagramItem}>
          <canvas id="KunlikSuvHaroratiChart"></canvas>
          <canvas id="HaftalikSuvHaroratiChart"></canvas>
          <canvas id="OylikSuvHaroratiChart"></canvas>
        </div>
        <div className={classes.diagramItem}>
          <canvas id="KunlikShurlanishDarajasiChart"></canvas>
          <canvas id="HaftalikShurlanishDarajasiChart"></canvas>
          <canvas id="OylikShurlanishDarajasiChart"></canvas>
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
