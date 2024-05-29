import React from 'react';
import UserTable from './UserTable';

function User({ setView }) {
    return (
        <div>
            <UserTable setView={setView} />
        </div>
    );
}

export default User;
