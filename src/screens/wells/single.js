import { Button, Group, Loader, Paper, Text, rem } from '@mantine/core'
import '@mantine/core/styles.css'
import { IconCookie, IconTemperature, IconWaterpolo } from '@tabler/icons-react'
import { getStatistics, getWells } from 'api'
import { DataPicker } from 'components/datapicker/DataPicker'
import { convertTo24Hours } from 'context/format24Hours'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useStatistics } from 'redux/selectors'
import { setStatistics } from 'redux/statistics'
import { NotFound } from 'screens/404'
import { addFiveHours } from './addFiveHours'
import { monthToNumber } from './monthToNumber'
import { monthToString } from './monthToString'
import classes from './wells.module.css'

const WellSingle = () => {
	const dispatch = useDispatch()
	const statistics = useStatistics()
	const { id } = useParams()
	const [item, setItem] = useState({})
	const [time, setTime] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	// const [value, setValue] = useState(null)
	const [mem, setMem] = useState(new Date())
	const [dataPickerDate, setDataPickerDate] = useState('')
	const [currentData, setCurrentData] = useState([])
	// const valueMonth = value ? value.toString() : ''
	const valueMonth = ''
	const months = monthToNumber(valueMonth.split(' ')[1])
	const filteredYear = valueMonth?.split(' ')[3]
	console.log('dataPickerDate', dataPickerDate)
	// console.log(statistics,)
	console.log('currentData', currentData)

	const getData = useCallback(() => {
		setIsLoading(true)
		getWells(id)
			.then(({ data }) => {
				setIsLoading(false)
				setItem(data)
			})
			.catch(({ message }) => {
				setIsLoading(false)
				console.log(message)
			})
	}, [id])

	// console.log(statistics.filter(stat => stat?.number === `${item?.number};`).filter(well => well.received_at.split('T')[0] === ))
	// console.log(
	// 	`${mem.toString().split(' ')[2]}-${monthToNumber(
	// 		mem.toString().split(' ')[1]
	// 	)}-${mem.toString().split(' ')[3]}`
	// )
	const data = [
		{
			date: 'Mar 22',
			water_level: 23.5,
			temperature: 26.6,
			salinity: 949,
		},
		{
			date: 'Mar 23',
			water_level: 15.5,
			temperature: 10.6,
			salinity: 549,
		},
		{
			date: 'Mar 25',
			water_level: 50.5,
			temperature: 30.6,
			salinity: 679,
		},
		{
			date: 'Mar 29',
			water_level: 2.5,
			temperature: 2.6,
			salinity: 1009,
		},
		{
			date: 'Mar 30',
			water_level: 23.5,
			temperature: 26.6,
			salinity: 949,
		},
	]
	useEffect(() => {
		setDataPickerDate(monthToNumber(mem.toString().split(' ')[1]))
		setCurrentData(
			statistics
				.filter(stat => stat?.number === `${item?.number};`)
				.filter(
					el =>
						el?.received_at.split('T')[0] ==
						`${mem.toString().split(' ')[3]}-${monthToNumber(
							mem.toString().split(' ')[1]
						)}-${mem.toString().split(' ')[2]}`
				)
		)
	}, [setMem])
	console.log(
		'water',
		statistics.filter(stat => stat?.number === `${item?.number};`)
	)
	const getStat = useCallback(() => {
		getStatistics()
			.then(({ data }) => {
				setIsLoading(false)
				dispatch(setStatistics(data))
			})
			.catch(err => {
				setIsLoading(false)
				console.log('====================================')
				console.log(err)
				console.log('====================================')
			})
	}, [dispatch])
	const isWellStatistics = useMemo(
		() => statistics.filter(stat => stat?.number === `${item?.number};`),
		[item?.number, statistics]
	)
	const prevData = isWellStatistics.filter(
		wells =>
			wells?.received_at?.split('-')[0] === filteredYear &&
			wells?.received_at?.split('-')[1] == months
	)
	for (let i = 0; i < prevData.length; i++) {
		data.push({
			data:
				monthToString(
					prevData[i].received_at.split('T')[0].split('-').slice(1).join('-')
				) +
				' ' +
				prevData[i].received_at.split('T')[0].split('-')[2],
			water_level: prevData[i].water_level,
			temperature: prevData[i].temperature,
			salinity: prevData[i].salinity,
		})
	}
	useEffect(() => {
		getData()
		getStat()
	}, [getData, getStat])
	const myWellStatics = time
		? isWellStatistics.find(statics => statics.received_at === time)
		: isWellStatistics[0]
	const options = [
		{
			icon: IconWaterpolo,
			label: 'Suv yer sathidan',
			value: statistics
				.filter(stat => stat?.number === `${item?.number};`)
				.filter(
					el =>
						el?.received_at.split('T')[0] ==
						`${mem.toString().split(' ')[3]}-${monthToNumber(
							mem.toString().split(' ')[1]
						)}-${mem.toString().split(' ')[2]}`
				).length
				? `${myWellStatics?.water_level} SM`
				: 'malumot yoq',
			color: 'aqua',
		},
		{
			icon: IconTemperature,
			label: 'Suv harorati',
			value: statistics
				.filter(stat => stat?.number === `${item?.number};`)
				.filter(
					el =>
						el?.received_at.split('T')[0] ==
						`${mem.toString().split(' ')[3]}-${monthToNumber(
							mem.toString().split(' ')[1]
						)}-${mem.toString().split(' ')[2]}`
				).length
				? `${myWellStatics?.temperature} ℃`
				: 'malumot yoq',
			color: '#FAB005',
		},
		{
			icon: IconCookie,
			label: "Sho'rlanish darajasi",
			value: statistics
				.filter(stat => stat?.number === `${item?.number};`)
				.filter(
					el =>
						el?.received_at.split('T')[0] ==
						`${mem.toString().split(' ')[3]}-${monthToNumber(
							mem.toString().split(' ')[1]
						)}-${mem.toString().split(' ')[2]}`
				).length
				? myWellStatics?.salinity
				: 'malumot yoq',
			color: '#FA5252',
		},
	]
	const stats = options.map(well => (
		<Paper
			className={classes.stat}
			style={{ background: `${well.color}`, border: '2px solid #eee' }}
			radius='md'
			shadow='md'
			p='xs'
			key={well.label}
		>
			<well.icon
				style={{ width: rem(32), height: rem(32) }}
				className={classes.icon_}
				stroke={1.5}
			/>
			<div>
				<Text className={classes.label}>{well.label}</Text>
				<Text fz='xs' className={classes.count}>
					<span className={classes.value}>{well.value}</span>
				</Text>
			</div>
		</Paper>
	))
	return item?.well_id ? (
		<>
			<h1>{item?.name}</h1>
			{isLoading ? (
				<Loader />
			) : (
				<div className={classes.root} style={{ position: 'relative' }}>
					<Group style={{ flex: 1 }}>
						<Group
							display={'grid'}
							ta={'center'}
							c={'#fff'}
							className={classes.hours}
						>
							{statistics
								.filter(stat => stat?.number === `${item?.number};`)
								.filter(
									el =>
										el?.received_at.split('T')[0] ==
										`${mem.toString().split(' ')[3]}-${monthToNumber(
											mem.toString().split(' ')[1]
										)}-${mem.toString().split(' ')[2]}`
								).length > 0
								? statistics
										.filter(stat => stat?.number === `${item?.number};`)
										.filter(
											el =>
												el?.received_at.split('T')[0] ==
												`${mem.toString().split(' ')[3]}-${monthToNumber(
													mem.toString().split(' ')[1]
												)}-${mem.toString().split(' ')[2]}`
										)
										.map(hours => (
											<Button
												key={hours?.message_id}
												onClick={() => setTime(hours?.received_at)}
												className={
													hours.received_at === time ? 'active_btn' : ''
												}
											>
												{convertTo24Hours(
													addFiveHours(
														`${
															hours?.received_at.split(':')[0].split('T')[1]
														}:${hours?.received_at.split(':')[1]}:${
															hours?.received_at.split(':')[2]
														}`
													)
												)}
											</Button>
										))
								: 'malumot yoq'}
						</Group>
						<div className={classes.data_picker}>
							<DataPicker
								setMem={setMem}
								mem={mem}
								setDataPickerDate={setDataPickerDate}
							/>
						</div>
						<p className={classes.date}>
							{
								isWellStatistics[
									isWellStatistics.length - 1
								]?.received_at.split('T')[0]
							}
						</p>
						{stats}
					</Group>
				</div>
			)}
			{/* <div className={classes.bottom}>
				<div className={classes.month_picker}>
					<MonthPicker value={value} onChange={setValue} />
				</div>
				<LineChart
					h={300}
					data={data}
					dataKey='date'
					series={[
						{ name: 'water_level', color: 'indigo.6' },
						{ name: 'temperature', color: 'blue.6' },
						{ name: 'salinity', color: 'teal.6' },
					]}
					curveType='linear'
				/>
			</div> */}

			<iframe
				className={classes.iframe}
				title={item.name}
				loading='lazy'
				src={`https://maps.google.com/maps?q=${item?.latitude},${item?.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
			/>
		</>
	) : (
		<NotFound />
	)
}

export default WellSingle
