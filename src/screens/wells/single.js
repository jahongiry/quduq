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
		},
		{
			icon: IconTemperature,
			label: 'Suv harorati',
			value: `${isWellStatistics[index]?.temperature} ℃`,
		},
		{
			icon: IconCookie,
			label: "Sho'rlanish darajasi",
			value: isWellStatistics[index]?.salinity,
		},
	]

	const stats = options.map(well => (
		<Paper
			className={classes.stat}
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
							{/* <Text>
								{moment(isWellStatistics[index]?.time).format('DD/MM/YYYY')}
							</Text>
							<Text>
								{moment(isWellStatistics[index]?.time).format('HH:MM:SS')}
							</Text> */}
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
			<iframe
				className={classes.iframe}
				title={item.name}
				loading='lazy'
				src={`https://maps.google.com/maps?q=${item?.latitude},${item?.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
			/>
			<MonthPicker value={value} onChange={setValue} />
		</>
	) : (
		<NotFound />
	)
}

export default WellSingle
