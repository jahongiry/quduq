/* eslint-disable react/prop-types */
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import {
  Modal,
  Button,
  TextInput,
  Group,
  Tooltip,
  Checkbox,
} from "@mantine/core";
import { getWells, wellCreate, wellUpdate, wellCreateDev } from "api";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "redux/loading";
import { setWells } from "redux/wells";
import { toast } from "react-toastify";
import { sendEditedWells } from "utils";
import { useUser } from "redux/selectors";
import { sendMessage } from "./request-modal";

export default function AddWells2({ initialValues, id = null, onClose }) {
  console.log("AddWells2");

  const user = useUser();
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
      number: "",
      address: "",
      latitude: "",
      longitude: "",
      salinity_start: "",
      salinity_end: "",
      temperature_start: "",
      temperature_end: "",
      water_level_start: "",
      water_level_end: "",
      depth: "",
      auto: false,
    },
    validate: {
      number: (value) =>
        [9, 12].includes(value?.length)
          ? undefined
          : "Telefon raqami formati noto'g'ri",
    },
  });
  const setValue = form.setValues;
  const reset = form.reset;
  useEffect(() => {
    if (id) {
      open();
      setValue({
        name: initialValues?.name,
        number: initialValues?.number,
        address: initialValues?.address,
        latitude: initialValues?.latitude,
        longitude: initialValues?.longitude,
        salinity_start: initialValues?.salinity_start,
        salinity_end: initialValues?.salinity_end,
        temperature_start: initialValues?.temperature_start,
        temperature_end: initialValues?.temperature_end,
        water_level_start: initialValues?.water_level_start,
        water_level_end: initialValues?.water_level_end,
        depth: initialValues?.depth,
        auto: initialValues?.auto || false,
      });
    } else reset();
  }, [initialValues, id, open, setValue, reset]);

  const noEditedForm = useMemo(
    () =>
      Boolean(
        !Object.keys(form.values).filter((item) => {
          const initialValue = initialValues?.[item];
          const formValue = form.values?.[item];

          if (
            typeof initialValue === "string" &&
            typeof formValue === "string"
          ) {
            return initialValue.trimEnd() !== formValue.trimEnd();
          }

          return initialValue !== formValue;
        }).length
      ),
    [form.values, initialValues]
  );

  const getData = useCallback(() => {
    dispatch(setLoading(true));
    getWells()
      .then(({ data }) => {
        dispatch(setLoading(false));
        dispatch(setWells(data));
        close();
        onClose && onClose();
      })
      .catch(({ message }) => {
        dispatch(setLoading(false));
        console.log(message);
      });
  }, [dispatch, close, onClose]);

  const onSubmit = (values) => {
    dispatch(setLoading(true));
    if (id) {
      wellUpdate(id, values)
        .then(({ data }) => {
          console.log(data);
          sendMessage(
            sendEditedWells({
              adminId: user?.user_id,
              adminName: user?.name,
              phone: values?.number,
              wellName: values?.name,
              wellId: initialValues?.well_id,
            }),
            setLoading,
            close
          );
          getData();
        })
        .catch((err) => {
          toast.error(err.message || "Xatolik");
          dispatch(setLoading(false));
          console.log(err);
        });
    } else {
      wellCreateDev(values)
        .then(({ data }) => {
          console.log("DataDev", data);
          getData();
          toast.success(data.message);
        })
        .catch((err) => {
          toast.error(err.message || "Xatolik");
          dispatch(setLoading(false));
          console.log(err);
        });
    }
  };

  function formatTelephoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");

    const formatted = `+${cleaned.slice(0, 3)} (${cleaned.slice(
      3,
      5
    )}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(
      10,
      12
    )}`;

    return formatted;
  }

  return (
    <>
      <Modal
        opened={opened || !!id}
        onClose={() => {
          close();
          id && onClose();
        }}
        title={`Quduq${id ? "ni yangilash" : " yaratish"} `}
        centered
      >
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            label="Nomi"
            placeholder="Nomi"
            m={"md"}
            {...form.getInputProps("name")}
          />
          <div className="caret-label" style={{ position: "relative" }}>
            <p
              style={{
                display: form.getInputProps("number").error
                  ? "none"
                  : "inline-block",
                position: "absolute",
                zIndex: [3, 5, 8, 10, 12].includes(
                  form.getInputProps("number")?.value?.length
                )
                  ? 2
                  : -1,
                bottom: "-10px",
                left: "29px",
                right: "30px",
                height: "25px",
                pointerEvents: "none",
                background: "#2e2e2e",
                fontSize:
                  "var(--_input-fz,var(--input-fz,var(--mantine-font-size-sm)))",
              }}
            >
              {formatTelephoneNumber(form.getInputProps("number").value)}
              <span className="custom-caret">|</span>
            </p>
            <TextInput
              label="Telefon raqami"
              type="number"
              m={"md"}
              withAsterisk
              placeholder={"+998 (77) 123-45-67"}
              {...form.getInputProps("number")}
              onChange={(e) => {
                e.target.value?.length > 12
                  ? null
                  : form.getInputProps("number")?.onChange(e);
              }}
            />
          </div>
          <TextInput
            label="Manzil3333"
            placeholder="Manzili"
            m={"md"}
            {...form.getInputProps("address")}
          />
          <TextInput
            label="Latitude"
            placeholder="Kenglikgi"
            m={"md"}
            {...form.getInputProps("latitude")}
          />
          <TextInput
            label="Longitude"
            placeholder="Uzunligi"
            m={"md"}
            {...form.getInputProps("longitude")}
          />
          <TextInput
            label="Salinity end"
            placeholder="Sho'rlanish tugashi"
            m={"md"}
            {...form.getInputProps("salinity_end")}
          />
          <TextInput
            label="Salinity start"
            placeholder="Sho'rlanish boshlanishi"
            m={"md"}
            {...form.getInputProps("salinity_start")}
          />
          <TextInput
            label="Temperature end"
            placeholder="Harorat tugashi"
            m={"md"}
            {...form.getInputProps("temperature_end")}
          />
          <TextInput
            label="Temperature start"
            placeholder="Harorat boshlanishi"
            m={"md"}
            {...form.getInputProps("temperature_start")}
          />
          <TextInput
            label="Water level end"
            placeholder="Suv darajasi tugashi"
            m={"md"}
            {...form.getInputProps("water_level_end")}
          />
          <TextInput
            label="Water level start"
            placeholder="Suv darajasi boshlanishi"
            m={"md"}
            {...form.getInputProps("water_level_start")}
          />
          <TextInput
            label="Well depth"
            placeholder="Quduq chuqurligi"
            m={"md"}
            {...form.getInputProps("depth")}
          />
          <Checkbox
            label="Auto"
            {...form.getInputProps("auto", { type: "checkbox" })}
          />
          <Group justify="flex-end">
            <Tooltip
              color={noEditedForm ? "red " : "blue"}
              label={noEditedForm ? "O'zgarish kiritilmagan" : "Yuborish"}
            >
              <Button disabled={noEditedForm} type="submit">
                {"Jo'natish"}
              </Button>
            </Tooltip>
          </Group>
        </form>
      </Modal>

      {onClose ? null : (
        <Button onClick={open}>
          <IconPlus size={16} /> {"Quduq qo'shish"}
        </Button>
      )}
    </>
  );
}
