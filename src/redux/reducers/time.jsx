import { createSlice } from '@reduxjs/toolkit';

const date = new Date();
date.setDate(date.getDate() + 1);
const today = new Date(date.getTime() -   24 * 60 * 60 * 1000);
const past7Days = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
const past30Days = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
const past60Days = new Date(date.getTime() - 60 * 24 * 60 * 60 * 1000);
const past90Days = new Date(date.getTime() - 90 * 24 * 60 * 60 * 1000);

const dateRanges = [
    { label: 'today', start_date: formatDate(today), end_date: formatDate(date), name: 'Today' },
    { label: '7days', start_date: formatDate(past7Days), end_date: formatDate(date), name: 'Past 7 Days' },
    { label: '30days', start_date: formatDate(past30Days), end_date: formatDate(date), name: 'Past 30 Days' },
    { label: '60days', start_date: formatDate(past60Days), end_date: formatDate(date), name: 'Past 60 Days' },
    { label: '90days', start_date: formatDate(past90Days), end_date: formatDate(date), name: 'Past 90 Days' }
];

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const timeSlice = createSlice({
    name: 'time',
    initialState: {label: 'today', start_date: formatDate(today), end_date: formatDate(date), name: 'Today'},
    reducers: {
        setDate: (state, action) => {
            const label = action.payload
            state = dateRanges.find(range => range.label === label);
            return state
        },
    },
});

export const { setDate } = timeSlice.actions;
export default timeSlice.reducer;