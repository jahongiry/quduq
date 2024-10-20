export const addFiveHours = timeString => {
	const [hours = 0, minutes = 0, seconds = 0] = (
		timeString?.split(':') || []
	).map(Number) || [0, 0, 0]
	const newHours = (hours + 5) % 24
	const newTime = new Date(1970, 0, 1, newHours, minutes, seconds)

	return newTime.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	})
}
