import {
  Button,
  Center,
  Flex,
  Indicator,
  Loader,
  Menu,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  keys,
  rem,
} from "@mantine/core";
import {
  IconBrandGoogleMaps,
  IconEdit,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { getStatistics, getWells, wellDelete } from "api";
import AddWells2 from "components/add-weels2";
import { sendMessage } from "components/request-modal";
import { convertTo24Hours } from "context/format24Hours";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoading } from "redux/loading";
import { useLoading, useUser, useWells } from "redux/selectors";
import { setWells } from "redux/wells";
import { sendDeletedWells } from "utils";
// import { addFiveHours } from "./addFiveHours";
import Th from "./th";
// import { timeComparison } from "./timeComparison";

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  if (sortBy === "status") {
    if (payload.reversed) {
      return [...data]
        .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]))
        .reverse();
    }
    return [...data].sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]));
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

const openMap = (e, item) => {
  e.stopPropagation();
  const link = `https://www.google.com/maps/search/?api=1&query=${item?.latitude},${item?.longitude}`;
  window.open(link);
};

export default function Wells2() {
  const dispatch = useDispatch();
  const loading = useLoading();
  const { pathname } = useLocation();
  const data = useWells();
  const user = useUser();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [editModal2, setEditModal2] = useState({});
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [staticsData, setStaticsData] = useState([]);
  const [status, setStatus] = useState(false);

  const getStat = useCallback(() => {
    getStatistics()
      .then(({ data }) => {
        setIsLoading(false);
        setStaticsData(data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("====================================");
        console.log(err);
        console.log("====================================");
      });
  }, [dispatch]);
  const getData = useCallback(() => {
    dispatch(setLoading(true));
    getWells()
      .then(({ data }) => {
        dispatch(setLoading(false));
        dispatch(setWells(data));
      })
      .catch(({ message }) => {
        dispatch(setLoading(false));
        console.log(message);
      });
  }, [dispatch, pathname]);

  useEffect(() => {
    setSortedData(data);
  }, [data]);
  useEffect(() => {
    getStat();
  }, [getStat, pathname, status]);
  useEffect(() => {
    getData();
  }, [getData, pathname, status]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };
  const arr = [];
  for (let i = 0; i < sortedData.length; i++) {
    arr.push({ number: sortedData[i].number, name: sortedData[i].name });
  }

  const singleData = [];
  for (let i = 0; i < arr.length; i++) {
    singleData.push({
      id: i,
      number: arr[i].number,
      data: staticsData.filter((el) => el.number == arr[i].number + ";"),
    });
  }

  const myLatestSingleData = [];
  for (let i = 0; i < singleData.length; i++) {
    myLatestSingleData.push([
      {
        number: singleData[i].number,
        data: singleData[i].data[singleData[i].data.length - 1],
      },
    ]);
  }

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const deleteWell = useCallback(
    (well) => {
      dispatch(setLoading(true));
      wellDelete(well?.well_id)
        .then(({ data }) => {
          toast.success(data.message);
          dispatch(setLoading(false));
          sendMessage(
            sendDeletedWells({
              adminId: user?.user_id,
              adminName: user?.name,
              phone: well?.number,
              wellName: well?.name,
              wellId: well?.well_id,
            }),
            setLoading,
            close
          );
          getData();
        })
        .catch((err) => {
          toast.error(err.message || "Xatolik");
          dispatch(setLoading(false));
        });
    },
    [dispatch, getData, user]
  );

  const rows = useMemo(
    () =>
      sortedData?.map((row, key) => (
        <Table.Tr key={row?.well_id + key}>
          <Table.Td style={{ cursor: "pointer" }}>
            <Link to={`/well/${row?.well_id}`}>{row?.name}</Link>
          </Table.Td>
          <Table.Td>
            <Flex align={"center"}>
              <Text pr={"lg"}>Quduq holati</Text>
              <Indicator zIndex={1} color={row.status ? "blue" : "red"} />
            </Flex>
          </Table.Td>
          <Table.Td
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={(e) => openMap(e, row)}
          >
            <IconBrandGoogleMaps />
          </Table.Td>
          <Table.Td>
            <Tooltip
              color={!user?.user_id ? "red " : "blue"}
              label={
                user?.user_id
                  ? "Quduq ma'lumotini o'zgartirish"
                  : "Faqat nazoratchilar uchun"
              }
            >
              <Flex justify={"center"}>
                <Button
                  disabled={!user?.user_id}
                  onClick={() => setEditModal2(row)}
                >
                  <IconEdit />
                </Button>
              </Flex>
            </Tooltip>
          </Table.Td>
          <Table.Td>
            <Tooltip
              color={"red "}
              label={
                user?.user_id
                  ? "Quduqni o'chirish"
                  : "Faqat nazoratchilar uchun"
              }
            >
              <Flex justify={"center"}>
                <Menu position="right" openDelay={100} closeDelay={400}>
                  <Menu.Target disabled={!user?.user_id}>
                    <Button color="red">
                      <IconTrash />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown title="Ochirilsinmi">
                    <Text px={"lg"} py={"xs"} fw={600}>
                      {"O'chirilsinmi"}
                    </Text>
                    <Menu.Item
                      bg={"#ff00003d"}
                      c={"red"}
                      onClick={() => deleteWell(row)}
                    >
                      Ha
                    </Menu.Item>
                    <Menu.Item mt={"sm"} bg={"#00ff002f"}>
                      {"Yo'q"}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Tooltip>
          </Table.Td>
        </Table.Tr>
      )),
    [sortedData, deleteWell, user?.user_id]
  );

  return (
    <>
      <AddWells2
        onClose={() => setEditModal2({})}
        id={editModal2?.well_id}
        initialValues={editModal2}
      />
      <TextInput
        placeholder="Qidiruv barcha ma'lumotlar bo'yicha"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Button style={{ margin: "20px 0" }} onClick={() => setStatus((v) => !v)}>
        Quduq xolatini tekshirish
      </Button>
      <Text style={{ margin: "0 0 20px 0" }} visibleFrom="sm">
        {user?.user_id ? <AddWells2 /> : null}
      </Text>
      {loading || isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <ScrollArea maw={"calc(100dvw - 32px)"}>
          <Table
            withTableBorder
            withColumnBorders
            highlightOnHover
            withRowBorders
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={700}
            layout="fixed"
          >
            <Table.Tbody>
              <Table.Tr>
                {user?.user_id && (
                  <Th
                    sorted={sortBy === "status"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("status")}
                  >
                    Aktiv quduq
                  </Th>
                )}
                <Th
                  sorted={sortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Quduq nomi
                </Th>
                {/* <Th disabled>Telefon Raqami</Th> */}
                <Th disabled>Joylashuvi</Th>
                <Th disabled>{"O'zgartirish"}</Th>
                <Th disabled>{"O'chirish"}</Th>
              </Table.Tr>
              <Table.Tr></Table.Tr>
            </Table.Tbody>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={user?.user_id ? 6 : 5}>
                    <Text fw={500} ta="center">
                      Quduqlar topilmadi
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </>
  );
}
