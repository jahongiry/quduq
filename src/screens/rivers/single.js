import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Paper, Group, rem, Text, Loader, Button } from "@mantine/core";
import {
  IconWaterpolo,
  IconTemperature,
  IconCookie,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import classes from "./rivers.module.css";
import { getStatistics, getWells } from "api";
import { useStatistics } from "redux/selectors";
import { setStatistics } from "redux/statistics";
import moment from "moment";
import { NotFound } from "screens/404";

const RiverSingle = () => {
  const dispatch = useDispatch();
  const statistics = useStatistics();
  const { id } = useParams();
  const [well, setWell] = useState({});
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(() => {
    setIsLoading(true);
    getWells(id)
      .then(({ wellData }) => {
        setIsLoading(false);
        setWell(wellData);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [id]);

  const getStat = useCallback(() => {
    getStatistics()
      .then(({ data }) => {
        setIsLoading(false);
        dispatch(setStatistics(data));
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    getData();
    getStat();
  }, [getData, getStat]);

  const options = [
    {
      icon: IconWaterpolo,
      label: "Suv yer sathidan",
      value: statistics[index]?.water_level,
    },
    {
      icon: IconTemperature,
      label: "Suv harorati",
      value: statistics[index]?.temperature,
    },
    {
      icon: IconCookie,
      label: "Sho'rlanish darajasi",
      value: statistics[index]?.salinity,
    },
  ];

  const stats = options.map((well) => (
    <Paper
      className={classes.stat}
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

  return well?.well_id ? (
    <>
      <h1>{well?.name}</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={classes.root}>
          <Group style={{ flex: 1 }}>
            <Group display={"grid"} ta={"center"} c={"#fff"}>
              <Button
                disabled={
                  !statistics?.length || index + 1 === statistics?.length
                }
                color={"green"}
                onClick={() =>
                  setIndex((_index) => {
                    if (_index + 1 === statistics?.length) {
                      return _index;
                    }
                    return _index + 1;
                  })
                }
              >
                <IconArrowUp />
              </Button>
              <Text>
                {moment(statistics[index]?.time).format("DD/MM/YYYY")}
              </Text>
              <Text>{moment(statistics[index]?.time).format("HH:MM:SS")}</Text>
              <Button
                disabled={!statistics?.length || index === 0}
                color={"green"}
                onClick={() =>
                  setIndex((_index) => {
                    if (_index === 0) {
                      return _index;
                    }
                    return _index - 1;
                  })
                }
              >
                <IconArrowDown />
              </Button>
            </Group>
            {stats}
          </Group>
        </div>
      )}

      <iframe
        className={classes.iframe}
        title={well.name}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${well?.latitude},${well?.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />
    </>
  ) : (
    <NotFound />
  );
};

export default RiverSingle;
