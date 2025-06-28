import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Async thunks
export const fetchCharts = createAsyncThunk(
  'charts/fetchCharts',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chart/project/${projectId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch charts')
    }
  }
)

export const createChart = createAsyncThunk(
  'charts/createChart',
  async (chartData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chart', chartData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chart')
    }
  }
)

export const updateChart = createAsyncThunk(
  'charts/updateChart',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/chart/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update chart')
    }
  }
)

export const deleteChart = createAsyncThunk(
  'charts/deleteChart',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/chart/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete chart')
    }
  }
)

const chartSlice = createSlice({
  name: 'charts',
  initialState: {
    charts: [],
    currentChart: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Charts
      .addCase(fetchCharts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.loading = false
        state.charts = action.payload
        state.error = null
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create Chart
      .addCase(createChart.pending, (state) => {
        state.loading = true
      })
      .addCase(createChart.fulfilled, (state, action) => {
        state.loading = false
        state.charts.push(action.payload)
        state.error = null
      })
      .addCase(createChart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Chart
      .addCase(updateChart.fulfilled, (state, action) => {
        const index = state.charts.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.charts[index] = action.payload
        }
        if (state.currentChart?.id === action.payload.id) {
          state.currentChart = action.payload
        }
      })
      
      // Delete Chart
      .addCase(deleteChart.fulfilled, (state, action) => {
        state.charts = state.charts.filter(c => c.id !== action.payload)
        if (state.currentChart?.id === action.payload) {
          state.currentChart = null
        }
      })
  },
})

export const { setCurrentChart, clearError } = chartSlice.actions
export default chartSlice.reducer