import classNames from 'classnames';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface IProps {
    children: ReactNode;
}

const DefaultTemplate = (props: IProps) => {
    return (
        <div className="default-template">
            <header className="p-3 bg-dark text-white">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand" to="/">
                            MyApp
                        </NavLink>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            classNames('nav-link', isActive && 'active')
                                        }
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/group"
                                        className={({ isActive }) =>
                                            classNames('nav-link', isActive && 'active')
                                        }
                                    >
                                        Groups
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container my-4">
                {props.children}
            </main>
            <footer className="p-3 bg-light text-center">
                <small>&copy; {new Date().getFullYear()} My Company</small>
            </footer>
        </div>
    );
};

export default DefaultTemplate;