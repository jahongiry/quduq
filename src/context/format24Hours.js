export const convertTo24Hours = time12h => {
	let timeParts = time12h.split(/[:\s]/)

	let hours = parseInt(timeParts[0])
	let minutes = parseInt(timeParts[1])
	let seconds = parseInt(timeParts[2])
	let period = timeParts[3].toUpperCase()

	if (period === 'PM' && hours < 12) {
		hours += 12
	}

	if (period === 'AM' && hours === 12) {
		hours = 0
	}

	let hoursFormatted = hours < 10 ? '0' + hours : hours
	let minutesFormatted = minutes < 10 ? '0' + minutes : minutes
	let secondsFormatted = seconds < 10 ? '0' + seconds : seconds

	return hoursFormatted + ':' + minutesFormatted + ':' + secondsFormatted
}
