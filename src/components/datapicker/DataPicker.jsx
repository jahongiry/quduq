import { DatePickerInput } from '@mantine/dates'
import PropTypes from 'prop-types'

export const DataPicker = ({ mem, setMem }) => {
	return (
		<DatePickerInput
			clearable
			defaultValue={new Date()}
			value={mem}
			onChange={setMem}
			label='Pick date'
			placeholder='Vaqtni tanlang'
			color='blue'
			styles={{
				input: {
					backgroundColor: '#eee',
					color: '#333',
				},
				dropdown: {
					backgroundColor: '#333',
				},
			}}
		/>
	)
}


DataPicker.propTypes = {
	mem: PropTypes.instanceOf(Date).isRequired,
	setMem: PropTypes.func.isRequired,
};