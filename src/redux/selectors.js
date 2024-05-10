import { useSelector } from 'react-redux';

export const useUser = () => useSelector(({ user }) => user);
export const useWells = () => useSelector(({ wells }) => wells);
export const useLoading = () => useSelector(({ loading }) => loading);
export const useUsers = () => useSelector(({ users }) => users);
export const useStatistics = () => useSelector(({ statistics }) => statistics);
