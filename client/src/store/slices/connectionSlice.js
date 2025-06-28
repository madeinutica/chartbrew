import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Async thunks
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/connection/project/${projectId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections')
    }
  }
)

export const createConnection = createAsyncThunk(
  'connections/createConnection',
  async (connectionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/connection', connectionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create connection')
    }
  }
)

export const testConnection = createAsyncThunk(
  'connections/testConnection',
  async (connectionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/connection/test', connectionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Connection test failed')
    }
  }
)

export const updateConnection = createAsyncThunk(
  'connections/updateConnection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/connection/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update connection')
    }
  }
)

export const deleteConnection = createAsyncThunk(
  'connections/deleteConnection',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/connection/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete connection')
    }
  }
)

const connectionSlice = createSlice({
  name: 'connections',
  initialState: {
    connections: [],
    currentConnection: null,
    testResult: null,
    loading: false,
    testing: false,
    error: null,
  },
  reducers: {
    setCurrentConnection: (state, action) => {
      state.currentConnection = action.payload
    },
    clearTestResult: (state) => {
      state.testResult = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Connections
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false
        state.connections = action.payload
        state.error = null
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create Connection
      .addCase(createConnection.pending, (state) => {
        state.loading = true
      })
      .addCase(createConnection.fulfilled, (state, action) => {
        state.loading = false
        state.connections.push(action.payload)
        state.error = null
      })
      .addCase(createConnection.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Test Connection
      .addCase(testConnection.pending, (state) => {
        state.testing = true
        state.testResult = null
      })
      .addCase(testConnection.fulfilled, (state, action) => {
        state.testing = false
        state.testResult = action.payload
        state.error = null
      })
      .addCase(testConnection.rejected, (state, action) => {
        state.testing = false
        state.testResult = { success: false, message: action.payload }
        state.error = action.payload
      })
      
      // Update Connection
      .addCase(updateConnection.fulfilled, (state, action) => {
        const index = state.connections.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.connections[index] = action.payload
        }
        if (state.currentConnection?.id === action.payload.id) {
          state.currentConnection = action.payload
        }
      })
      
      // Delete Connection
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.connections = state.connections.filter(c => c.id !== action.payload)
        if (state.currentConnection?.id === action.payload) {
          state.currentConnection = null
        }
      })
  },
})

export const { setCurrentConnection, clearTestResult, clearError } = connectionSlice.actions
export default connectionSlice.reducer