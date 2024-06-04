import moment from 'moment'

export const timeComparison = time => {
	const currentTime = moment()
	const targetTime = moment(time, 'hh:mm:ss A')
	const hoursDifference = currentTime.diff(targetTime, 'hours')

	return hoursDifference < 5
}
