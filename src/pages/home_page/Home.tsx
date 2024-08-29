// import React from "react";

import { Link } from "react-router-dom"
const Home = () => {
   return (
    <>
       <div>
        <h1>This is my homepage</h1>
        <Link to='user/user_register'><button>click</button>
        </Link>
       </div>
    </>
   )
} 

export default Home