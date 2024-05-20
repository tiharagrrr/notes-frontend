import { Link } from "react-router-dom";

import React from 'react'

const Public = () => {
  return (
    <section className="public">
    <header>
        <h1>Welcome to <span className="nowrap">Tee's Tech Shop</span></h1>
    </header>
    <main className="public__main">
        <p>Located in Mount Lavinia, we provide a trained staff ready to meet your tech repair needs.</p>
        <address className="public__addr">
            Tee's Repairs<br />
            555 St Ritas Drive<br />
            Mount Lavinia, Colombo<br />
            <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Tihara</p>
    </main>
    <footer>
        <Link to="/login">Employee Login</Link>
    </footer>
</section>
  )
}

export default Public