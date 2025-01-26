import React from 'react'
import { Link } from 'react-router-dom'
import "../../styles/ExploreTab.css";

const Explore = () => {
  return (
    <>
      <header id='exploreHeader'>
        <input type='search' id='searchBar'/>
        <div id="map"></div>
        <nav>
          <Link to={'/contribute'}>Contribute</Link>
          <Link>Explore</Link>
          <Link to={'/contribute'}>Contribute</Link>
        </nav>
      </header>
    </>
  )
}

export default Explore