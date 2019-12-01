import React from 'react';
import {Link} from 'react-router-dom';

const Nav = (props) => {
    return(
        <div className="topBar">
            <div className="wrapper">
                <div className="barContent">
                    <div className="logo">
                        <img src="" alt=""/>
                        <p></p>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>

                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Nav;