
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User_info from '../../interfaces/user_interface'

export interface Auth_State {
    user_info: User_info | null
}

const initialState: Auth_State = {
    user_info: localStorage.getItem('user_info')
        ? JSON.parse(localStorage.getItem('user_info') as string)
        : null
}

const auth_slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        set_user_credential: (state, action: PayloadAction<User_info>) => {
            state.user_info = action.payload
            try {
                localStorage.setItem('user_info', JSON.stringify(action.payload))
            } catch (error) {
                console.error("Failed to save user info to localStorage:", error);
            }
        }

    }
})

export const { set_user_credential } = auth_slice.actions
export default auth_slice.reducer