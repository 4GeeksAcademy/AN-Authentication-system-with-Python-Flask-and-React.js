// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    // Provide the store and dispatch method to all child components.
    
    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}
// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { store, dispatch } = useContext(StoreContext)

    const actions = {
        login: async (email, password) => {
            try {
                const resp = await fetch('https://glorious-space-enigma-69rpx495rq9vf54gg-3001.app.github.dev/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await resp.json();
                if (!resp.ok) {
                    throw new Error(data.error || 'Error en el login');
                }

                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({
                    type: 'set_user',
                    payload: {
                        user: data.user,
                        token: data.access_token,
                    }
                });

                return { login: true };
            } catch (error) {
                dispatch({ type: 'set_error', payload: { error: error.message } });
                return { login: false };
            }
        },

        register: async (newUser) => {
            try {
                const resp = await fetch('https://glorious-space-enigma-69rpx495rq9vf54gg-3001.app.github.dev/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });

                const data = await resp.json();
                if (!resp.ok) {
                    throw new Error(data.msg || 'Error en el registro');
                }
                console.log("Usuario registrado correctamente");
                const { access_token } = data;

                dispatch({
                    type: 'set_user',
                    payload: {
                        user: newUser, // Puedes ajustar esto dependiendo de lo que quieres guardar
                        token: access_token, // Asegúrate de que esta variable esté disponible
                    }
                });

                return { register: true };
            } catch (error) {
                dispatch({ type: 'set_error', payload: { error: error.message } });
                return { register: false };
            }
        },

        checkEmail: async (email) => {
            try {
                const resp = await fetch('https://glorious-space-enigma-69rpx495rq9vf54gg-3001.app.github.dev/api/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await resp.json();
                if (resp.ok && data.exists) {
                    dispatch({
                        type: 'set_email_error',
                        payload: { emailError: 'Este correo electrónico ya está registrado.' },
                    });
                } else {
                    dispatch({
                        type: 'set_email_error',
                        payload: { emailError: null },
                    });
                }
            } catch (error) {
                dispatch({
                    type: 'set_email_error',
                    payload: { emailError: 'Error al verificar el correo electrónico.' },
                });
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'logout' });
        },
    };
    return { store, actions };
};


