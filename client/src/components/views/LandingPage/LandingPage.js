import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => console.log(response.data));
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
            .then(response => {
                if (response.data.success) {
                    props.history.push('/login');
                } else {
                    alert('로그아웃 실패')
                }
            });
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'}}>
            <h2>Start Page</h2>
            
            <br/>
            <button onClick={onClickHandler}>
                logout
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
