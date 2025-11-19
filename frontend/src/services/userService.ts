import axiosInstance from '@/lib/axios'

export interface User {
  id: string
  name: string
  email: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export const userService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`)
  },
}
