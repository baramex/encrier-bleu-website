import logo from "../../images/logo.png";

import { Popover, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";
import clsx from 'clsx';
import { Fragment, useEffect, useRef } from "react";
import UserMenu, { UserMenuTab } from "../Misc/UserMenu";

function MobileNavLink({ href, children }) {
    return (
        <Popover.Button as={Link} to={href} className="transition-colors py-1 px-2 text-md">
            {children}
        </Popover.Button>
    )
}

function MobileNavIcon({ open }) {
    return (
        <svg
            aria-hidden="true"
            className="w-8 overflow-visible stroke-theme-50"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            viewBox="0 0 16 12"
        >
            <path
                d="M0 0H16M0 6H16M0 12H16"
                className={clsx(
                    'origin-center transition',
                    open ? 'scale-90 opacity-0' : "scale-100 opacity-1"
                )}
            />
            <path
                d="M2 0 14 12M14 0 2 12"
                className={clsx(
                    'origin-center transition',
                    !open ? 'scale-90 opacity-0' : "scale-100 opacity-1 "
                )}
            />
        </svg>
    )
}

function MobileNavigation({ user, ...props }) {
    return (
        <Popover>
            <Popover.Button
                className="relative z-20 flex items-center justify-center focus:outline-none"
                aria-label="Toggle Navigation"
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="z-10 fixed inset-0 bg-gray-300/50" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        as="nav"
                        className="z-20 absolute w-3/4 right-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-theme-50 p-4 text-gray-900 shadow-xl"
                    >
                        <MobileNavLink href="/">Accueil</MobileNavLink>
                        <hr className="m-2 border-gray-400/50" />
                        {!user && <MobileNavLink href="/login">Se connecter</MobileNavLink>}
                        {user && <UserMenuTab user={user} {...props} />}
                        <p className="text-gray-400 font-light text-xs text-center mt-2"><a className="mr-5" href="/mentions légales.pdf" download>Mentions Légales</a><a href="/rgpd.pdf" download>RGPD</a></p>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

export default function Header({ user, setUser, addAlert, fixed = true }) {
    const header = useRef();

    useEffect(() => {
        if (!fixed) return;

        function onScroll() {
            const v = window.scrollY;

            if (v > 380 && !header.current?.classList.contains("bg-indigo-900/10") && !header.current?.classList.contains("backdrop-blur-md")) {
                header.current?.classList.add("bg-indigo-900/10", "backdrop-blur-md");
            }
            if (v <= 380 && header.current?.classList.contains("bg-indigo-900/10") && header.current?.classList.contains("backdrop-blur-md")) {
                header.current?.classList.remove("bg-indigo-900/10", "backdrop-blur-md");
            }
        }

        window.addEventListener("scroll", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (<>
        <header ref={header} className={clsx("transition-colors transition-300 z-10 py-3 px-5 top-0 w-full", fixed ? "fixed" : "")}>
            <div className="z-10 relative flex items-center min-h-[3.25rem] md:min-h-[3rem]">
                <Link className="absolute left-0 flex items-center gap-2" to="/">
                    <img
                        src={logo}
                        alt="Encrier Bleu"
                        className="h-14 md:h-12" />
                    <h1 className="text-white text-xl font-semibold">Encrier Bleu</h1>
                </Link>
                <nav className="w-full flex justify-end md:justify-center">
                    <div className="hidden md:flex absolute right-0 top-0 h-full items-center gap-x-5 md:gap-x-8">
                        {
                            user ?
                                <UserMenu user={user} setUser={setUser} addAlert={addAlert} />
                                :
                                document.location.pathname === "/login" ?
                                    <NavLink href="/">Accueil</NavLink> :
                                    <NavLink href="/login">Se connecter</NavLink>
                        }
                    </div>
                </nav>
                <div className="md:hidden mr-1">
                    <MobileNavigation user={user} setUser={setUser} addAlert={addAlert} />
                </div>
            </div>
        </header>
    </>);
}

function NavLink({ href, children }) {
    return (
        <Link to={href} className="transition-colors py-1 px-2 text-sm text-white hover:text-indigo-200">
            {children}
        </Link>
    )
}