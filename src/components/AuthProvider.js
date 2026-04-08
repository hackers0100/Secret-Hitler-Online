import * as React from 'react';
import { authStore } from '../store/authStore';
import { start } from '../actions/auth'
import HelmetMetaData from '../util/HelmetMetaData';


export function AuthProvider({children}) {
    const auth = authStore();

    React.useEffect(() => {
        start().catch(e => {
            console.error('Error starting auth', e);
        })
    }, []);

    if (auth.user === null || auth.user === undefined) {
        return <>
            <HelmetMetaData />
            <div className="App">
                <header className="App-header">
                    SECRET-HITLER.ONLINE
                </header>
                <div>
                    Authorising...
                </div>
            </div>
        </>;
    }

    return <>{children}</>;
}