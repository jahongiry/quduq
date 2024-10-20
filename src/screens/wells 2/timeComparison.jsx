import moment from 'moment'

export function timeComparison(givenTime, givenDate) {
	const givenDateTime = `${givenDate} ${givenTime}`
	const givenMoment = moment(givenDateTime, 'YYYY-MM-DD HH:mm:ss')

	const now = moment()

	if (givenMoment.isAfter(now)) {
		givenMoment.subtract(1, 'day')
	}

	const targetMoment = givenMoment.clone().add(12, 'hours')

	return now.isBefore(targetMoment)
}
