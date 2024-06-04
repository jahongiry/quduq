export const monthToString = months => {
	const sortedMonths = months.split('-')[0]
	if (sortedMonths === '01') {
		return 'Jan'
	}
	if (sortedMonths === '02') {
		return 'Jan'
	}
	if (sortedMonths === '03') {
		return 'Mar'
	}
	if (sortedMonths === '04') {
		return 'Apr'
	}
	if (sortedMonths === '05') {
		return 'May'
	}
	if (sortedMonths === '06') {
		return 'Jun'
	}
	if (sortedMonths === '07') {
		return 'Jul'
	}
	if (sortedMonths === '08') {
		return 'Aug'
	}
	if (sortedMonths === '09') {
		return 'Sep'
	}
	if (sortedMonths === '10') {
		return 'Oct'
	}
	if (sortedMonths === '11') {
		return 'Nov'
	}
	if (sortedMonths === '12') {
		return 'Dec'
	}
}
