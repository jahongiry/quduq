import { DatePickerInput } from "@mantine/dates";
import PropTypes from "prop-types";

export const DataPicker = ({ now, setNow }) => {
  return (
    <DatePickerInput
      clearable
      defaultValue={new Date()}
      value={now}
      onChange={setNow}
      label="Pick date"
      placeholder="Vaqtni tanlang"
      color="blue"
      styles={{
        input: {
          backgroundColor: "#eee",
          color: "#333",
        },
        dropdown: {
          backgroundColor: "#333",
        },
      }}
    />
  );
};

DataPicker.propTypes = {
  now: PropTypes.instanceOf(Date).isRequired,
  setNow: PropTypes.func.isRequired,
};
