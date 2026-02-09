import { useEffect, useState } from 'react';

export default function FilterableProductTable() {

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [filterText, setFilterText] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const pageCount = Math.ceil(users.length / 4);

    useEffect(() => {
        setIsLoading(true);
        let timer = setTimeout(() => fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json()) //converts the raw response to JSON
            .then(data => { setUsers(data); setIsLoading(false) }) //updates the React state with the JSON and it stores it in the users state to be accessed.)
            .catch(() => { alert("oop! couldn't fetch") }), 1000
        );
        return () => {
            clearTimeout(timer);
        };

    }, []);


    return (
        <div>
            {isLoading ? <p>Loading...</p> : null}
            <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
            <UserTable onUserClick={setSelectedUser} users={users} filterText={filterText} />
            <PageForm pageCount={pageCount} pageNumber={pageNumber} onPageChange={setPageNumber} />

            {selectedUser && <div className="overlay">
                <div className="modal">
                    <h2>{selectedUser.name}</h2>
                    <p>{selectedUser.email}</p>
                    <p>Adress: {selectedUser.address.street}, {selectedUser.address.suite}, {selectedUser.address.city}, {selectedUser.address.zipcode}</p>
                    <p>Phone: {selectedUser.phone}</p>
                    <p>Website: {selectedUser.website}</p>
                    <button onClick={() => setSelectedUser(null)}>Close</button>
                </div>
            </div>}
        </div>
    );
}

function UserRow({ user, onUserClick }) {
    const name = user.name;
    const userArray = _.chunk(React.user.toArray(user), 4)
    // <span>{name}</span>;
    return (
        <tr>
            <td><button className='user' onClick={() => onUserClick(user)}>{name}</button></td>
            <td>{user.email}</td>
            <td>{user.company.name}</td>
        </tr>
    )
}

function UserTable({ onUserClick, users, filterText }) {
    const rows = [];
    users.forEach((user) => {
        if
            (user.name.toLowerCase().indexOf(
                filterText.toLowerCase()
            ) === -1 && user.email.toLowerCase().indexOf(
                filterText.toLowerCase()
            ) === -1
        ) {
            return;
        }
        rows.push(<UserRow onUserClick={onUserClick} user={user} key={user.id} />)
    }

    );

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    )
}

function SearchBar({ filterText, onFilterTextChange }) {
    return (
        <form>
            <input type='text' value={filterText} placeholder='Search...' onChange={(e) => onFilterTextChange(e.target.value)} />
        </form>
    )
}

function PageForm({ pageCount, pageNumber, onPageChange }) {

    function pageMovementDown() {
        if (pageNumber > 1)
            onPageChange(pageNumber - 1);
        else
            return;
    }
    function pageMovementUp() {
        if (pageNumber < pageCount)
            onPageChange((pageNumber + 1))
        else
            return;
    }

    return (
        <div>
            <button onClick={pageMovementDown}> &lt; </button>
            <input value={pageNumber} type="text" name='pageForm' className='pageForm' size={pageCount} onChange={(e) => onPageChange(Number(e.target.value))} />/{pageCount}
            <button onClick={pageMovementUp}> &gt; </button>
        </div>
    )
}
