import { useEffect, useState } from 'react';

export default function FilterableProductTable() {

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [filterText, setFilterText] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const userCount = 4;
    const pageCount = Math.ceil(users.length / userCount);

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
            {isLoading ? <p>Loading...</p> :
                <div>
                    {isLoading ? <p>Loading...</p> : null}
                    <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
                    <DropdownMenu />
                    <UserTable userCount={userCount} pageNumber={pageNumber} onUserClick={setSelectedUser} users={users} filterText={filterText} />
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
                </div>}
        </div>
    );
}

function UserRow({ user, onUserClick }) {
    const name = user.name;
    // const userArray = _.chunk(React.user.toArray(user), 4)
    // <span>{name}</span>;
    return (
        <tr>
            <td><button className='user' onClick={() => onUserClick(user)}>{name}</button></td>
            <td>{user.email}</td>
            <td>{user.company.name}</td>
        </tr>
    )
}

function UserTable({ userCount, pageNumber, onUserClick, users, filterText }) {
    const rows = [];

    users.slice((pageNumber - 1) * userCount, userCount * pageNumber).forEach((user) => {
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
function DropdownMenu() {
    function dropdownToggle() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
    return <div className="dropdown">
        <button onClick={dropdownToggle} className="dropbtn">Sort:</button>
        <div id="myDropdown" className="dropdown-content">
            <a href="#home">A-Z</a>
            <a href="#about">Z-A</a>
            <a href="#contact">No sorting</a>
        </div>
    </div>
}