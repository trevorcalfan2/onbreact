import React from 'react';
import '../css/side.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

const Side = () => {
    return (
        <div className="wrapper d-flex">
            <nav id="sidebar" className="">
                <div className="sidebar-header">
                    <h3>ANGKOR GROUP</h3>
                    <strong>AG</strong>
                </div>

                <ul className="list-unstyled components">
                    <li className="active">
                        <ul className="collapse list-unstyled" id="homeSubmenu">
                            <li>
                                <a href="#">Home 1</a>
                            </li>
                            <li>
                                <a href="#">Home 2</a>
                            </li>
                            <li>
                                <a href="#">Home 3</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-briefcase"></i>
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-image"></i>
                            Portfolio
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-question"></i>
                            FAQ
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-paper-plane"></i>
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>

            <div id="content">
               
            </div>
        </div>
    );
};

export default Side;
