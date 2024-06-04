import { LineChart } from '@mantine/charts'
import { Button, Group, Loader, Paper, Text, rem } from '@mantine/core'
import { MonthPicker } from '@mantine/dates'
import { IconCookie, IconTemperature, IconWaterpolo } from '@tabler/icons-react'
import { getStatistics, getWells } from 'api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useStatistics } from 'redux/selectors'
import { setStatistics } from 'redux/statistics'
import { NotFound } from 'screens/404'
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
	const [value, setValue] = useState(null)
	const valueMonth = value ? value.toString() : ''
	const months = monthToNumber(valueMonth.split(' ')[1])
	const filteredYear = valueMonth?.split(' ')[3]
	// const [grafic, setGrafic] = useState([])

	// const data = [
	// 	{
	// 		date: 'Mar 22',
	// 		Suv_sathi: 2890,
	// 		Suv_harorati: 2338,
	// 		Shorlanish: 2452,
	// 	},
	// 	{
	// 		date: 'Mar 23',
	// 		Suv_sathi: 2756,
	// 		Suv_harorati: 2103,
	// 		Shorlanish: 2402,
	// 	},
	// 	{
	// 		date: 'Mar 24',
	// 		Suv_sathi: 3322,
	// 		Suv_harorati: 986,
	// 		Shorlanish: 1821,
	// 	},
	// 	{
	// 		date: 'Mar 25',
	// 		Suv_sathi: 3470,
	// 		Suv_harorati: 2108,
	// 		Shorlanish: 2809,
	// 	},
	// 	{
	// 		date: 'Mar 26',
	// 		Suv_sathi: 3129,
	// 		Suv_harorati: 1726,
	// 		Shorlanish: 2290,
	// 	},
	// ]

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
	console.log(prevData)
	const data = []
	for (let i = 0; i < prevData.length; i++) {
		// console.log('time', prevData[i].received_at)
		// console.log('water_level', prevData[i].water_level)
		// console.log('temperature', prevData[i].temperature)
		// console.log('salinity', prevData[i].salinity)
		// setGrafic(e => [{ ...e, data: prevData[i].received_at }])
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
	// setGrafic(e => [...e, ...data])
	// console.log('grafic', grafic)
	console.log(data)
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
			value: `${myWellStatics?.water_level} SM`,
			color: 'aqua',
		},
		{
			icon: IconTemperature,
			label: 'Suv harorati',
			value: `${myWellStatics?.temperature} ℃`,
			color: '#FAB005',
		},
		{
			icon: IconCookie,
			label: "Sho'rlanish darajasi",
			value: myWellStatics?.salinity,
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
				// <div className={classes.root}>
				// <Group style={{ flex: 1 }}>
				// 	<Group display={'grid'} ta={'center'} c={'#fff'}>
				// 		<Button
				// 			disabled={
				// 				!isWellStatistics?.length ||
				// 				index + 1 === isWellStatistics?.length
				// 			}
				// 			color={'green'}
				// 			onClick={() =>
				// 				setIndex(_index => {
				// 					if (_index + 1 === isWellStatistics?.length) {
				// 						return _index
				// 					}
				// 					return _index + 1
				// 				})
				// 			}
				// 		>
				// 			<IconArrowUp />
				// 		</Button>
				// 		<Text>
				// 			{moment(isWellStatistics[index]?.received_at).format(
				// 				'DD/MM/YYYY'
				// 			)}
				// 			{console.log('kkkkkk', isWellStatistics[index]?.received_at)}
				// 		</Text>
				// 		<Text>
				// 			{moment(isWellStatistics[index]?.received_at).format(
				// 				'HH:MM:SS'
				// 			)}
				// 		</Text>
				// 		<Button
				// 			disabled={!isWellStatistics?.length || index === 0}
				// 			color={'green'}
				// 			onClick={() =>
				// 				setIndex(_index => {
				// 					if (_index === 0) {
				// 						return _index
				// 					}
				// 					return _index - 1
				// 				})
				// 			}
				// 		>
				// 			<IconArrowDown />
				// 		</Button>
				// 	</Group>
				// 	{stats}
				// </Group>
				// </div>
				<div className={classes.root}>
					<Group style={{ flex: 1 }}>
						<Group
							display={'grid'}
							ta={'center'}
							c={'#fff'}
							className={classes.hours}
						>
							{isWellStatistics.map(hours => (
								<Button
									key={hours?.message_id}
									onClick={() => setTime(hours?.received_at)}
									className={hours.received_at === time ? 'active_btn' : ''}
								>
									{`${hours?.received_at.split(':')[0].split('T')[1]}:${
										hours?.received_at.split(':')[1]
									}:${hours?.received_at.split(':')[2]}`}
								</Button>
							))}
						</Group>
						{stats}
					</Group>
				</div>
			)}
			<div className={classes.bottom}>
				<div className={classes.month_picker}>
					<MonthPicker value={value} onChange={setValue} />
				</div>
				<LineChart
					h={350}
					data={data}
					dataKey='date'
					series={[
						{ name: 'Suv_sathi', color: 'blue.6' },
						{ name: 'Shorlanish', color: 'red.6' },
						{ name: 'Suv_harorati', color: 'yellow.6' },
					]}
					curveType='linear'
				/>
			</div>
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
