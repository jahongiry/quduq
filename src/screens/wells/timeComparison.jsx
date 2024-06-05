// import moment from 'moment'

// export const timeComparison = time => {
// 	const currentTime = moment()
// 	const targetTime = moment(time, 'hh:mm:ss A')
// 	const hoursDifference = currentTime.diff(targetTime, 'hours')

// 	return hoursDifference < 5
// }
import moment from 'moment'

export function timeComparison(givenTime) {
	const givenMoment = moment(givenTime, 'HH:mm:ss')

	// Add 12 hours to the given time
	const targetMoment = givenMoment.clone().add(5, 'hours')

	// Get the current time
	const now = moment()

	// Check if the current time is before the target moment
	return now.isBefore(targetMoment)
}
