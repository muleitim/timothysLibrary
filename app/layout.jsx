'use client';

import {
  ClerkProvider,
  SignInButton,
  /*SignUpButton,*/
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');

  const year = new Date().getFullYear();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);


  // Load theme from localStorage on first render
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);


  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ClerkProvider>  
    <html lang="en">
      <body className={`bodyPadding ${theme === 'light' ? 'bodyColor' : ''} `} >
        {/* Top Navbar */}
        <nav className={`navbar navbar-expand-lg navbar-dark px-3 navTextColor fixed-top ${theme === 'light' ? 'navColorLight' : 'navColorDark'} `} >
          <Link prefetch={false} className="navbar-brand navTextColor" href={"/"}>Timothy's Library</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">


            <ul className="navbar-nav ms-auto d-block d-md-none ">
              <li className="nav-item">
                <Link className="nav-link active" href="/">Home</Link>
              </li> 

              <li className="nav-item">
                <Link className="nav-link active" href="/books">Books</Link>
              </li> 

              <li className="nav-item">
                <Link className="nav-link active" href="/borrowers">Borrowers</Link>
              </li> 
            </ul>

            <div className="d-flex flex-column flex-lg-row align-items-right justify-content-end gap-2 w-100 ">            

              <button className="btn btn-link btnBorderColor nav-link text-white navBarSpacing" onClick={toggleTheme} title="Toggle theme">
                    {theme === 'light' ? 'Theme 🌙' : 'Theme ☀️'}
              </button>

              

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-primary rounded-2">
                    Sign In
                  </button>
                </SignInButton>           
              </SignedOut>

              <SignedIn>
                <div className="">
                  <UserButton />
                </div>
              </SignedIn>

            </div>

          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <nav className={`col-md-3 col-lg-2 d-none d-lg-block sidebar p-3 vh-lg-100 position-fixed start-0 overflow-auto `} >
              <div>
                <h5 className="text-center mb-4">Navigation</h5>
                <ul className={`nav flex-column  `}>
                  <li className="nav-item">
                    <Link prefetch={false} className={`nav-link navLinkColorLight ${ theme === 'light' ? 'navLinkColorLight' : 'navLinkColorDark' } `} href={"/"}>📚 Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link prefetch={false} className={`nav-link navLinkColorLight ${ theme === 'light' ? 'navLinkColorLight' : 'navLinkColorDark' } `} href="/books">📚 Books</Link>
                  </li>
                  <li className="nav-item">
                    <Link prefetch={false}  className={`nav-link navLinkColorLight ${ theme === 'light' ? 'navLinkColorLight' : 'navLinkColorDark' } `} href="/borrowers">👤 Borrowers</Link>
                  </li>
                  
                 
                </ul>
              </div>
            </nav>

            {/* Page Content */}
            <main className={`col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 min-vh-100  ${theme === 'light' ? 'mainColor mainBorderLight' : 'mainBorderDark'} `}>
              {children}              
            </main>

            <footer className={`navColor text-white text-center py-3 w-100 ${theme === 'light' ? 'navColorLight' : 'navColorDark'}  `} >
              &copy;{year} Timothy Mulei's Library
            </footer>

            

          </div>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
