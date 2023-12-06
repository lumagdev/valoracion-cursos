import { create } from "zustand";
import { persist } from "zustand/middleware";
/**
 * Usamos Zustand para el manejo del estado global, en este caso el usuario logueado
 */
const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuth: false,
            
            setUser: (user) => set(() => ({ user })),
            setToken: (token) =>
                set(() => ({
                    token,
                    isAuth: !!token,
                })),
            logout: () => {
                set({user: null, token: null, isAuth: false})
            }
        }),
        {
            name: 'auth',
        }
    )
)

export default useUserStore;