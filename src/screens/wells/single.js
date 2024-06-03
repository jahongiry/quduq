import { LineChart } from '@mantine/charts'
import { Button, Group, Loader, Paper, Text, rem } from '@mantine/core'
import { MonthPicker } from '@mantine/dates'
import {
	IconArrowDown,
	IconArrowUp,
	IconCookie,
	IconTemperature,
	IconWaterpolo,
} from '@tabler/icons-react'
import { getStatistics, getWells } from 'api'
import moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useStatistics } from 'redux/selectors'
import { setStatistics } from 'redux/statistics'
import { NotFound } from 'screens/404'
import classes from './wells.module.css'

const WellSingle = () => {
	const dispatch = useDispatch()
	const statistics = useStatistics()
	const { id } = useParams()
	const [item, setItem] = useState({})
	const [index, setIndex] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [value, setValue] = useState(null)

	const data = [
		{
			date: 'Mar 22',
			Suv_sathi: 2890,
			Suv_harorati: 2338,
			Shorlanish: 2452,
		},
		{
			date: 'Mar 23',
			Suv_sathi: 2756,
			Suv_harorati: 2103,
			Shorlanish: 2402,
		},
		{
			date: 'Mar 24',
			Suv_sathi: 3322,
			Suv_harorati: 986,
			Shorlanish: 1821,
		},
		{
			date: 'Mar 25',
			Suv_sathi: 3470,
			Suv_harorati: 2108,
			Shorlanish: 2809,
		},
		{
			date: 'Mar 26',
			Suv_sathi: 3129,
			Suv_harorati: 1726,
			Shorlanish: 2290,
		},
	]

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
	// console.log('item', item)
	// console.log('statics', statistics)
	const isWellStatistics = useMemo(
		() => statistics.filter(stat => stat?.number === `${item?.number};`),
		[item?.number, statistics]
	)
	console.log('isWellStatistics', isWellStatistics)

	useEffect(() => {
		getData()
		getStat()
	}, [getData, getStat])
	const options = [
		{
			icon: IconWaterpolo,
			label: 'Suv yer sathidan',
			value: `${isWellStatistics[index]?.water_level} SM`,
			color: 'aqua',
		},
		{
			icon: IconTemperature,
			label: 'Suv harorati',
			value: `${isWellStatistics[index]?.temperature} ℃`,
			color: '#FAB005',
		},
		{
			icon: IconCookie,
			label: "Sho'rlanish darajasi",
			value: isWellStatistics[index]?.salinity,
			color: '#FA5252',
		},
	]
	console.log(isWellStatistics[0]?.time)
	const stats = options.map(well => (
		<Paper
			className={classes.stat}
			style={{ background: `${well.color}` }}
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
				<div className={classes.root}>
					<Group style={{ flex: 1 }}>
						<Group display={'grid'} ta={'center'} c={'#fff'}>
							<Button
								disabled={
									!isWellStatistics?.length ||
									index + 1 === isWellStatistics?.length
								}
								color={'green'}
								onClick={() =>
									setIndex(_index => {
										if (_index + 1 === isWellStatistics?.length) {
											return _index
										}
										return _index + 1
									})
								}
							>
								<IconArrowUp />
							</Button>
							<Text>
								{moment(isWellStatistics[index]?.time).format('DD/MM/YYYY')}
							</Text>
							<Text>
								{moment(isWellStatistics[index]?.time).format('HH:MM:SS')}
							</Text>
							<Button
								disabled={!isWellStatistics?.length || index === 0}
								color={'green'}
								onClick={() =>
									setIndex(_index => {
										if (_index === 0) {
											return _index
										}
										return _index - 1
									})
								}
							>
								<IconArrowDown />
							</Button>
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
