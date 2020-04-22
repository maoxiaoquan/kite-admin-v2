import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


function Index() {

  const navigate = useNavigate();
  useEffect(() => {
    navigate('manager/index')
  })

  return (
    <>
    </>
  );
}

export default Index